import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface LocationData {
  timezone?: string;
  language?: string;
  screen_resolution?: string;
  viewport?: string;
  ip_address?: string;
}

export interface VisitData {
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  location_data?: LocationData;
  page_url?: string;
  referrer?: string;
}

export const visitService = {
  async logVisit(visitData: VisitData) {
    try {
      const { data, error } = await supabase
        .from('visits')
        .insert([visitData])
        .select()
        .single();

      if (error) {
        console.error('Error logging visit:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to log visit:', error);
      throw error;
    }
  },

  async getVisits(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching visits:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch visits:', error);
      throw error;
    }
  }
};
