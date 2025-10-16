import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Device, DeviceType, HomeLayout } from '../types';
import { deviceService } from '../services/deviceService';
import { roomService } from '../services/roomService';

interface DeviceContextType {
  devices: Device[];
  selectedDevice: Device | null;
  homeLayout: HomeLayout | null;
  loading: boolean;
  error: string | null;
  addDevice: (device: Omit<Device, 'id'>) => Promise<void>;
  updateDevice: (id: string, updates: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  selectDevice: (id: string | null) => void;
  filterDevices: (type?: DeviceType, status?: string) => Device[];
  playSound: (id: string) => void;
  isSounding: Record<string, boolean>;
  refreshDevices: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [homeLayout, setHomeLayout] = useState<HomeLayout | null>(null);
  const [isSounding, setIsSounding] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

  const refreshDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [devicesData, layoutData] = await Promise.all([
        deviceService.getAll(DEMO_USER_ID),
        roomService.getHomeLayout(DEMO_USER_ID)
      ]);
      setDevices(devicesData);
      setHomeLayout(layoutData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
      console.error('Error loading devices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  const addDevice = useCallback(async (device: Omit<Device, 'id'>) => {
    try {
      const isDuplicate = await deviceService.checkDuplicate(
        device.name,
        device.type,
        DEMO_USER_ID
      );

      if (isDuplicate) {
        throw new Error(`A device with the name "${device.name}" and type "${device.type}" already exists.`);
      }

      const newDevice = await deviceService.create({
        name: device.name,
        type: device.type,
        location: device.location,
        status: device.status,
        battery: device.battery,
        icon: device.icon,
        color: device.color,
      }, DEMO_USER_ID);
      setDevices(prev => [...prev, newDevice]);
    } catch (err) {
      console.error('Error adding device:', err);
      throw err;
    }
  }, []);

  const updateDevice = useCallback(async (id: string, updates: Partial<Device>) => {
    try {
      if (updates.name !== undefined && updates.type !== undefined) {
        const isDuplicate = await deviceService.checkDuplicate(
          updates.name,
          updates.type,
          DEMO_USER_ID,
          id
        );

        if (isDuplicate) {
          throw new Error(`A device with the name "${updates.name}" and type "${updates.type}" already exists.`);
        }
      }

      const updatedDevice = await deviceService.update(id, {
        name: updates.name,
        type: updates.type,
        location: updates.location,
        status: updates.status,
        battery: updates.battery,
        icon: updates.icon,
        color: updates.color,
      }, DEMO_USER_ID);

      setDevices(prev =>
        prev.map(device =>
          device.id === id ? updatedDevice : device
        )
      );

      if (selectedDevice?.id === id) {
        setSelectedDevice(updatedDevice);
      }
    } catch (err) {
      console.error('Error updating device:', err);
      throw err;
    }
  }, [selectedDevice]);

  const deleteDevice = useCallback(async (id: string) => {
    try {
      await deviceService.delete(id, DEMO_USER_ID);
      setDevices(prev => prev.filter(device => device.id !== id));
      if (selectedDevice?.id === id) {
        setSelectedDevice(null);
      }
    } catch (err) {
      console.error('Error deleting device:', err);
      throw err;
    }
  }, [selectedDevice]);

  const selectDevice = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedDevice(null);
      return;
    }
    
    const device = devices.find(d => d.id === id) || null;
    setSelectedDevice(device);
  }, [devices]);

  const filterDevices = useCallback((type?: DeviceType, status?: string) => {
    return devices.filter(device => 
      (!type || device.type === type) && 
      (!status || device.status === status)
    );
  }, [devices]);

  const playSound = useCallback((id: string) => {
    setIsSounding(prev => ({ ...prev, [id]: true }));
    
    // Simulate device playing sound for 5 seconds
    setTimeout(() => {
      setIsSounding(prev => ({ ...prev, [id]: false }));
    }, 5000);
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        selectedDevice,
        homeLayout,
        loading,
        error,
        addDevice,
        updateDevice,
        deleteDevice,
        selectDevice,
        filterDevices,
        playSound,
        isSounding,
        refreshDevices
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};
