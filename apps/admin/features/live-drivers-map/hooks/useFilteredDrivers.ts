/**
 * useFilteredDrivers — Filters, sorts, and counts drivers.
 */

import { useMemo } from 'react';

interface RealtimeDriver {
  id: string;
  firstName: string | null;
  lastName: string | null;
  onlineStatus: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  [key: string]: any;
}

export function useFilteredDrivers(drivers: RealtimeDriver[], searchQuery: string) {
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return drivers
      .filter((d) => {
        if (!q) return true;
        const name = `${d.firstName} ${d.lastName}`.toLowerCase();
        const plate = d.vehicles?.[0]?.license_plate?.toLowerCase() || '';
        return name.includes(q) || plate.includes(q);
      })
      .sort((a, b) => {
        const aB = a.onlineStatus !== 'online' ? 1 : 0;
        const bB = b.onlineStatus !== 'online' ? 1 : 0;
        return aB - bB;
      });
  }, [drivers, searchQuery]);

  const onlineCount = drivers.filter((d) => d.onlineStatus === 'online').length;
  const busyCount = drivers.filter((d) => d.onlineStatus !== 'online' && d.onlineStatus !== 'offline').length;

  return { filteredDrivers: filtered, onlineCount, busyCount, totalCount: drivers.length };
}
