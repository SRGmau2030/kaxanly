import { Location } from '@/types';

export const generateRandomLocation = (availableRoomIds?: string[]): Location => {
  const defaultRoomIds = [
    'f8f4066c-f531-47f4-8aa8-475da986a81d',
    '346f0337-5e34-44ba-a836-76365e4c26f5',
    '1651403e-5c59-4a43-8142-bd1b2f6f3a5e',
    'd5443934-adeb-4591-901d-ccb3535a00cc',
    '2bc7289c-0de4-4105-adec-e00f9ed8cf0f',
    '232b4676-b571-437f-a62b-6c88a22d05ce'
  ];

  const roomIds = availableRoomIds && availableRoomIds.length > 0 ? availableRoomIds : defaultRoomIds;
  const randomRoom = roomIds[Math.floor(Math.random() * roomIds.length)];

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
