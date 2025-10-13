/*
  # Update RLS policies for demo user

  ## Summary
  Updates Row Level Security policies to allow public access for demo purposes.
  This allows the application to work without authentication while still maintaining
  RLS infrastructure for future authenticated users.

  ## Changes
  - Add public access policies for all tables
  - Allow anonymous users to read/write demo user data
  - Maintain existing authenticated user policies

  ## Security Notes
  - These policies are for demo purposes only
  - In production, remove public policies and require authentication
  - The demo user ID is hardcoded: 00000000-0000-0000-0000-000000000001
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own home layouts" ON home_layouts;
DROP POLICY IF EXISTS "Users can insert own home layouts" ON home_layouts;
DROP POLICY IF EXISTS "Users can update own home layouts" ON home_layouts;
DROP POLICY IF EXISTS "Users can delete own home layouts" ON home_layouts;

DROP POLICY IF EXISTS "Users can view own rooms" ON rooms;
DROP POLICY IF EXISTS "Users can insert own rooms" ON rooms;
DROP POLICY IF EXISTS "Users can update own rooms" ON rooms;
DROP POLICY IF EXISTS "Users can delete own rooms" ON rooms;

-- Create new policies with public access for demo user
CREATE POLICY "Public can view demo home layouts"
  ON home_layouts FOR SELECT
  USING (user_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Public can insert demo home layouts"
  ON home_layouts FOR INSERT
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Public can update demo home layouts"
  ON home_layouts FOR UPDATE
  USING (user_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Public can delete demo home layouts"
  ON home_layouts FOR DELETE
  USING (user_id = '00000000-0000-0000-0000-000000000001');

-- Authenticated user policies for home_layouts
CREATE POLICY "Authenticated users can view own home layouts"
  ON home_layouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own home layouts"
  ON home_layouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own home layouts"
  ON home_layouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own home layouts"
  ON home_layouts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Rooms policies with demo user access
CREATE POLICY "Public can view demo rooms"
  ON rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = '00000000-0000-0000-0000-000000000001'
    )
  );

CREATE POLICY "Public can insert demo rooms"
  ON rooms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = '00000000-0000-0000-0000-000000000001'
    )
  );

CREATE POLICY "Public can update demo rooms"
  ON rooms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = '00000000-0000-0000-0000-000000000001'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = '00000000-0000-0000-0000-000000000001'
    )
  );

CREATE POLICY "Public can delete demo rooms"
  ON rooms FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = '00000000-0000-0000-0000-000000000001'
    )
  );

-- Authenticated user policies for rooms
CREATE POLICY "Authenticated users can view own rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert own rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can update own rooms"
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

CREATE POLICY "Authenticated users can delete own rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND home_layouts.user_id = auth.uid()
    )
  );

-- Devices policies with demo user access
CREATE POLICY "Public can view demo devices"
  ON devices FOR SELECT
  USING (user_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Public can insert demo devices"
  ON devices FOR INSERT
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Public can update demo devices"
  ON devices FOR UPDATE
  USING (user_id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Public can delete demo devices"
  ON devices FOR DELETE
  USING (user_id = '00000000-0000-0000-0000-000000000001');

-- Authenticated user policies for devices
CREATE POLICY "Authenticated users can view own devices"
  ON devices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own devices"
  ON devices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own devices"
  ON devices FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own devices"
  ON devices FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);