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
      board: {
        Row: {
          id: number
          title: string
          updated_at: string
        }
        Insert: {
          id?: number
          title?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidate_dates: {
        Row: {
          id: string
          date: string
          label: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          label?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          label?: string | null
          created_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          candidate_date_id: string
          team_name: string
          created_at: string
        }
        Insert: {
          id?: string
          candidate_date_id: string
          team_name: string
          created_at?: string
        }
        Update: {
          id?: string
          candidate_date_id?: string
          team_name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'votes_candidate_date_id_fkey'
            columns: ['candidate_date_id']
            isOneToOne: false
            referencedRelation: 'candidate_dates'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
