import { supabase } from '../lib/supabase';
import { Device, DeviceType, DeviceStatus, Location } from '../types';

export interface DeviceInput {
  name: string;
  type: DeviceType;
  location: Location;
  status: DeviceStatus;
  battery?: number;
  icon: string;
  color: string;
}

export const deviceService = {
  async getAll(userId: string): Promise<Device[]> {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;

    return (data || []).map(device => ({
      id: device.id,
      name: device.name,
      type: device.type as DeviceType,
      location: device.location as Location,
      status: device.status as DeviceStatus,
      battery: device.battery || undefined,
      lastSeen: device.lastseen ? new Date(device.lastseen) : new Date(),
      icon: device.icon,
      color: device.color,
    }));
  },

  async getById(id: string, userId: string): Promise<Device | null> {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      type: data.type as DeviceType,
      location: data.location as Location,
      status: data.status as DeviceStatus,
      battery: data.battery || undefined,
      lastSeen: data.lastseen ? new Date(data.lastseen) : new Date(),
      icon: data.icon,
      color: data.color,
    };
  },

  async checkDuplicate(name: string, type: DeviceType, userId: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('devices')
      .select('id')
      .eq('name', name)
      .eq('type', type)
      .or(`user_id.eq.${userId},user_id.is.null`);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;

    return data !== null;
  },

  async create(device: DeviceInput, userId: string): Promise<Device> {
    const { data, error } = await supabase
      .from('devices')
      .insert({
        name: device.name,
        type: device.type,
        location: device.location as any,
        status: device.status,
        battery: device.battery || null,
        icon: device.icon,
        color: device.color,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type as DeviceType,
      location: data.location as Location,
      status: data.status as DeviceStatus,
      battery: data.battery || undefined,
      lastSeen: data.lastseen ? new Date(data.lastseen) : new Date(),
      icon: data.icon,
      color: data.color,
    };
  },

  async update(id: string, updates: Partial<DeviceInput>, userId: string): Promise<Device> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.battery !== undefined) updateData.battery = updates.battery;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.color !== undefined) updateData.color = updates.color;

    updateData.lastseen = new Date().toISOString();

    const { data, error } = await supabase
      .from('devices')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type as DeviceType,
      location: data.location as Location,
      status: data.status as DeviceStatus,
      battery: data.battery || undefined,
      lastSeen: data.lastseen ? new Date(data.lastseen) : new Date(),
      icon: data.icon,
      color: data.color,
    };
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async updateLocation(id: string, location: Location, userId: string): Promise<void> {
    const { error } = await supabase
      .from('devices')
      .update({
        location: location as any,
        lastseen: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
