import React, { useState, useEffect } from 'react';
import { Device } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Battery, Clock, MapPin, X, Volume2, Pencil, Trash2, HelpCircle } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface DeviceDetailProps {
  device: Device;
  onClose: () => void;
  onPlaySound: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({
  device,
  onClose,
  onPlaySound,
  onEdit,
  onDelete
}) => {
  const { homeLayout } = useDevices();
  const [Icon, setIcon] = useState<any>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const icons = await import('lucide-react');
        setIcon(() => icons[device.icon] || icons.HelpCircle);
      } catch (e) {
        console.error("Failed to load icon", e);
        setIcon(() => HelpCircle);
      }
    };

    loadIcon();
  }, [device.icon]);

  const getBatteryColorClass = () => {
    if (!device.battery) return 'text-gray-400';
    if (device.battery < 20) return 'text-red-500';
    if (device.battery < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    switch (device.status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'unknown':
        return 'Unknown';
      default:
        return '';
    }
  };

  const getStatusColorClass = () => {
    switch (device.status) {
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

  const getRoomName = () => {
    if (!homeLayout) return 'Unknown Room';
    const room = homeLayout.rooms.find(r => r.id === device.location.roomId);
    return room ? room.name : 'Unknown Room';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
      <div className="relative p-6 pb-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: `${device.color}20` }}
          >
            <div className="text-2xl" style={{ color: device.color }}>
              {Icon ? <Icon size={24} /> : <HelpCircle size={24} />}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{device.name}</h2>
            <div className="flex items-center mt-1">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColorClass()} mr-2`}></div>
              <span className="text-sm text-gray-600">{getStatusText()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {device.battery !== undefined && (
            <div className="flex items-center">
              <Battery size={18} className={getBatteryColorClass()} />
              <span className="ml-3 text-gray-700">
                Battery: <span className={getBatteryColorClass()}>{device.battery}%</span>
              </span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock size={18} className="text-gray-400" />
            <span className="ml-3 text-gray-700">
              Last seen: {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={18} className="text-gray-400" />
            <span className="ml-3 text-gray-700">
              Location: {getRoomName()}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onPlaySound}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
          >
            <Volume2 size={18} className="mr-2" />
            Play Sound
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-3 flex justify-between">
        <button 
          onClick={onEdit}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Pencil size={16} className="mr-1" />
          Edit
        </button>
        
        <button 
          onClick={onDelete}
          className="flex items-center text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeviceDetail;
