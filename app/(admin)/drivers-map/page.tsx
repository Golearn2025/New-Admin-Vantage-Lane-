/**
 * Drivers Map Page - Route Handler
 * 
 * Simple routing layer that imports and renders the feature component
 * (Following architecture: app/ for routing only, features/ for UI logic)
 */

import { LiveDriversMapPage } from '@features/live-drivers-map';

export default function DriversMapRoute() {
  return <LiveDriversMapPage />;
}

export const metadata = {
  title: 'Live Drivers Map | Vantage Lane Admin',
  description: 'Real-time map view of all online drivers and their locations',
};
