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
      admin_users: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          role: string;
          default_operator_id: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          license_number: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          organization_id: string;
          customer_id: string;
          assigned_driver_id: string | null;
          assigned_vehicle_id: string | null;
          status: string;
          pickup_address: string | null;
          created_at: string;
        };
      };
      booking_pricing: {
        Row: {
          booking_id: string;
          price: number;
          platform_fee: number;
          operator_net: number;
          driver_payout: number;
        };
      };
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
