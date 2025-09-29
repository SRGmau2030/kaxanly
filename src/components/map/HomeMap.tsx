import React, { useState } from 'react';
import { Room, Device } from '../../types';
import { homeLayout } from '../../data/mockData';
import { useDevices } from '../../context/DeviceContext';
import DeviceMarker from './DeviceMarker';

interface HomeMapProps {
  devices: Device[];
}

const HomeMap: React.FC<HomeMapProps> = ({ devices }) => {
  const { selectDevice, selectedDevice } = useDevices();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const maxX = Math.max(...homeLayout.rooms.map(room => room.x + room.width));
  const maxY = Math.max(...homeLayout.rooms.map(room => room.y + room.height));

  const handleZoom = (factor: number) => {
    setScale(prev => {
      const newScale = prev * factor;
      return Math.min(Math.max(newScale, 0.5), 2);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const renderRoom = (room: Room) => {
    return (
      <g key={room.id}>
        <rect
          x={room.x}
          y={room.y}
          width={room.width}
          height={room.height}
          fill="#f5f5f5"
          stroke="#d1d5db"
          strokeWidth="2"
          rx="4"
        />
        <text
          x={room.x + room.width / 2}
          y={room.y + room.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="#6b7280"
        >
          {room.name}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50 rounded-lg shadow-inner">
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          onClick={() => handleZoom(1.2)}
        >
          +
        </button>
        <button
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          onClick={() => handleZoom(0.8)}
        >
          -
        </button>
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${maxX} ${maxY}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transformOrigin: 'center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {homeLayout.rooms.map(renderRoom)}

        {devices.map(device => {
          const room = homeLayout.rooms.find(r => r.id === device.location.roomId);
          if (!room) return null;
          
          return (
            <DeviceMarker
              key={device.id}
              device={device}
              room={room}
              isSelected={selectedDevice?.id === device.id}
              onClick={() => selectDevice(device.id)}
            />
          );
        })}
      </svg>

      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm text-xs text-gray-500">
        Drag to move • Zoom with +/- buttons
      </div>
    </div>
  );
};

export default HomeMap;
