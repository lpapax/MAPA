/**
 * Generated database types for Supabase.
 * Run `npx supabase gen types typescript --project-id <ref>` to regenerate
 * once the Supabase project is created.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface FarmRow {
  id: string                         // UUID
  slug: string
  name: string
  description: string
  categories: string[]               // FarmCategory[]
  lat: number
  lng: number
  address: string
  city: string
  kraj: string
  zip: string
  contact: Json                      // FarmContact object
  opening_hours: Json | null         // OpeningHours object
  images: string[]
  verified: boolean
  created_at: string                 // ISO timestamp
}

export type FarmInsert = Omit<FarmRow, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type FarmUpdate = Partial<FarmInsert>

export interface Database {
  public: {
    Tables: {
      farms: {
        Row: FarmRow
        Insert: FarmInsert
        Update: FarmUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
