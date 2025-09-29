export const getBatteryColorClass = (batteryLevel?: number) => {
  if (batteryLevel === undefined) return 'text-gray-400';
  if (batteryLevel < 20) return 'text-red-500';
  if (batteryLevel < 50) return 'text-yellow-500';
  return 'text-green-500';
};

export const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'offline':
      return 'bg-gray-400';
    case 'unknown':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-400';
  }
};
