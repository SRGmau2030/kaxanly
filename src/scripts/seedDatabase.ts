import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

const homeLayoutData = {
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

const deviceTypeToColor: Record<string, string> = {
  phone: '#3B82F6',
  laptop: '#8B5CF6',
  keys: '#F59E0B',
  watch: '#10B981',
  headphones: '#EC4899',
  tablet: '#6366F1',
  other: '#6B7280',
};

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    const { data: existingLayout } = await supabase
      .from('home_layouts')
      .select('id')
      .eq('user_id', DEMO_USER_ID)
      .maybeSingle();

    let homeLayoutId: string;

    if (existingLayout) {
      console.log('Home layout already exists, using existing one');
      homeLayoutId = existingLayout.id;
    } else {
      const { data: newLayout, error: layoutError } = await supabase
        .from('home_layouts')
        .insert({
          name: homeLayoutData.name,
          user_id: DEMO_USER_ID,
        })
        .select()
        .single();

      if (layoutError) throw layoutError;
      homeLayoutId = newLayout.id;
      console.log('Created home layout:', homeLayoutId);

      const roomsToInsert = homeLayoutData.rooms.map(room => ({
        home_layout_id: homeLayoutId,
        name: room.name,
        floor: room.floor,
        width: room.width,
        height: room.height,
        x: room.x,
        y: room.y,
      }));

      const { error: roomsError } = await supabase
        .from('rooms')
        .insert(roomsToInsert);

      if (roomsError) throw roomsError;
      console.log('Created rooms:', roomsToInsert.length);
    }

    const { data: existingDevices } = await supabase
      .from('devices')
      .select('id')
      .eq('user_id', DEMO_USER_ID);

    if (existingDevices && existingDevices.length > 0) {
      console.log('Devices already exist, skipping device seeding');
      return;
    }

    const devicesToInsert = [
      {
        name: 'iPhone 15 Pro',
        type: 'phone',
        location: { roomId: 'living-room', x: 150, y: 100 },
        status: 'online',
        battery: 72,
        icon: 'Smartphone',
        color: deviceTypeToColor.phone,
        user_id: DEMO_USER_ID,
      },
      {
        name: 'MacBook Pro',
        type: 'laptop',
        location: { roomId: 'office', x: 100, y: 75 },
        status: 'online',
        battery: 45,
        icon: 'Laptop',
        color: deviceTypeToColor.laptop,
        user_id: DEMO_USER_ID,
      },
      {
        name: 'Car Keys',
        type: 'keys',
        location: { roomId: 'kitchen', x: 150, y: 50 },
        status: 'offline',
        icon: 'Key',
        color: deviceTypeToColor.keys,
        user_id: DEMO_USER_ID,
      },
      {
        name: 'Apple Watch',
        type: 'watch',
        location: { roomId: 'bedroom', x: 120, y: 90 },
        status: 'online',
        battery: 85,
        icon: 'Watch',
        color: deviceTypeToColor.watch,
        user_id: DEMO_USER_ID,
      },
      {
        name: 'AirPods Pro',
        type: 'headphones',
        location: { roomId: 'living-room', x: 80, y: 150 },
        status: 'offline',
        battery: 12,
        icon: 'Headphones',
        color: deviceTypeToColor.headphones,
        user_id: DEMO_USER_ID,
      },
      {
        name: 'iPad Pro',
        type: 'tablet',
        location: { roomId: 'bedroom', x: 200, y: 100 },
        status: 'online',
        battery: 96,
        icon: 'Tablet',
        color: deviceTypeToColor.tablet,
        user_id: DEMO_USER_ID,
      },
      {
        name: 'House Keys',
        type: 'keys',
        location: { roomId: 'garage', x: 50, y: 100 },
        status: 'unknown',
        icon: 'Key',
        color: deviceTypeToColor.keys,
        user_id: DEMO_USER_ID,
      },
    ];

    const { error: devicesError } = await supabase
      .from('devices')
      .insert(devicesToInsert);

    if (devicesError) throw devicesError;

    console.log('Successfully seeded database with', devicesToInsert.length, 'devices');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seedDatabase();
