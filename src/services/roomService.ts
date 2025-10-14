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
    const { data: homeData, error: homeError } = await supabase
      .from('home_layouts')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .limit(1)
      .maybeSingle();

    if (homeError) throw homeError;
    if (!homeData) return null;

    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('home_layout_id', homeData.id)
      .order('name');

    if (roomsError) throw roomsError;

    const rooms: Room[] = (roomsData || []).map(room => ({
      id: room.id,
      name: room.name,
      floor: room.floor,
      width: room.width,
      height: room.height,
      x: room.x,
      y: room.y,
    }));

    return {
      id: homeData.id,
      name: homeData.name,
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
