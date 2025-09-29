import { Device, HomeLayout, Room } from '../types';
import {
  Smartphone,
  Laptop,
  Key,
  Watch,
  Headphones,
  Tablet,
  HelpCircle,
} from 'lucide-react';

// Mock rooms data
export const homeLayout: HomeLayout = {
  id: 'home-1',
  name: 'My Home',
  rooms: [
    {
      id: 'living-room',
      name: 'Living Room',
      floor: 1,
      width: 300,
      height: 200,
      x: 0,
      y: 0,
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      floor: 1,
      width: 200,
      height: 200,
      x: 300,
      y: 0,
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      floor: 1,
      width: 250,
      height: 180,
      x: 0,
      y: 200,
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      floor: 1,
      width: 150,
      height: 180,
      x: 250,
      y: 200,
    },
    {
      id: 'office',
      name: 'Office',
      floor: 1,
      width: 200,
      height: 150,
      x: 400,
      y: 200,
    },
    {
      id: 'garage',
      name: 'Garage',
      floor: 1,
      width: 200,
      height: 150,
      x: 500,
      y: 0,
    },
  ],
};

// Helper function to get device icon based on type
export const deviceTypeToIcon: Record<string, string> = {
  phone: 'Smartphone',
  laptop: 'Laptop',
  keys: 'Key',
  watch: 'Watch',
  headphones: 'Headphones',
  tablet: 'Tablet',
  other: 'HelpCircle',
};

// Helper function to get device color based on type
export const deviceTypeToColor: Record<string, string> = {
  phone: '#3B82F6', // blue
  laptop: '#8B5CF6', // purple
  keys: '#F59E0B', // amber
  watch: '#10B981', // emerald
  headphones: '#EC4899', // pink
  tablet: '#6366F1', // indigo
  other: '#6B7280', // gray
};

// Mock devices data
export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    type: 'phone',
    location: { roomId: 'living-room', x: 150, y: 100 },
    status: 'online',
    battery: 72,
    lastSeen: new Date(),
    icon: 'Smartphone',
    color: deviceTypeToColor.phone,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'laptop',
    location: { roomId: 'office', x: 100, y: 75 },
    status: 'online',
    battery: 45,
    lastSeen: new Date(),
    icon: 'Laptop',
    color: deviceTypeToColor.laptop,
  },
  {
    id: '3',
    name: 'Car Keys',
    type: 'keys',
    location: { roomId: 'kitchen', x: 150, y: 50 },
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: 'Key',
    color: deviceTypeToColor.keys,
  },
  {
    id: '4',
    name: 'Apple Watch',
    type: 'watch',
    location: { roomId: 'bedroom', x: 120, y: 90 },
    status: 'online',
    battery: 85,
    lastSeen: new Date(),
    icon: 'Watch',
    color: deviceTypeToColor.watch,
  },
  {
    id: '5',
    name: 'AirPods Pro',
    type: 'headphones',
    location: { roomId: 'living-room', x: 80, y: 150 },
    status: 'offline',
    battery: 12,
    lastSeen: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    icon: 'Headphones',
    color: deviceTypeToColor.headphones,
  },
  {
    id: '6',
    name: 'iPad Pro',
    type: 'tablet',
    location: { roomId: 'bedroom', x: 200, y: 100 },
    status: 'online',
    battery: 96,
    lastSeen: new Date(),
    icon: 'Tablet',
    color: deviceTypeToColor.tablet,
  },
  {
    id: '7',
    name: 'House Keys',
    type: 'keys',
    location: { roomId: 'garage', x: 50, y: 100 },
    status: 'unknown',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    icon: 'Key',
    color: deviceTypeToColor.keys,
  },
];
