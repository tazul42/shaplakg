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
      students: {
        Row: {
          address: string | null
          admission_date: string | null
          admission_type: string | null
          bangla_name: string | null
          birth_registration_no: string | null
          blood_group: string | null
          class: string
          created_at: string
          dob: string | null
          father_bangla_name: string | null
          father_name: string | null
          father_nid: string | null
          father_occupation: string | null
          gender: string | null
          id: string
          mother_bangla_name: string | null
          mother_name: string | null
          mother_nid: string | null
          mother_occupation: string | null
          name: string
          permanent_district: string | null
          permanent_post: string | null
          permanent_upazila: string | null
          permanent_village: string | null
          phone: string | null
          present_district: string | null
          present_post: string | null
          present_upazila: string | null
          present_village: string | null
          previous_institution: string | null
          receipt_no: string | null
          religion: string | null
          roll: number | null
          section: string | null
          special_disease: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          admission_type?: string | null
          bangla_name?: string | null
          birth_registration_no?: string | null
          blood_group?: string | null
          class: string
          created_at?: string
          dob?: string | null
          father_bangla_name?: string | null
          father_name?: string | null
          father_nid?: string | null
          father_occupation?: string | null
          gender?: string | null
          id?: string
          mother_bangla_name?: string | null
          mother_name?: string | null
          mother_nid?: string | null
          mother_occupation?: string | null
          name: string
          permanent_district?: string | null
          permanent_post?: string | null
          permanent_upazila?: string | null
          permanent_village?: string | null
          phone?: string | null
          present_district?: string | null
          present_post?: string | null
          present_upazila?: string | null
          present_village?: string | null
          previous_institution?: string | null
          receipt_no?: string | null
          religion?: string | null
          roll?: number | null
          section?: string | null
          special_disease?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          admission_type?: string | null
          bangla_name?: string | null
          birth_registration_no?: string | null
          blood_group?: string | null
          class?: string
          created_at?: string
          dob?: string | null
          father_bangla_name?: string | null
          father_name?: string | null
          father_nid?: string | null
          father_occupation?: string | null
          gender?: string | null
          id?: string
          mother_bangla_name?: string | null
          mother_name?: string | null
          mother_nid?: string | null
          mother_occupation?: string | null
          name?: string
          permanent_district?: string | null
          permanent_post?: string | null
          permanent_upazila?: string | null
          permanent_village?: string | null
          phone?: string | null
          present_district?: string | null
          present_post?: string | null
          present_upazila?: string | null
          present_village?: string | null
          previous_institution?: string | null
          receipt_no?: string | null
          religion?: string | null
          roll?: number | null
          section?: string | null
          special_disease?: string | null
          student_id?: string | null
          updated_at?: string
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
    Enums: {},
  },
} as const
