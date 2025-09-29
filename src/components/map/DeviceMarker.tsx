import React from 'react';
import { Device, Room } from '../../types';
import { Smartphone, Laptop, Tablet, Key, Watch, Headphones, HelpCircle, Volume2 } from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface DeviceMarkerProps {
  device: Device;
  room: Room;
  isSelected: boolean;
  onClick: () => void;
}

const DeviceMarker: React.FC<DeviceMarkerProps> = ({ device, room, isSelected, onClick }) => {
  const { isSounding, playSound } = useDevices();
  
  // Calculate absolute position within the map
  const x = room.x + device.location.x;
  const y = room.y + device.location.y;

  // Determine icon based on device type
  const renderIcon = () => {
    switch (device.type) {
      case 'phone':
        return <Smartphone size={12} />;
      case 'laptop':
        return <Laptop size={12} />;
      case 'tablet':
        return <Tablet size={12} />;
      case 'keys':
        return <Key size={12} />;
      case 'watch':
        return <Watch size={12} />;
      case 'headphones':
        return <Headphones size={12} />;
      default:
        return <HelpCircle size={12} />;
    }
  };

  // Determine the status indicator color
  const getStatusColor = () => {
    switch (device.status) {
      case 'online':
        return '#10B981'; // green
      case 'offline':
        return '#6B7280'; // gray
      case 'unknown':
        return '#F59E0B'; // amber
      default:
        return '#6B7280';
    }
  };

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound(device.id);
  };

  const baseSize = 24;
  const selectedSize = 32;
  const size = isSelected ? selectedSize : baseSize;

  return (
    <g
      transform={`translate(${x - size/2}, ${y - size/2})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className="transition-all duration-200"
    >
      {/* Main circle */}
      <circle
        cx={size/2}
        cy={size/2}
        r={size/2}
        fill={device.color}
        opacity={isSelected ? 1 : 0.9}
        className="transition-all duration-200"
      />

      {/* Icon */}
      <foreignObject x={size/2 - 6} y={size/2 - 6} width="12" height="12">
        <div className="flex items-center justify-center text-white">
          {renderIcon()}
        </div>
      </foreignObject>

      {/* Status indicator */}
      <circle
        cx={size - 4}
        cy={size - 4}
        r={4}
        fill={getStatusColor()}
        stroke="white"
        strokeWidth="1"
      />

      {/* Device name (only show when selected) */}
      {isSelected && (
        <g>
          <rect
            x={-10}
            y={size + 4}
            width={size + 20}
            height={22}
            rx={4}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
          <text
            x={size/2}
            y={size + 19}
            fontSize="10"
            textAnchor="middle"
            fill="#374151"
          >
            {device.name}
          </text>
        </g>
      )}

      {/* Sound wave animation when playing sound */}
      {isSounding[device.id] && (
        <>
          <circle
            cx={size/2}
            cy={size/2}
            r={size/1.5}
            fill="none"
            stroke={device.color}
            strokeWidth="2"
            opacity="0.5"
            className="animate-ping"
          />
          <circle
            cx={size + 10}
            cy={size - 10}
            r={10}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="1"
            className="cursor-pointer"
            onClick={handlePlaySound}
          />
          <foreignObject x={size + 5} y={size - 15} width="10" height="10">
            <div className="flex items-center justify-center text-gray-500">
              <Volume2 size={10} />
            </div>
          </foreignObject>
        </>
      )}
      
      {/* Play sound button (only show when selected) */}
      {isSelected && !isSounding[device.id] && (
        <>
          <circle
            cx={size + 10}
            cy={size - 10}
            r={10}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="1"
            className="cursor-pointer"
            onClick={handlePlaySound}
          />
          <foreignObject x={size + 5} y={size - 15} width="10" height="10">
            <div className="flex items-center justify-center text-gray-500">
              <Volume2 size={10} />
            </div>
          </foreignObject>
        </>
      )}
    </g>
  );
};

export default DeviceMarker;
