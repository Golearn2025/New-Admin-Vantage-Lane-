/**
 * BI AI Insights Engine
 *
 * Pure functions that analyze data and return actionable insights.
 * No side effects, no UI, no fetch.
 * File: < 200 lines | Functions: < 50 lines
 */

import type { AIInsight, BIData } from '../api/biTypes';

let counter = 0;
function id(): string { return `insight-${++counter}`; }

export function generateAllInsights(data: BIData): AIInsight[] {
  counter = 0;
  return [
    ...bookingInsights(data),
    ...revenueInsights(data),
    ...driverInsights(data),
    ...fleetInsights(data),
    ...customerInsights(data),
    ...routeInsights(data),
  ];
}

function bookingInsights(d: BIData): AIInsight[] {
  const out: AIInsight[] = [];
  const { completionRate, totalBookings, statusBreakdown } = d.bookings;

  if (completionRate < 70) {
    out.push({ id: id(), category: 'risk', priority: 'high', title: 'Low Completion Rate', description: `Only ${completionRate}% of bookings are completed. Industry average is 85%.`, why: 'Uncompleted bookings mean lost revenue and poor customer experience.', recommendation: 'Set up automated reminders for pending bookings. Review cancellation reasons.' });
  }

  const pending = statusBreakdown.find(s => s.status === 'pending');
  if (pending && pending.percentage > 25) {
    out.push({ id: id(), category: 'action', priority: 'high', title: `${pending.count} Pending Bookings Need Attention`, description: `${pending.percentage}% of all bookings are still pending.`, why: 'Pending bookings risk becoming cancellations if not assigned quickly.', recommendation: 'Assign drivers to pending bookings immediately. Consider auto-assignment.' });
  }

  if (totalBookings > 0 && totalBookings < 100) {
    out.push({ id: id(), category: 'growth', priority: 'medium', title: 'Early Stage — Build Volume', description: `${totalBookings} bookings so far. Focus on reaching 500 for stable revenue.`, why: 'Higher volume means better data, better pricing, and more driver utilization.', recommendation: 'Launch Google Ads targeting luxury transport keywords. Partner with hotels.' });
  }

  return out;
}

function revenueInsights(d: BIData): AIInsight[] {
  const out: AIInsight[] = [];
  const { byCategory, avgMargin } = d.revenue;

  const top = byCategory[0];
  if (top) {
    const pct = d.revenue.totalRevenue > 0 ? Math.round((top.revenue / d.revenue.totalRevenue) * 100) : 0;
    if (pct > 50) {
      out.push({ id: id(), category: 'opportunity', priority: 'medium', title: `${top.category.toUpperCase()} Drives ${pct}% of Revenue`, description: `Your ${top.category} category generates £${top.revenue.toFixed(0)} — dominant revenue source.`, why: 'Revenue concentration is both a strength and a risk.', recommendation: `Double down on ${top.category} marketing. Also grow other categories to diversify.` });
    }
  }

  if (avgMargin > 0 && avgMargin < 25) {
    out.push({ id: id(), category: 'risk', priority: 'high', title: 'Low Platform Margin', description: `Current margin is ${avgMargin.toFixed(1)}%. Target is 25-30%.`, why: 'Low margins reduce sustainability and growth investment capacity.', recommendation: 'Review pricing structure. Consider minimum fare increases.' });
  }

  return out;
}

function driverInsights(d: BIData): AIInsight[] {
  const out: AIInsight[] = [];
  const { drivers, onlineNow, totalDrivers } = d.drivers;

  const critical = drivers.filter(dr => dr.warningLevel === 'critical');
  if (critical.length > 0) {
    out.push({ id: id(), category: 'risk', priority: 'critical', title: `${critical.length} Driver(s) at Critical Warning`, description: `Drivers with critical warnings: ${critical.map(dr => dr.name).join(', ')}`, why: 'Critical warnings indicate reliability issues that affect service quality.', recommendation: 'Review driver performance immediately. Consider temporary suspension.' });
  }

  if (totalDrivers > 0 && onlineNow / totalDrivers < 0.2) {
    out.push({ id: id(), category: 'action', priority: 'high', title: 'Low Driver Availability', description: `Only ${onlineNow} of ${totalDrivers} drivers are online.`, why: 'Low availability means longer wait times and missed bookings.', recommendation: 'Implement driver incentives for peak hours. Send push notifications.' });
  }

  return out;
}

function fleetInsights(d: BIData): AIInsight[] {
  const out: AIInsight[] = [];
  const { totalVehicles, activeVehicles, pendingApproval } = d.fleet;

  if (totalVehicles > 0 && activeVehicles / totalVehicles < 0.6) {
    out.push({ id: id(), category: 'action', priority: 'medium', title: 'Low Fleet Utilization', description: `Only ${activeVehicles} of ${totalVehicles} vehicles are active (${Math.round(activeVehicles / totalVehicles * 100)}%).`, why: 'Idle vehicles are a cost without revenue.', recommendation: 'Activate idle vehicles or remove them from the fleet.' });
  }

  if (pendingApproval > 0) {
    out.push({ id: id(), category: 'action', priority: 'medium', title: `${pendingApproval} Vehicles Pending Approval`, description: 'Vehicles waiting for approval cannot generate revenue.', why: 'Delays in approval slow down fleet expansion.', recommendation: 'Review and approve pending vehicles to increase capacity.' });
  }

  return out;
}

function customerInsights(d: BIData): AIInsight[] {
  const out: AIInsight[] = [];
  const { totalCustomers, avgBookingsPerCustomer, avgRevenuePerCustomer } = d.customers;

  if (totalCustomers <= 5) {
    out.push({ id: id(), category: 'risk', priority: 'critical', title: 'Critical: Customer Concentration Risk', description: `Only ${totalCustomers} customer(s). Business depends on very few clients.`, why: 'Losing even one customer would significantly impact revenue.', recommendation: 'Priority #1: Customer acquisition. Google Ads, hotel partnerships, corporate outreach.' });
  }

  if (avgBookingsPerCustomer > 20) {
    out.push({ id: id(), category: 'opportunity', priority: 'medium', title: 'Excellent Customer Retention', description: `Average ${avgBookingsPerCustomer.toFixed(0)} bookings per customer (£${avgRevenuePerCustomer.toFixed(0)} LTV).`, why: 'High retention means your service quality is strong.', recommendation: 'Use this as a selling point. Offer loyalty programs. Ask for referrals.' });
  }

  return out;
}

function routeInsights(d: BIData): AIInsight[] {
  const out: AIInsight[] = [];
  const { topRoutes, demandByTime } = d.routes;

  const airportRoutes = topRoutes.filter(r => /airport|gatwick|heathrow|stansted|luton|city airport/i.test(`${r.pickup} ${r.destination}`));
  if (airportRoutes.length > 0) {
    out.push({ id: id(), category: 'opportunity', priority: 'medium', title: 'Airport Routes Detected', description: `${airportRoutes.length} route(s) involve airports — premium pricing opportunity.`, why: 'Airport transfers command higher prices and are highly repeatable.', recommendation: 'Create fixed-price airport packages. Partner with airlines and travel agents.' });
  }

  const hotelRoutes = topRoutes.filter(r => /hotel|ritz|claridge|connaught|dorchester|savoy/i.test(`${r.pickup} ${r.destination}`));
  if (hotelRoutes.length > 0) {
    out.push({ id: id(), category: 'opportunity', priority: 'medium', title: 'Luxury Hotel Routes Active', description: `${hotelRoutes.length} route(s) involve luxury hotels.`, why: 'Hotel concierge partnerships can drive consistent high-value bookings.', recommendation: 'Approach hotel concierge teams with commission-based referral deals.' });
  }

  const peak = demandByTime[0];
  if (peak) {
    out.push({ id: id(), category: 'system', priority: 'low', title: `Peak Demand: ${peak.dayName} at ${peak.hour}:00`, description: `${peak.bookings} bookings at this time slot — your busiest period.`, why: 'Understanding demand patterns helps optimize driver scheduling.', recommendation: 'Ensure maximum driver availability during peak times. Consider surge pricing.' });
  }

  return out;
}
