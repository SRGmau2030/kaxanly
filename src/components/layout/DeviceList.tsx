import React, { useState, useEffect } from 'react';
import { Device, DeviceType } from '../../types';
import { Battery, Clock, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceListProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (id: string) => void;
  filter: {
    type?: DeviceType;
    status?: string;
  };
}

const DeviceList: React.FC<DeviceListProps> = ({ 
  devices, 
  selectedDevice, 
  onSelectDevice,
  filter
}) => {
  const [deviceIcons, setDeviceIcons] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadIcons = async () => {
      try {
        const icons = await import('lucide-react');
        const newIcons: Record<string, any> = {};
        devices.forEach(device => {
          newIcons[device.id] = icons[device.icon] || icons.HelpCircle;
        });
        setDeviceIcons(newIcons);
      } catch (e) {
        console.error("Failed to load icons", e);
        const fallbackIcons: Record<string, any> = {};
        devices.forEach(device => {
          fallbackIcons[device.id] = HelpCircle;
        });
        setDeviceIcons(fallbackIcons);
      }
    };

    loadIcons();
  }, [devices]);

  const filteredDevices = devices.filter(device => 
    (!filter.type || device.type === filter.type) && 
    (!filter.status || device.status === filter.status)
  );

  const getBatteryColorClass = (batteryLevel?: number) => {
    if (batteryLevel === undefined) return 'text-gray-400';
    if (batteryLevel < 20) return 'text-red-500';
    if (batteryLevel < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'unknown':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getRoomName = (roomId: string) => {
    const roomMap: Record<string, string> = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'kitchen': 'Kitchen',
      'bathroom': 'Bathroom',
      'office': 'Office',
      'garage': 'Garage',
    };
    
    return roomMap[roomId] || 'Unknown Room';
  };

  return (
    <div className="overflow-y-auto">
      {filteredDevices.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No devices found matching the current filters.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {filteredDevices.map(device => {
            const DeviceIcon = deviceIcons[device.id] || HelpCircle;
            return (
              <li 
                key={device.id}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedDevice?.id === device.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectDevice(device.id)}
              >
                <div className="flex items-center p-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    style={{ backgroundColor: `${device.color}20` }}
                  >
                    <div style={{ color: device.color }}>
                      <DeviceIcon size={20} />
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
          })}
        </ul>
      )}
    </div>
  );
};

export default DeviceList;
