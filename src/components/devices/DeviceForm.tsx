import React, { useState, useEffect } from 'react';
import { Device, DeviceType } from '../../types';
import { X } from 'lucide-react';
import { deviceTypeToIcon, deviceTypeToColor } from '../../data/mockData';
import { generateRandomLocation, generateRandomBattery } from '@/features/devices/utils/deviceGenerators';

interface DeviceFormProps {
  onSubmit: (device: Omit<Device, 'id'>) => void;
  onClose: () => void;
  editDevice?: Device;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ onSubmit, onClose, editDevice }) => {
  const [formData, setFormData] = useState<Omit<Device, 'id'>>({
    name: '',
    type: 'phone',
    location: generateRandomLocation(),
    status: 'online',
    battery: generateRandomBattery(),
    lastSeen: new Date(),
    icon: deviceTypeToIcon.phone,
    color: deviceTypeToColor.phone,
  });

  useEffect(() => {
    if (editDevice) {
      const { id, ...deviceData } = editDevice;
      setFormData(deviceData);
    }
  }, [editDevice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as DeviceType;
    setFormData(prev => ({
      ...prev,
      type,
      icon: deviceTypeToIcon[type],
      color: deviceTypeToColor[type],
      // Generate new random values when type changes
      location: generateRandomLocation(),
      battery: generateRandomBattery(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {editDevice ? 'Edit Device' : 'Add New Device'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Device Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="My Device"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Device Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="phone">Phone</option>
              <option value="laptop">Laptop</option>
              <option value="tablet">Tablet</option>
              <option value="keys">Keys</option>
              <option value="watch">Watch</option>
              <option value="headphones">Headphones</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {editDevice ? 'Update Device' : 'Add Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;
