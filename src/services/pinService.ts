import { supabase } from '../lib/supabase';
import { UserPin } from '../types/map';

export interface PinData {
  id: string;
  title: string;
  lng: number;
  lat: number;
  assignees: string[];
  target_families: string[];
  created_at: string;
  updated_at: string;
}

export const pinService = {
  // Get all pins
  async getAllPins(): Promise<UserPin[]> {
    const { data, error } = await supabase
      .from('pins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pins:', error);
      throw error;
    }

    return data.map((pin: PinData) => ({
      id: pin.id,
      title: pin.title,
      lng: pin.lng,
      lat: pin.lat,
      assignees: pin.assignees || [],
      targetFamilies: pin.target_families || [],
    }));
  },

  // Create a new pin
  async createPin(pin: Omit<UserPin, 'id'>): Promise<UserPin> {
    const { data, error } = await supabase
      .from('pins')
      .insert({
        title: pin.title,
        lng: pin.lng,
        lat: pin.lat,
        assignees: pin.assignees,
        target_families: pin.targetFamilies,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating pin:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      lng: data.lng,
      lat: data.lat,
      assignees: data.assignees || [],
      targetFamilies: data.target_families || [],
    };
  },

  // Update an existing pin
  async updatePin(id: string, updates: Partial<Omit<UserPin, 'id'>>): Promise<UserPin> {
    const { data, error } = await supabase
      .from('pins')
      .update({
        title: updates.title,
        assignees: updates.assignees,
        target_families: updates.targetFamilies,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pin:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      lng: data.lng,
      lat: data.lat,
      assignees: data.assignees || [],
      targetFamilies: data.target_families || [],
    };
  },

  // Delete a pin
  async deletePin(id: string): Promise<void> {
    const { error } = await supabase
      .from('pins')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pin:', error);
      throw error;
    }
  },

  // Delete all pins
  async deleteAllPins(): Promise<void> {
    const { error } = await supabase
      .from('pins')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all pins

    if (error) {
      console.error('Error deleting all pins:', error);
      throw error;
    }
  },
};
