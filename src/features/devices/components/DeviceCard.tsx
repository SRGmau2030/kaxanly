import React from 'react';
import { Device } from '@/types';
import { Battery, Clock, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDeviceIcon } from '@/features/devices/hooks/useDeviceIcon';
import { getBatteryColorClass, getStatusColorClass } from '@/features/devices/utils/deviceStyles';
import { getRoomName } from '@/features/home/utils/roomUtils';

interface DeviceCardProps {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, isSelected, onClick }) => {
  const Icon = useDeviceIcon(device.icon);

  return (
    <li 
      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center p-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
          style={{ backgroundColor: `${device.color}20` }}
        >
          <div style={{ color: device.color }}>
            {Icon ? <Icon size={20} /> : <HelpCircle size={20} />}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900 truncate">
              {device.name}
            </p>
            <div className={`ml-2 w-2 h-2 rounded-full ${getStatusColorClass(device.status)}`}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {getRoomName(device.location.roomId)}
          </p>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 space-x-3">
          {device.battery !== undefined && (
            <div className="flex items-center">
              <Battery size={14} className={getBatteryColorClass(device.battery)} />
              <span className="ml-1">{device.battery}%</span>
            </div>
          )}
          <div className="flex items-center">
            <Clock size={14} className="text-gray-400" />
            <span className="ml-1">
              {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};
