import React, { useState, useEffect } from 'react';
import { Scan, Check, Home } from 'lucide-react';

interface HouseScannerProps {
  onScanComplete: () => void;
}

export const HouseScanner: React.FC<HouseScannerProps> = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentRoom, setCurrentRoom] = useState('');
  const [scanned, setScanned] = useState(false);

  const rooms = [
    'Living Room',
    'Kitchen',
    'Bedroom',
    'Bathroom',
    'Office',
    'Garage'
  ];

  useEffect(() => {
    if (scanning && progress < 100) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            setScanning(false);
            setScanned(true);
            setTimeout(onScanComplete, 1000);
            return 100;
          }
          return next;
        });

        setCurrentRoom(rooms[Math.floor((progress / 100) * rooms.length)]);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [scanning, progress, onScanComplete]);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setScanned(false);
  };

  return (
    <div className="fixed inset-0 bg-blue-500 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-500" />
      
      <div className="relative bg-white/10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden w-full max-w-md border border-white/20">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className={`relative w-32 h-32 ${scanning ? 'animate-pulse' : ''}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Home size={64} className="text-white" />
              </div>
              {scanning && (
                <div className="absolute inset-0">
                  <div className="w-full h-full border-4 border-white rounded-full animate-ping opacity-50" />
                </div>
              )}
              {scanned && (
                <div className="absolute top-0 right-0">
                  <div className="bg-green-400 rounded-full p-2">
                    <Check size={24} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-4 text-white">
            {!scanning && !scanned && 'House Scanner'}
            {scanning && 'Scanning House...'}
            {scanned && 'Scan Complete!'}
          </h2>

          {scanning && (
            <>
              <div className="mb-4">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-center text-sm text-white/80">
                  {progress}% Complete
                </div>
              </div>

              <div className="text-center text-sm text-white/80">
                <div className="animate-pulse">
                  <Scan className="inline-block mr-2" size={16} />
                  Scanning: {currentRoom}
                </div>
              </div>
            </>
          )}

          {!scanning && !scanned && (
            <div className="text-center text-white/80 mb-6">
              <p>Click the button below to start scanning your house layout.</p>
              <p className="text-sm mt-2">This will help us accurately track your devices.</p>
            </div>
          )}

          {scanned && (
            <div className="text-center text-white/80 mb-6">
              <p>House layout has been successfully mapped!</p>
              <p className="text-sm mt-2">You can now start adding your devices.</p>
            </div>
          )}

          {!scanning && !scanned && (
            <button
              onClick={startScan}
              className="w-full bg-white text-blue-500 py-2 px-4 rounded-md hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 transition-colors font-medium"
            >
              Start Scanning
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
