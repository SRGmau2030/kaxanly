const roomMap: Record<string, string> = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'kitchen': 'Kitchen',
  'bathroom': 'Bathroom',
  'office': 'Office',
  'garage': 'Garage',
};

export const getRoomName = (roomId: string): string => {
  return roomMap[roomId] || 'Unknown Room';
};
