export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          genre: string
          synopsis: string
          target_word_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          genre?: string
          synopsis?: string
          target_word_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          genre?: string
          synopsis?: string
          target_word_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      characters: {
        Row: {
          id: string
          project_id: string
          name: string
          role: string
          color: string
          summary: string
          age: string
          pronouns: string
          relationships: string
          traits: string[]
          arc_summary: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          role?: string
          color: string
          summary?: string
          age?: string
          pronouns?: string
          relationships?: string
          traits?: string[]
          arc_summary?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          role?: string
          color?: string
          summary?: string
          age?: string
          pronouns?: string
          relationships?: string
          traits?: string[]
          arc_summary?: string
        }
        Relationships: [
          {
            foreignKeyName: 'characters_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      locations: {
        Row: {
          id: string
          project_id: string
          name: string
          color: string
          summary: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          color: string
          summary?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          color?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: 'locations_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      scenes: {
        Row: {
          id: string
          project_id: string
          title: string
          summary: string
          location_id: string | null
          word_count: number
          sort_order: number
          pov_character_id: string | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          summary?: string
          location_id?: string | null
          word_count?: number
          sort_order?: number
          pov_character_id?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          summary?: string
          location_id?: string | null
          word_count?: number
          sort_order?: number
          pov_character_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'scenes_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'scenes_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
        ]
      }
      scene_characters: {
        Row: {
          scene_id: string
          character_id: string
        }
        Insert: {
          scene_id: string
          character_id: string
        }
        Update: {
          scene_id?: string
          character_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'scene_characters_scene_id_fkey'
            columns: ['scene_id']
            isOneToOne: false
            referencedRelation: 'scenes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'scene_characters_character_id_fkey'
            columns: ['character_id']
            isOneToOne: false
            referencedRelation: 'characters'
            referencedColumns: ['id']
          },
        ]
      }
      scene_character_moments: {
        Row: {
          id: string
          scene_id: string
          character_id: string
          label: string
          sort_order: number
        }
        Insert: {
          id?: string
          scene_id: string
          character_id: string
          label: string
          sort_order?: number
        }
        Update: {
          id?: string
          scene_id?: string
          character_id?: string
          label?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'scene_character_moments_scene_id_fkey'
            columns: ['scene_id']
            isOneToOne: false
            referencedRelation: 'scenes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'scene_character_moments_character_id_fkey'
            columns: ['character_id']
            isOneToOne: false
            referencedRelation: 'characters'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
