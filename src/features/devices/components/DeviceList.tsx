import React from 'react';
import { Device, DeviceType } from '@/types';
import { DeviceCard } from './DeviceCard';

interface DeviceListProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (id: string) => void;
  filter: {
    type?: DeviceType;
    status?: string;
  };
}

export const DeviceList: React.FC<DeviceListProps> = ({ 
  devices, 
  selectedDevice, 
  onSelectDevice,
  filter
}) => {
  const filteredDevices = devices.filter(device => 
    (!filter.type || device.type === filter.type) && 
    (!filter.status || device.status === filter.status)
  );

  if (filteredDevices.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No devices found matching the current filters.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {filteredDevices.map(device => (
        <DeviceCard
          key={device.id}
          device={device}
          isSelected={selectedDevice?.id === device.id}
          onClick={() => onSelectDevice(device.id)}
        />
      ))}
    </ul>
  );
};
