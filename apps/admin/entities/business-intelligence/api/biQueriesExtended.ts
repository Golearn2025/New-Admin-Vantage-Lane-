/**
 * BI Queries Extended — Routes, Drivers, Fleet, Customers
 *
 * Split from biQueries.ts to stay < 200 lines.
 * Functions < 50 lines each.
 */

import { createBrowserClient } from '@supabase/ssr';
import { formatDayOfWeek } from '../lib/biFormatters';
import type {
    CustomerRow,
    CustomersSummary,
    DemandByHour,
    DriverRow,
    DriversSummary,
    FleetSummary,
    RouteData,
    RoutesSummary,
    VehicleRow,
} from './biTypes';

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/* ── Routes & Demand ── */

export async function fetchRoutesSummary(): Promise<RoutesSummary> {
  const sb = getClient();

  const { data: legs } = await sb
    .from('booking_legs')
    .select('pickup_location, destination, distance_miles, duration_min, leg_price')
    .limit(5000);

  const rows = legs ?? [];
  const totalLegs = rows.length;
  const distances = rows.map((r: Record<string, unknown>) => (r.distance_miles as number) ?? 0).filter(Boolean);
  const durations = rows.map((r: Record<string, unknown>) => (r.duration_min as number) ?? 0).filter(Boolean);
  const avgDistance = distances.length > 0 ? distances.reduce((a, b) => a + b, 0) / distances.length : 0;
  const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  const totalLegRevenue = rows.reduce((s: number, r: Record<string, unknown>) => s + ((r.leg_price as number) ?? 0), 0);

  const routeMap = new Map<string, { pickup: string; destination: string; trips: number; totalMiles: number; totalMin: number; revenue: number; milesCount: number; minCount: number }>();
  for (const r of rows) {
    const row = r as Record<string, unknown>;
    const p = (row.pickup_location as string) ?? '';
    const d = (row.destination as string) ?? '';
    if (!p || !d) continue;
    const key = `${p}|${d}`;
    const entry = routeMap.get(key) ?? { pickup: p, destination: d, trips: 0, totalMiles: 0, totalMin: 0, revenue: 0, milesCount: 0, minCount: 0 };
    entry.trips += 1;
    entry.revenue += (row.leg_price as number) ?? 0;
    const mi = row.distance_miles as number | null;
    if (mi) { entry.totalMiles += mi; entry.milesCount += 1; }
    const mn = row.duration_min as number | null;
    if (mn) { entry.totalMin += mn; entry.minCount += 1; }
    routeMap.set(key, entry);
  }

  const topRoutes: RouteData[] = Array.from(routeMap.values())
    .map(e => ({
      pickup: e.pickup,
      destination: e.destination,
      trips: e.trips,
      avgMiles: e.milesCount > 0 ? e.totalMiles / e.milesCount : null,
      avgDuration: e.minCount > 0 ? Math.round(e.totalMin / e.minCount) : null,
      revenue: e.revenue,
      avgPrice: e.trips > 0 ? e.revenue / e.trips : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 15);

  const { data: bookings } = await sb
    .from('bookings')
    .select('start_at')
    .not('start_at', 'is', null)
    .limit(5000);

  const demandByTime: DemandByHour[] = [];
  const timeMap = new Map<string, DemandByHour>();
  for (const b of (bookings ?? [])) {
    const d = new Date((b as Record<string, unknown>).start_at as string);
    const dow = d.getUTCDay();
    const hour = d.getUTCHours();
    const key = `${dow}-${hour}`;
    const entry = timeMap.get(key) ?? { dayOfWeek: dow, dayName: formatDayOfWeek(dow), hour, bookings: 0 };
    entry.bookings += 1;
    timeMap.set(key, entry);
  }
  demandByTime.push(...Array.from(timeMap.values()).sort((a, b) => b.bookings - a.bookings));

  return { totalLegs, avgDistance, avgDuration, totalLegRevenue, topRoutes, demandByTime };
}

/* ── Drivers ── */

export async function fetchDriversSummary(): Promise<DriversSummary> {
  const sb = getClient();

  const { data: drivers } = await sb
    .from('drivers')
    .select('id, first_name, last_name, status, rating_average, rating_count, online_status, driver_performance_stats(total_completed, total_cancellations, completion_rate, warning_level)')
    .limit(500);

  const rows = (drivers ?? []) as Record<string, unknown>[];
  const driverRows: DriverRow[] = rows.map(d => {
    const perf = (d.driver_performance_stats as Record<string, unknown>[] | null)?.[0];
    return {
      id: d.id as string,
      name: `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim(),
      status: (d.status as string) ?? 'unknown',
      onlineStatus: (d.online_status as string) ?? 'offline',
      ratingAverage: Number(d.rating_average) || 0,
      ratingCount: Number(d.rating_count) || 0,
      totalCompleted: Number(perf?.total_completed) || 0,
      totalCancellations: Number(perf?.total_cancellations) || 0,
      completionRate: Number(perf?.completion_rate) || 0,
      warningLevel: (perf?.warning_level as string) ?? 'none',
    };
  });

  const active = driverRows.filter(d => d.status === 'active').length;
  const online = driverRows.filter(d => d.onlineStatus === 'online').length;
  const rated = driverRows.filter(d => d.ratingAverage > 0);
  const avgRating = rated.length > 0 ? rated.reduce((s, d) => s + d.ratingAverage, 0) / rated.length : 0;

  return { totalDrivers: driverRows.length, activeDrivers: active, onlineNow: online, avgRating, drivers: driverRows };
}

/* ── Fleet ── */

export async function fetchFleetSummary(): Promise<FleetSummary> {
  const sb = getClient();

  const { data: vehicles } = await sb
    .from('vehicles')
    .select('id, category, make, model, year, passenger_capacity, is_active, approval_status')
    .limit(500);

  const rows = (vehicles ?? []) as Record<string, unknown>[];
  const vehicleRows: VehicleRow[] = rows.map(v => ({
    category: (v.category as string) ?? 'unknown',
    make: (v.make as string) ?? '',
    model: (v.model as string) ?? '',
    year: Number(v.year) || 0,
    capacity: Number(v.passenger_capacity) || 0,
    isActive: Boolean(v.is_active),
    approvalStatus: (v.approval_status as string) ?? 'pending',
  }));

  const active = vehicleRows.filter(v => v.isActive).length;
  const pending = vehicleRows.filter(v => v.approvalStatus === 'pending').length;
  const cats = Array.from(new Set(vehicleRows.map(v => v.category).filter(Boolean)));

  return { totalVehicles: vehicleRows.length, activeVehicles: active, pendingApproval: pending, categories: cats, vehicles: vehicleRows };
}

/* ── Customers ── */

export async function fetchCustomersSummary(): Promise<CustomersSummary> {
  const sb = getClient();

  const { data: customers } = await sb
    .from('customers')
    .select('id, first_name, last_name, email, status, rating_average, created_at')
    .limit(500);

  const cRows = (customers ?? []) as Record<string, unknown>[];

  const { data: bookings } = await sb
    .from('bookings')
    .select('customer_id, booking_pricing(price)')
    .limit(5000);

  const custBookings = new Map<string, { count: number; revenue: number }>();
  for (const b of (bookings ?? [])) {
    const r = b as Record<string, unknown>;
    const cid = r.customer_id as string;
    if (!cid) continue;
    const pricing = (r.booking_pricing as Record<string, unknown>[] | null);
    const price = (pricing?.[0]?.price as number) ?? 0;
    const entry = custBookings.get(cid) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += price;
    custBookings.set(cid, entry);
  }

  const customerRows: CustomerRow[] = cRows.map(c => {
    const stats = custBookings.get(c.id as string) ?? { count: 0, revenue: 0 };
    return {
      id: c.id as string,
      name: `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim(),
      email: (c.email as string) ?? '',
      status: (c.status as string) ?? 'unknown',
      ratingAverage: Number(c.rating_average) || 0,
      bookings: stats.count,
      revenue: stats.revenue,
      avgPrice: stats.count > 0 ? stats.revenue / stats.count : 0,
      createdAt: (c.created_at as string) ?? '',
    };
  });

  const totalCust = customerRows.length;
  const activeCust = customerRows.filter(c => c.status === 'active').length;
  const avgBookings = totalCust > 0 ? customerRows.reduce((s, c) => s + c.bookings, 0) / totalCust : 0;
  const avgRevenue = totalCust > 0 ? customerRows.reduce((s, c) => s + c.revenue, 0) / totalCust : 0;

  return { totalCustomers: totalCust, activeCustomers: activeCust, avgBookingsPerCustomer: avgBookings, avgRevenuePerCustomer: avgRevenue, customers: customerRows };
}
