export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string
          name: string
          type: string
          location: Json
          status: string
          battery: number | null
          lastseen: string | null
          icon: string
          color: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          location: Json
          status: string
          battery?: number | null
          lastseen?: string | null
          icon: string
          color: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          location?: Json
          status?: string
          battery?: number | null
          lastseen?: string | null
          icon?: string
          color?: string
          user_id?: string
        }
      }
      home_layouts: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          home_layout_id: string
          name: string
          floor: number
          width: number
          height: number
          x: number
          y: number
          created_at: string
        }
        Insert: {
          id?: string
          home_layout_id: string
          name: string
          floor?: number
          width?: number
          height?: number
          x?: number
          y?: number
          created_at?: string
        }
        Update: {
          id?: string
          home_layout_id?: string
          name?: string
          floor?: number
          width?: number
          height?: number
          x?: number
          y?: number
          created_at?: string
        }
      }
    }
  }
}
