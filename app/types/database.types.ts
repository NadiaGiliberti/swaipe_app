export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          beschreibung: string
          code: string
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          beschreibung: string
          code: string
          icon?: string | null
          id?: never
          name: string
        }
        Update: {
          beschreibung?: string
          code?: string
          icon?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      freundschaften: {
        Row: {
          anfragender_id: string
          created_at: string
          empfaenger_id: string
          id: number
          status: Database["public"]["Enums"]["freundschaft_status"]
        }
        Insert: {
          anfragender_id: string
          created_at?: string
          empfaenger_id: string
          id?: never
          status?: Database["public"]["Enums"]["freundschaft_status"]
        }
        Update: {
          anfragender_id?: string
          created_at?: string
          empfaenger_id?: string
          id?: never
          status?: Database["public"]["Enums"]["freundschaft_status"]
        }
        Relationships: [
          {
            foreignKeyName: "freundschaften_anfragender_id_fkey"
            columns: ["anfragender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freundschaften_empfaenger_id_fkey"
            columns: ["empfaenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aktiv: boolean
          created_at: string
          gespielte_runden: number
          highscore: number
          highscore_datum: string | null
          id: string
          last_login: string | null
          last_modified: string
          level_audio: number
          level_bild: number
          level_musik: number
          level_video: number
          profilbild_url: string | null
          theme_background_1: string | null
          theme_background_2: string | null
          theme_background_3: string | null
          theme_background_4: string | null
          theme_base: string | null
          theme_text_dunkel: string | null
          theme_text_hell: string | null
          theme_text_schwarz: string | null
          username: string
        }
        Insert: {
          aktiv?: boolean
          created_at?: string
          gespielte_runden?: number
          highscore?: number
          highscore_datum?: string | null
          id: string
          last_login?: string | null
          last_modified?: string
          level_audio?: number
          level_bild?: number
          level_musik?: number
          level_video?: number
          profilbild_url?: string | null
          theme_background_1?: string | null
          theme_background_2?: string | null
          theme_background_3?: string | null
          theme_background_4?: string | null
          theme_base?: string | null
          theme_text_dunkel?: string | null
          theme_text_hell?: string | null
          theme_text_schwarz?: string | null
          username: string
        }
        Update: {
          aktiv?: boolean
          created_at?: string
          gespielte_runden?: number
          highscore?: number
          highscore_datum?: string | null
          id?: string
          last_login?: string | null
          last_modified?: string
          level_audio?: number
          level_bild?: number
          level_musik?: number
          level_video?: number
          profilbild_url?: string | null
          theme_background_1?: string | null
          theme_background_2?: string | null
          theme_background_3?: string | null
          theme_background_4?: string | null
          theme_base?: string | null
          theme_text_dunkel?: string | null
          theme_text_hell?: string | null
          theme_text_schwarz?: string | null
          username?: string
        }
        Relationships: []
      }
      spieldaten: {
        Row: {
          content_type: string | null
          counter_richtig: number
          created_at: string
          datei_url: string
          herkunft: Database["public"]["Enums"]["herkunft_typ"]
          id: number
          kategorie: Database["public"]["Enums"]["kategorie_typ"]
          schwierigkeit_initial: number
          stil: string | null
          used_counter: number
        }
        Insert: {
          content_type?: string | null
          counter_richtig?: number
          created_at?: string
          datei_url: string
          herkunft: Database["public"]["Enums"]["herkunft_typ"]
          id?: never
          kategorie: Database["public"]["Enums"]["kategorie_typ"]
          schwierigkeit_initial: number
          stil?: string | null
          used_counter?: number
        }
        Update: {
          content_type?: string | null
          counter_richtig?: number
          created_at?: string
          datei_url?: string
          herkunft?: Database["public"]["Enums"]["herkunft_typ"]
          id?: never
          kategorie?: Database["public"]["Enums"]["kategorie_typ"]
          schwierigkeit_initial?: number
          stil?: string | null
          used_counter?: number
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: number
          erreicht_am: string
          id: number
          user_id: string
        }
        Insert: {
          badge_id: number
          erreicht_am?: string
          id?: never
          user_id: string
        }
        Update: {
          badge_id?: number
          erreicht_am?: string
          id?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      spieldaten_live: {
        Row: {
          content_type: string | null
          counter_richtig: number | null
          created_at: string | null
          datei_url: string | null
          herkunft: Database["public"]["Enums"]["herkunft_typ"] | null
          id: number | null
          kategorie: Database["public"]["Enums"]["kategorie_typ"] | null
          schwierigkeit_aktuell: number | null
          schwierigkeit_initial: number | null
          stil: string | null
          used_counter: number | null
        }
        Insert: {
          content_type?: string | null
          counter_richtig?: number | null
          created_at?: string | null
          datei_url?: string | null
          herkunft?: Database["public"]["Enums"]["herkunft_typ"] | null
          id?: number | null
          kategorie?: Database["public"]["Enums"]["kategorie_typ"] | null
          schwierigkeit_aktuell?: never
          schwierigkeit_initial?: number | null
          stil?: string | null
          used_counter?: number | null
        }
        Update: {
          content_type?: string | null
          counter_richtig?: number | null
          created_at?: string | null
          datei_url?: string | null
          herkunft?: Database["public"]["Enums"]["herkunft_typ"] | null
          id?: number | null
          kategorie?: Database["public"]["Enums"]["kategorie_typ"] | null
          schwierigkeit_aktuell?: never
          schwierigkeit_initial?: number | null
          stil?: string | null
          used_counter?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      record_answer: {
        Args: { spiel_id: number; war_richtig: boolean }
        Returns: undefined
      }
    }
    Enums: {
      freundschaft_status: "AUSSTEHEND" | "AKZEPTIERT"
      herkunft_typ: "ECHT" | "KI"
      kategorie_typ: "MUSIK" | "AUDIO" | "VIDEO" | "BILD"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      freundschaft_status: ["AUSSTEHEND", "AKZEPTIERT"],
      herkunft_typ: ["ECHT", "KI"],
      kategorie_typ: ["MUSIK", "AUDIO", "VIDEO", "BILD"],
    },
  },
} as const
