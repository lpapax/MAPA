export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface FarmRow {
  id: string
  slug: string
  name: string
  description: string
  categories: string[]
  lat: number
  lng: number
  address: string
  city: string
  kraj: string
  zip: string
  contact: Json
  opening_hours: Json | null
  images: string[]
  verified: boolean
  bio: boolean
  delivery: boolean
  pick_your_own: boolean
  view_count: number
  created_at: string
}

export type FarmInsert = Omit<FarmRow, 'id' | 'created_at'> & { id?: string; created_at?: string }
export type FarmUpdate = Partial<FarmInsert>

export interface UserProfileRow {
  id: string
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface UserFavoriteRow {
  id: string
  user_id: string
  farm_slug: string
  farm_name: string
  categories: string[]
  kraj: string
  saved_at: string
}

export interface ReviewRow {
  id: string
  user_id: string
  farm_slug: string
  display_name: string
  city: string
  rating: number
  text: string
  created_at: string
}

export interface SavedSearchRow {
  id: string
  user_id: string
  name: string
  filters: Json
  created_at: string
}

export interface FarmClaimRow {
  id: string
  user_id: string
  farm_slug: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      farms: {
        Row: FarmRow
        Insert: FarmInsert
        Update: FarmUpdate
        Relationships: []
      }
      user_profiles: {
        Row: UserProfileRow
        Insert: { id: string; display_name?: string | null; created_at?: string; updated_at?: string }
        Update: { display_name?: string | null; updated_at?: string }
        Relationships: []
      }
      user_favorites: {
        Row: UserFavoriteRow
        Insert: { id?: string; user_id: string; farm_slug: string; farm_name: string; categories: string[]; kraj: string; saved_at?: string }
        Update: Partial<UserFavoriteRow>
        Relationships: []
      }
      reviews: {
        Row: ReviewRow
        Insert: { id?: string; user_id: string; farm_slug: string; display_name: string; city: string; rating: number; text: string; created_at?: string }
        Update: Partial<ReviewRow>
        Relationships: []
      }
      saved_searches: {
        Row: SavedSearchRow
        Insert: { id?: string; user_id: string; name: string; filters: Json; created_at?: string }
        Update: Partial<SavedSearchRow>
        Relationships: []
      }
      farm_claims: {
        Row: FarmClaimRow
        Insert: { id?: string; user_id: string; farm_slug: string; message?: string; status?: string; created_at?: string }
        Update: Partial<FarmClaimRow>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
