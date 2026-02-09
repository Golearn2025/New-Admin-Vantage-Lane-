/**
 * BI Launch & Scale Plan
 *
 * Static roadmap data + dynamic status based on real metrics.
 * Pure function — no side effects.
 * File: < 200 lines
 */

import type { BIData, LaunchMilestone, LaunchPhase } from '../api/biTypes';

export function generateLaunchPlan(data: BIData): LaunchMilestone[] {
  const b = data.bookings.totalBookings;
  const c = data.customers.totalCustomers;
  const d = data.drivers.totalDrivers;

  return [
    {
      phase: 'pre_launch',
      title: 'Pre-Launch Setup',
      description: 'Platform configuration, fleet onboarding, initial testing.',
      status: 'done',
      items: [
        `✅ ${d} drivers onboarded`,
        `✅ ${data.fleet.totalVehicles} vehicles registered`,
        '✅ Pricing engine configured',
        '✅ Admin dashboard live',
      ],
    },
    {
      phase: 'launch',
      title: 'Launch (0–30 days)',
      description: 'First bookings, initial customers, service validation.',
      status: b > 0 ? 'done' : 'active',
      items: [
        b > 0 ? `✅ ${b} bookings completed` : '⏳ Get first 10 bookings',
        c > 0 ? `✅ ${c} customers acquired` : '⏳ Acquire first customers',
        b >= 50 ? '✅ 50+ bookings milestone' : `⏳ ${50 - b} more bookings to milestone`,
        '⏳ Collect first customer reviews',
      ],
    },
    {
      phase: 'stabilize',
      title: 'Stabilize (30–90 days)',
      description: 'Consistent service quality, driver reliability, pricing optimization.',
      status: b >= 100 ? 'done' : b >= 50 ? 'active' : 'upcoming',
      items: [
        b >= 100 ? '✅ 100+ bookings' : `⏳ Reach 100 bookings (${b}/100)`,
        c >= 10 ? '✅ 10+ customers' : `⏳ Reach 10 customers (${c}/10)`,
        '⏳ Achieve 85%+ completion rate',
        '⏳ Optimize peak-hour driver scheduling',
      ],
    },
    {
      phase: 'scale',
      title: 'Scale (90–180 days)',
      description: 'Growth marketing, corporate accounts, route expansion.',
      status: b >= 500 ? 'done' : b >= 100 ? 'active' : 'upcoming',
      items: [
        '⏳ Launch Google Ads campaign',
        '⏳ Sign 3+ corporate accounts',
        '⏳ Expand to 5+ regular routes',
        '⏳ Reach 500 bookings / month',
      ],
    },
    {
      phase: 'expand',
      title: 'Expansion (6–12 months)',
      description: 'New cities, new vehicle categories, API partnerships.',
      status: 'upcoming',
      items: [
        '⏳ Expand to second city',
        '⏳ Add helicopter / yacht transfers',
        '⏳ Build API for travel agent integrations',
        '⏳ Reach £100K monthly revenue',
      ],
    },
  ];
}
