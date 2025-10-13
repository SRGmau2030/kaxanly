/*
  # Create rooms and home_layouts tables

  ## Summary
  Creates tables for managing home layouts and rooms to support device location tracking.

  ## New Tables
  
  ### `home_layouts`
  - `id` (uuid, primary key) - Unique identifier for the home layout
  - `name` (text) - Name of the home (e.g., "My Home")
  - `user_id` (uuid, foreign key) - Reference to the user who owns this home
  - `created_at` (timestamptz) - Timestamp when the layout was created
  - `updated_at` (timestamptz) - Timestamp when the layout was last updated

  ### `rooms`
  - `id` (uuid, primary key) - Unique identifier for the room
  - `home_layout_id` (uuid, foreign key) - Reference to the home layout
  - `name` (text) - Name of the room (e.g., "Living Room", "Kitchen")
  - `floor` (integer) - Floor number where the room is located
  - `width` (integer) - Width of the room in pixels for visualization
  - `height` (integer) - Height of the room in pixels for visualization
  - `x` (integer) - X coordinate for room position
  - `y` (integer) - Y coordinate for room position
  - `created_at` (timestamptz) - Timestamp when the room was created

  ## Security
  - Enable RLS on both tables
  - Users can only access their own home layouts and rooms
  - Users can read their own data
  - Users can insert, update, and delete their own data
*/

-- Create home_layouts table
CREATE TABLE IF NOT EXISTS home_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_layout_id uuid NOT NULL REFERENCES home_layouts(id) ON DELETE CASCADE,
  name text NOT NULL,
  floor integer NOT NULL DEFAULT 1,
  width integer NOT NULL DEFAULT 200,
  height integer NOT NULL DEFAULT 200,
  x integer NOT NULL DEFAULT 0,
  y integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE home_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policies for home_layouts
CREATE POLICY "Users can view own home layouts"
  ON home_layouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own home layouts"
  ON home_layouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own home layouts"
  ON home_layouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own home layouts"
  ON home_layouts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for rooms
CREATE POLICY "Users can view own rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_home_layouts_user_id ON home_layouts(user_id);
CREATE INDEX IF NOT EXISTS idx_rooms_home_layout_id ON rooms(home_layout_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);