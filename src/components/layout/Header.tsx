import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { Plus, Search, X, Menu, AlertCircle } from 'lucide-react';

interface HeaderProps {
  onAddDevice: () => void;
  onToggleSidebar: () => void;
  onSearch: (query: string) => void;
  isHouseScanned: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddDevice, 
  onToggleSidebar, 
  onSearch,
  isHouseScanned 
}) => {
  const { devices } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setIsSearching(false);
  };

  const toggleSearch = () => {
    if (isSearching) {
      clearSearch();
    } else {
      setIsSearching(true);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="mr-3 p-2 rounded-full md:hidden hover:bg-gray-100 transition-colors"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center space-x-3">
          <img
            src="https://i.ibb.co/tpVT90zM/logo-kaxanly.jpg"
            alt="Logo Kaxanly"
            className="h-10 w-10 rounded-full object-cover border-2 border-white"
          />
          <span className="text-xl font-bold">Kaxanly</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {isSearching ? (
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search devices..."
              className="py-2 pl-3 pr-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-[180px] md:w-[240px]"
              autoFocus
            />
            <button 
              className="absolute right-2 text-gray-500 hover:text-gray-700"
              onClick={clearSearch}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleSearch}
          >
            <Search size={20} />
          </button>
        )}

        <button 
          className={`flex items-center justify-center rounded-full p-2 transition-colors relative ${
            isHouseScanned 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={onAddDevice}
          aria-label="Add Device"
          disabled={!isHouseScanned}
        >
          <Plus size={20} />
          {!isHouseScanned && (
            <div className="absolute -top-1 -right-1">
              <AlertCircle size={14} className="text-yellow-500" />
            </div>
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200"></div>
    </header>
  );
};

export default Header;
