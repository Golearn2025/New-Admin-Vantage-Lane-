/**
 * Map Controls - Filter and refresh controls
 * 
 * Controls for filtering drivers and manual refresh
 */

'use client';

import { Button, Checkbox } from '@vantage-lane/ui-core';
import { RefreshCw, Play, Pause } from 'lucide-react';
import type { MapFilters } from '@entities/driver-location';
import styles from './MapControls.module.css';

interface MapControlsProps {
  filters: MapFilters;
  onFiltersChange: (filters: Partial<MapFilters>) => void;
  autoRefresh: boolean;
  onRefreshToggle: () => void;
  onManualRefresh: () => void;
  loading: boolean;
  compact?: boolean;
}

export function MapControls({
  filters,
  onFiltersChange,
  autoRefresh,
  onRefreshToggle,
  onManualRefresh,
  loading,
  compact = false
}: MapControlsProps) {
  
  return (
    <div className={compact ? styles.mapControlsCompact : styles.mapControls}>
      {/* Filters Section */}
      <div className={compact ? styles.controlsSectionCompact : styles.controlsSection}>
        <h4 className={compact ? styles.sectionTitleCompact : styles.sectionTitle}>Show Drivers</h4>
        <div className={compact ? styles.filterOptionsCompact : styles.filterOptions}>
          <Checkbox
            id="show-online"
            checked={filters.showOnline}
            onChange={(e) => onFiltersChange({ showOnline: e.target.checked })}
            label="Online"
          />
          
          <Checkbox
            id="show-busy"
            checked={filters.showBusy}
            onChange={(e) => onFiltersChange({ showBusy: e.target.checked })}
            label="Busy"
          />
        </div>
      </div>

      {!compact && (
        /* Refresh Controls */
        <div className={styles.controlsSection}>
          <h4 className={styles.sectionTitle}>Updates</h4>
          <div className={styles.refreshControls}>
            {/* Auto-refresh toggle */}
            <Button
              variant={autoRefresh ? "primary" : "secondary"}
              size="sm"
              onClick={onRefreshToggle}
            >
              {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
              {autoRefresh ? 'Auto On' : 'Auto Off'}
            </Button>

            {/* Manual refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={onManualRefresh}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
          
          <div className={styles.refreshInfo}>
            <small>
              {autoRefresh 
                ? 'Updates every 30 seconds' 
                : 'Auto-refresh disabled'
              }
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
