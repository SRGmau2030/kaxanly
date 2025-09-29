import React from 'react';
import { useDevices } from '../../context/DeviceContext';
import { DeviceType } from '../../types';
import { 
  Smartphone, Laptop, Key, Watch, Headphones, Tablet, HelpCircle, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: {
    type?: DeviceType;
    status?: string;
  };
  onFilterChange: (type?: DeviceType, status?: string) => void;
}

const deviceTypes = [
  { type: 'all', label: 'All Devices', icon: null },
  { type: 'phone', label: 'Phones', icon: <Smartphone size={18} /> },
  { type: 'laptop', label: 'Laptops', icon: <Laptop size={18} /> },
  { type: 'tablet', label: 'Tablets', icon: <Tablet size={18} /> },
  { type: 'keys', label: 'Keys', icon: <Key size={18} /> },
  { type: 'watch', label: 'Watches', icon: <Watch size={18} /> },
  { type: 'headphones', label: 'Headphones', icon: <Headphones size={18} /> },
  { type: 'other', label: 'Other', icon: <HelpCircle size={18} /> },
];

const statusTypes = [
  { status: 'all', label: 'All Status' },
  { status: 'online', label: 'Online' },
  { status: 'offline', label: 'Offline' },
  { status: 'unknown', label: 'Unknown' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeFilter, 
  onFilterChange 
}) => {
  const { devices } = useDevices();

  const getDeviceCountByType = (type?: string) => {
    if (!type || type === 'all') return devices.length;
    return devices.filter(device => device.type === type).length;
  };

  const getDeviceCountByStatus = (status?: string) => {
    if (!status || status === 'all') return devices.length;
    return devices.filter(device => device.status === status).length;
  };

  return (
    <>
      {/* Overlay on mobile */}
      <div 
        className={`fixed inset-0 bg-black/30 z-20 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-full w-64 bg-white shadow-lg md:shadow-none z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="py-6 h-full flex flex-col">
          <div className="px-4 flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-lg font-medium">Filters</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="px-4 mb-6">
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Device Type</h3>
              <ul className="space-y-1">
                {deviceTypes.map((item) => (
                  <li key={item.type}>
                    <button
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-left ${
                        (activeFilter.type === item.type || (!activeFilter.type && item.type === 'all'))
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onFilterChange(
                        item.type === 'all' ? undefined : item.type as DeviceType, 
                        activeFilter.status === 'all' ? undefined : activeFilter.status
                      )}
                    >
                      <span className="flex items-center">
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span>{item.label}</span>
                      </span>
                      <span className="text-xs font-medium rounded-full px-2 py-1 bg-gray-100">
                        {getDeviceCountByType(item.type)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-4 mb-6">
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Status</h3>
              <ul className="space-y-1">
                {statusTypes.map((item) => (
                  <li key={item.status}>
                    <button
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-left ${
                        (activeFilter.status === item.status || (!activeFilter.status && item.status === 'all'))
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onFilterChange(
                        activeFilter.type === 'all' ? undefined : activeFilter.type, 
                        item.status === 'all' ? undefined : item.status
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs font-medium rounded-full px-2 py-1 bg-gray-100">
                        {getDeviceCountByStatus(item.status)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
