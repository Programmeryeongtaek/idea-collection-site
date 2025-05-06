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
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          created_at: string;
          user_id: string;
          keywords?: string[] | null;
        }
        Insert: {
          id: string;
          title: string;
          content: string;
          category: string;
          created_at?: string;
          user_id: string;
          keywords?: string[] | null;
        }
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          created_at?: string;
          user_id?: string;
          keywords?: string[] | null;
        }
      }
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          created_at: string;
          updated_at: string;
          is_guest: boolean;
        }
        Insert: {
          id: string;
          email: string;
          username: string;
          created_at?: string;
          updated_at?: string;
          is_guest: boolean;
        }
        Update: {
          id?: string;
          email?: string;
          username?: string;
          created_at?: string;
          updated_at?: string;
          is_guest?: boolean;
        }
      }
      connections: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        }
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        }
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        }
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
  }
}