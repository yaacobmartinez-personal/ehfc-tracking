export interface Barangay {
  id: number;
  name: string;
  center: [number, number];
  description: string;
  population?: number;
  area?: string;
  coordinates: [number, number][];
}

export interface UserPin {
  id: string;
  title: string;
  lng: number;
  lat: number;
  assignees: string[];
  targetFamilies: string[];
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  maxBounds: [[number, number], [number, number]];
  maxZoom: number;
  minZoom: number;
}
