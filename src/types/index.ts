export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: Location;
  status: DeviceStatus;
  battery?: number;
  lastSeen: Date;
  icon: string;
  color: string;
}

export type DeviceType = 'phone' | 'laptop' | 'tablet' | 'keys' | 'watch' | 'headphones' | 'other';

export type DeviceStatus = 'online' | 'offline' | 'unknown';

export interface Location {
  roomId: string;
  x: number;
  y: number;
}

export interface Room {
  id: string;
  name: string;
  floor: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface HomeLayout {
  id: string;
  name: string;
  rooms: Room[];
}
