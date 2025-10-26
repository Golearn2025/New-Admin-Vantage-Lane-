/**
 * Supabase Database Types - Fleet Portal
 * Generated from Supabase schema
 * 
 * TODO: Generate with `supabase gen types typescript --project-id=fmeonuvmlopkutbjejlo`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Add tables as needed
      [key: string]: any;
    };
    Views: {
      operator_dashboard_stats: {
        Row: {
          organization_id: string;
          operator_name: string;
          total_bookings: number;
          active_drivers: number;
          total_revenue: number;
          total_earnings: number;
          total_driver_payouts: number;
          avg_booking_value: number;
        };
      };
    };
    Functions: {
      current_operator_id: {
        Returns: string | null;
      };
      is_super_admin: {
        Returns: boolean;
      };
      is_operator: {
        Returns: boolean;
      };
    };
  };
}
