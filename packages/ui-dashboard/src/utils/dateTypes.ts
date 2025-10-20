/**
 * Date Types - 100% REUSABLE
 *
 * Type definitions for date utilities
 * Can be used in ANY project
 */

export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_365_days'
  | 'all_time'
  | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
  preset?: DatePreset;
  label: string;
}
