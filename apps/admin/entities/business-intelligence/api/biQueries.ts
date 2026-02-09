/**
 * BI Queries — Supabase data fetching
 *
 * Each function creates its own client (REGULA: no global state).
 * File: < 200 lines | Functions: < 50 lines
 */

import { createBrowserClient } from '@supabase/ssr';
import type {
    BookingSummary,
    CategoryRevenue,
    RevenueSummary,
    StatusBreakdown,
    TripTypeRevenue
} from './biTypes';

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/* ── Bookings Summary ── */

export async function fetchBookingSummary(): Promise<BookingSummary> {
  const sb = getClient();

  const { data: bookings } = await sb
    .from('bookings')
    .select('id, status, booking_pricing(price)')
    .limit(5000);

  const rows = bookings ?? [];
  const total = rows.length;
  const completed = rows.filter((b: Record<string, unknown>) => b.status === 'completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statusMap = new Map<string, { count: number; revenue: number }>();
  for (const b of rows) {
    const s = (b as Record<string, unknown>).status as string;
    const pricing = (b as Record<string, unknown>).booking_pricing as Record<string, unknown>[] | null;
    const price = pricing?.[0]?.price as number ?? 0;
    const entry = statusMap.get(s) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += price;
    statusMap.set(s, entry);
  }

  let totalRevenue = 0;
  const statusBreakdown: StatusBreakdown[] = [];
  for (const [status, { count, revenue }] of Array.from(statusMap.entries())) {
    totalRevenue += revenue;
    statusBreakdown.push({
      status,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      revenue,
    });
  }
  statusBreakdown.sort((a, b) => b.count - a.count);

  const { data: pricingData } = await sb
    .from('booking_pricing')
    .select('price, platform_fee, driver_payout')
    .limit(5000);

  const pRows = pricingData ?? [];
  const platformProfit = pRows.reduce((s: number, r: Record<string, unknown>) => s + ((r.platform_fee as number) ?? 0), 0);

  return {
    totalBookings: total,
    totalRevenue,
    platformProfit,
    avgPrice: total > 0 ? totalRevenue / total : 0,
    completionRate,
    statusBreakdown,
  };
}

/* ── Revenue Summary ── */

export async function fetchRevenueSummary(): Promise<RevenueSummary> {
  const sb = getClient();

  const { data: legs } = await sb
    .from('booking_legs')
    .select('vehicle_category, leg_price, driver_payout')
    .limit(5000);

  const catMap = new Map<string, CategoryRevenue>();
  for (const l of (legs ?? [])) {
    const r = l as Record<string, unknown>;
    const cat = (r.vehicle_category as string) ?? 'unknown';
    const price = (r.leg_price as number) ?? 0;
    const payout = (r.driver_payout as number) ?? 0;
    const entry = catMap.get(cat) ?? { category: cat, legs: 0, revenue: 0, avgPrice: 0, driverPayout: 0, platformProfit: 0, marginPct: 0 };
    entry.legs += 1;
    entry.revenue += price;
    entry.driverPayout += payout;
    catMap.set(cat, entry);
  }
  const byCategory: CategoryRevenue[] = [];
  for (const e of Array.from(catMap.values())) {
    e.avgPrice = e.legs > 0 ? e.revenue / e.legs : 0;
    e.platformProfit = e.revenue - e.driverPayout;
    e.marginPct = e.revenue > 0 ? (e.platformProfit / e.revenue) * 100 : 0;
    byCategory.push(e);
  }
  byCategory.sort((a, b) => b.revenue - a.revenue);

  const { data: tripData } = await sb
    .from('bookings')
    .select('trip_type, category, booking_pricing(price, platform_fee)')
    .limit(5000);

  const tripMap = new Map<string, TripTypeRevenue>();
  for (const b of (tripData ?? [])) {
    const r = b as Record<string, unknown>;
    const key = `${r.trip_type}|${r.category}`;
    const pricing = (r.booking_pricing as Record<string, unknown>[] | null);
    const price = (pricing?.[0]?.price as number) ?? 0;
    const fee = (pricing?.[0]?.platform_fee as number) ?? 0;
    const entry = tripMap.get(key) ?? { tripType: r.trip_type as string, category: r.category as string, bookings: 0, revenue: 0, avgPrice: 0, platformFee: 0 };
    entry.bookings += 1;
    entry.revenue += price;
    entry.platformFee += fee;
    tripMap.set(key, entry);
  }
  const byTripType: TripTypeRevenue[] = [];
  for (const e of Array.from(tripMap.values())) {
    e.avgPrice = e.bookings > 0 ? e.revenue / e.bookings : 0;
    byTripType.push(e);
  }
  byTripType.sort((a, b) => b.revenue - a.revenue);

  const totalRev = byCategory.reduce((s, c) => s + c.revenue, 0);
  const totalPay = byCategory.reduce((s, c) => s + c.driverPayout, 0);
  const totalFees = totalRev - totalPay;

  return {
    totalRevenue: totalRev,
    totalPlatformFees: totalFees,
    totalDriverPayouts: totalPay,
    avgMargin: totalRev > 0 ? (totalFees / totalRev) * 100 : 0,
    byCategory,
    byTripType,
  };
}
