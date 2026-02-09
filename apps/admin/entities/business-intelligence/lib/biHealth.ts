/**
 * BI Health Score Calculator
 *
 * Pure function — no side effects, no UI.
 * File: < 200 lines | Functions: < 50 lines
 */

import type { BIData, BusinessHealthScore } from '../api/biTypes';

export function calculateHealthScore(data: BIData): BusinessHealthScore {
  const rev = scoreRevenueStability(data);
  const client = scoreClientDiversification(data);
  const completion = scoreCompletion(data);
  const fleet = scoreFleetUtilization(data);
  const driver = scoreDriverAvailability(data);

  const overall = Math.round((rev + client + completion + fleet + driver) / 5);

  return {
    overall,
    revenueStability: rev,
    clientDiversification: client,
    completionRate: completion,
    fleetUtilization: fleet,
    driverAvailability: driver,
  };
}

function scoreRevenueStability(data: BIData): number {
  const cats = data.revenue.byCategory.length;
  if (cats === 0) return 0;
  if (cats === 1) return 30;
  if (cats === 2) return 50;
  if (cats === 3) return 70;
  return Math.min(90, 60 + cats * 5);
}

function scoreClientDiversification(data: BIData): number {
  const total = data.customers.totalCustomers;
  if (total === 0) return 0;
  if (total === 1) return 15;
  if (total <= 3) return 30;
  if (total <= 10) return 55;
  if (total <= 50) return 75;
  return 90;
}

function scoreCompletion(data: BIData): number {
  return Math.min(100, data.bookings.completionRate);
}

function scoreFleetUtilization(data: BIData): number {
  const totalVehicles = data.fleet.totalVehicles;
  const activeVehicles = data.fleet.activeVehicles;
  if (totalVehicles === 0) return 0;
  return Math.round((activeVehicles / totalVehicles) * 100);
}

function scoreDriverAvailability(data: BIData): number {
  const total = data.drivers.totalDrivers;
  const online = data.drivers.onlineNow;
  if (total === 0) return 0;
  return Math.min(100, Math.round((online / total) * 100));
}
