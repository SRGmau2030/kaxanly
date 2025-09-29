import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Device, DeviceType } from '../types';
import { mockDevices } from '../data/mockData';

interface DeviceContextType {
  devices: Device[];
  selectedDevice: Device | null;
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  selectDevice: (id: string | null) => void;
  filterDevices: (type?: DeviceType, status?: string) => Device[];
  playSound: (id: string) => void;
  isSounding: Record<string, boolean>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isSounding, setIsSounding] = useState<Record<string, boolean>>({});

  const addDevice = useCallback((device: Omit<Device, 'id'>) => {
    const newDevice: Device = {
      ...device,
      id: Date.now().toString(),
      lastSeen: new Date(),
    };
    setDevices(prev => [...prev, newDevice]);
  }, []);

  const updateDevice = useCallback((id: string, updates: Partial<Device>) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id ? { ...device, ...updates, lastSeen: new Date() } : device
      )
    );
    
    if (selectedDevice?.id === id) {
      setSelectedDevice(prev => prev ? { ...prev, ...updates, lastSeen: new Date() } : null);
    }
  }, [selectedDevice]);

  const deleteDevice = useCallback((id: string) => {
    setDevices(prev => prev.filter(device => device.id !== id));
    if (selectedDevice?.id === id) {
      setSelectedDevice(null);
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
        addDevice, 
        updateDevice, 
        deleteDevice, 
        selectDevice,
        filterDevices,
        playSound,
        isSounding
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
