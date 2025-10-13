import React, { useState } from 'react';
import { DeviceProvider } from './context/DeviceContext';
import { useDevices } from './context/DeviceContext';
import { DeviceType, Device } from './types';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import HomeMap from './components/map/HomeMap';
import DeviceDetail from './components/devices/DeviceDetail';
import DeviceForm from './components/devices/DeviceForm';
import DeviceList from './components/layout/DeviceList';
import { format } from 'date-fns';
import { HouseScanner } from './features/home/components/HouseScanner';

const AppContent = () => {
  const {
    devices,
    selectedDevice,
    selectDevice,
    addDevice,
    updateDevice,
    deleteDevice,
    playSound,
    loading,
    error
  } = useDevices();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [isEditingDevice, setIsEditingDevice] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{
    type?: DeviceType;
    status?: string;
  }>({});
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHouseScanned, setIsHouseScanned] = useState(false);

  const handleAddDevice = () => {
    if (!isHouseScanned) {
      return;
    }
    setIsAddingDevice(true);
  };

  const handleEditDevice = () => {
    setIsEditingDevice(true);
  };

  const handleFormSubmit = async (device: Omit<Device, 'id'>) => {
    try {
      if (isEditingDevice && selectedDevice) {
        await updateDevice(selectedDevice.id, device);
        setIsEditingDevice(false);
      } else {
        await addDevice(device);
        setIsAddingDevice(false);
      }
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  const handleDeleteDevice = async () => {
    if (selectedDevice) {
      try {
        await deleteDevice(selectedDevice.id);
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  const handleFilterChange = (type?: DeviceType, status?: string) => {
    setActiveFilter({ type, status });
    setIsSidebarOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredDevices = devices.filter(device => {
    const matchesFilter = (!activeFilter.type || device.type === activeFilter.type) && 
                         (!activeFilter.status || device.status === activeFilter.status);
    
    const matchesSearch = !searchQuery || 
                         device.name.toLowerCase().includes(searchQuery) ||
                         device.type.toLowerCase().includes(searchQuery);
    
    return matchesFilter && matchesSearch;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading devices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        onAddDevice={handleAddDevice}
        onToggleSidebar={toggleSidebar}
        onSearch={handleSearch}
        isHouseScanned={isHouseScanned}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {activeFilter.type 
                  ? activeFilter.type.charAt(0).toUpperCase() + activeFilter.type.slice(1) + 's'
                  : 'All Devices'}
              </h2>
              <p className="text-sm text-gray-500">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={toggleViewMode}
                className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'map' ? 'Show List' : 'Show Map'}
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-hidden">
            {viewMode === 'map' ? (
              <div className="h-full">
                <HomeMap devices={filteredDevices} />
              </div>
            ) : (
              <div className="h-full bg-white rounded-lg shadow overflow-hidden">
                <DeviceList 
                  devices={filteredDevices}
                  selectedDevice={selectedDevice}
                  onSelectDevice={selectDevice}
                  filter={activeFilter}
                />
              </div>
            )}
          </div>
        </main>
        
        {selectedDevice && !isEditingDevice && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40 p-4 md:p-0 md:inset-auto md:right-4 md:bottom-4 md:top-auto md:left-auto md:bg-transparent">
            <DeviceDetail 
              device={selectedDevice}
              onClose={() => selectDevice(null)}
              onPlaySound={() => playSound(selectedDevice.id)}
              onEdit={handleEditDevice}
              onDelete={handleDeleteDevice}
            />
          </div>
        )}
      </div>
      
      {(isAddingDevice || isEditingDevice) && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <DeviceForm 
            onSubmit={handleFormSubmit}
            onClose={() => {
              setIsAddingDevice(false);
              setIsEditingDevice(false);
            }}
            editDevice={isEditingDevice ? selectedDevice : undefined}
          />
        </div>
      )}

      {!isHouseScanned && (
        <HouseScanner onScanComplete={() => setIsHouseScanned(true)} />
      )}
    </div>
  );
};

function App() {
  return (
    <DeviceProvider>
      <AppContent />
    </DeviceProvider>
  );
}

export default App;
