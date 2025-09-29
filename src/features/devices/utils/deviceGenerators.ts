import { homeLayout } from '@/data/mockData';
import { Location } from '@/types';

export const generateRandomLocation = (): Location => {
  // Get a random room from the layout
  const rooms = homeLayout.rooms;
  const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
  
  // Generate random coordinates within the room's dimensions
  const x = Math.floor(Math.random() * (randomRoom.width - 40) + 20); // Padding of 20px from edges
  const y = Math.floor(Math.random() * (randomRoom.height - 40) + 20);
  
  return {
    roomId: randomRoom.id,
    x,
    y
  };
};

export const generateRandomBattery = (): number => {
  return Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
};
