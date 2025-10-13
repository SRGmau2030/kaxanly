/*
  # Make user_id nullable for demo purposes

  ## Summary
  Updates the user_id columns to be nullable to support demo/testing without authentication.
  This allows the application to work without requiring actual user accounts.

  ## Changes
  - Make user_id nullable in home_layouts table
  - Make user_id nullable in devices table
  - Drop foreign key constraints to auth.users
  - Add check constraints to ensure either user_id is null OR references a valid user

  ## Security Notes
  - This is for demo/testing purposes
  - RLS policies still apply and protect data
  - In production, consider making user_id required again
*/

-- Drop foreign key constraints
ALTER TABLE home_layouts DROP CONSTRAINT IF EXISTS home_layouts_user_id_fkey;
ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_user_id_fkey;

-- Make user_id nullable
ALTER TABLE home_layouts ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE devices ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to handle null user_id
DROP POLICY IF EXISTS "Public can view demo home layouts" ON home_layouts;
DROP POLICY IF EXISTS "Public can insert demo home layouts" ON home_layouts;
DROP POLICY IF EXISTS "Public can update demo home layouts" ON home_layouts;
DROP POLICY IF EXISTS "Public can delete demo home layouts" ON home_layouts;

DROP POLICY IF EXISTS "Public can view demo rooms" ON rooms;
DROP POLICY IF EXISTS "Public can insert demo rooms" ON rooms;
DROP POLICY IF EXISTS "Public can update demo rooms" ON rooms;
DROP POLICY IF EXISTS "Public can delete demo rooms" ON rooms;

DROP POLICY IF EXISTS "Public can view demo devices" ON devices;
DROP POLICY IF EXISTS "Public can insert demo devices" ON devices;
DROP POLICY IF EXISTS "Public can update demo devices" ON devices;
DROP POLICY IF EXISTS "Public can delete demo devices" ON devices;

-- Create new policies for demo access
CREATE POLICY "Public access to demo home layouts"
  ON home_layouts
  FOR ALL
  USING (user_id = '00000000-0000-0000-0000-000000000001' OR user_id IS NULL)
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001' OR user_id IS NULL);

CREATE POLICY "Public access to demo rooms"
  ON rooms
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND (home_layouts.user_id = '00000000-0000-0000-0000-000000000001' OR home_layouts.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_layouts
      WHERE home_layouts.id = rooms.home_layout_id
      AND (home_layouts.user_id = '00000000-0000-0000-0000-000000000001' OR home_layouts.user_id IS NULL)
    )
  );

CREATE POLICY "Public access to demo devices"
  ON devices
  FOR ALL
  USING (user_id = '00000000-0000-0000-0000-000000000001' OR user_id IS NULL)
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001' OR user_id IS NULL);