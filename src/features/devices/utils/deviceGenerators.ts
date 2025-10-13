import { Location } from '@/types';

const DEFAULT_ROOM_IDS = [
  'living-room',
  'kitchen',
  'bedroom',
  'bathroom',
  'office',
  'garage'
];

export const generateRandomLocation = (): Location => {
  const randomRoom = DEFAULT_ROOM_IDS[Math.floor(Math.random() * DEFAULT_ROOM_IDS.length)];

  const x = Math.floor(Math.random() * 160) + 20;
  const y = Math.floor(Math.random() * 120) + 20;

  return {
    roomId: randomRoom,
    x,
    y
  };
};

export const generateRandomBattery = (): number => {
  return Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
};
