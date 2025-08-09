-- Create pins table
CREATE TABLE IF NOT EXISTS pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  assignees TEXT[] DEFAULT '{}',
  target_families TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for location queries (simplified)
CREATE INDEX IF NOT EXISTS idx_pins_location ON pins (lat, lng);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pins_updated_at 
  BEFORE UPDATE ON pins 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this based on your auth requirements)
CREATE POLICY "Allow all operations on pins" ON pins
  FOR ALL USING (true);
