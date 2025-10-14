import { supabase } from '../lib/supabase';
import { Room, HomeLayout } from '../types';

export interface RoomInput {
  home_layout_id: string;
  name: string;
  floor: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export const roomService = {
  async getHomeLayout(userId: string): Promise<HomeLayout | null> {
    const { data, error } = await supabase
      .from('home_layouts')
      .select(`
        *,
        rooms (*)
      `)
      .eq('user_id', userId)
      .order('name', { foreignTable: 'rooms' })
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const rooms: Room[] = (data.rooms || []).map((room: any) => ({
      id: room.id,
      name: room.name,
      floor: room.floor,
      width: room.width,
      height: room.height,
      x: room.x,
      y: room.y,
    }));

    return {
      id: data.id,
      name: data.name,
      rooms,
    };
  },

  async createHomeLayout(name: string, userId: string): Promise<HomeLayout> {
    const { data, error } = await supabase
      .from('home_layouts')
      .insert({
        name,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      rooms: [],
    };
  },

  async createRoom(room: RoomInput, userId: string): Promise<Room> {
    const homeLayout = await supabase
      .from('home_layouts')
      .select('id')
      .eq('id', room.home_layout_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (!homeLayout.data) {
      throw new Error('Home layout not found or unauthorized');
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        home_layout_id: room.home_layout_id,
        name: room.name,
        floor: room.floor,
        width: room.width,
        height: room.height,
        x: room.x,
        y: room.y,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      floor: data.floor,
      width: data.width,
      height: data.height,
      x: data.x,
      y: data.y,
    };
  },

  async updateRoom(id: string, updates: Partial<RoomInput>, userId: string): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      floor: data.floor,
      width: data.width,
      height: data.height,
      x: data.x,
      y: data.y,
    };
  },

  async deleteRoom(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
