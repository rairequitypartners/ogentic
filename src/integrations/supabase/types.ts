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
      ai_stacks: {
        Row: {
          components: Json
          created_at: string
          deployed_at: string | null
          deployment_status: string | null
          deployment_url: string | null
          description: string
          id: string
          is_public: boolean
          query: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          components?: Json
          created_at?: string
          deployed_at?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          description: string
          id?: string
          is_public?: boolean
          query: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          components?: Json
          created_at?: string
          deployed_at?: string | null
          deployment_status?: string | null
          deployment_url?: string | null
          description?: string
          id?: string
          is_public?: boolean
          query?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      deployments: {
        Row: {
          deployed_at: string
          id: string
          message: string | null
          platform: string
          stack_id: string
          status: string
          user_id: string
        }
        Insert: {
          deployed_at?: string
          id?: string
          message?: string | null
          platform: string
          stack_id: string
          status?: string
          user_id: string
        }
        Update: {
          deployed_at?: string
          id?: string
          message?: string | null
          platform?: string
          stack_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployments_stack_id_fkey"
            columns: ["stack_id"]
            isOneToOne: false
            referencedRelation: "ai_stacks"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          id: string
          raw: string | null
          role: string
          stack: Json | null
          timestamp: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          id?: string
          raw?: string | null
          role: string
          stack?: Json | null
          timestamp?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          id?: string
          raw?: string | null
          role?: string
          stack?: Json | null
          timestamp?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_stacks: {
        Row: {
          codename: string
          created_at: string
          deployed_at: string | null
          deployment_status: string | null
          description: string
          id: string
          is_public: boolean | null
          stack_data: Json
          title: string
          user_id: string
        }
        Insert: {
          codename: string
          created_at?: string
          deployed_at?: string | null
          deployment_status?: string | null
          description: string
          id?: string
          is_public?: boolean | null
          stack_data: Json
          title: string
          user_id: string
        }
        Update: {
          codename?: string
          created_at?: string
          deployed_at?: string | null
          deployment_status?: string | null
          description?: string
          id?: string
          is_public?: boolean | null
          stack_data?: Json
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          bias_preference: string | null
          created_at: string
          dataset_preference: string | null
          experience_level: string | null
          id: string
          industry: string | null
          onboarding_completed: boolean | null
          output_tone: string | null
          preferred_models: string[] | null
          updated_at: string
          use_cases: string[] | null
          user_id: string
          ux_complexity: string | null
        }
        Insert: {
          bias_preference?: string | null
          created_at?: string
          dataset_preference?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean | null
          output_tone?: string | null
          preferred_models?: string[] | null
          updated_at?: string
          use_cases?: string[] | null
          user_id: string
          ux_complexity?: string | null
        }
        Update: {
          bias_preference?: string | null
          created_at?: string
          dataset_preference?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean | null
          output_tone?: string | null
          preferred_models?: string[] | null
          updated_at?: string
          use_cases?: string[] | null
          user_id?: string
          ux_complexity?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
