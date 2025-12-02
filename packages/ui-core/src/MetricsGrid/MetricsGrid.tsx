/**
 * MetricsGrid Component
 * 
 * Reutilizabil grid de StatCards pentru metrics
 * 100% design tokens, <30 linii
 */

import { StatCard } from '../StatCard';
import styles from './MetricsGrid.module.css';

interface MetricData {
  label: string;
  value: string | number;
  trendLabel?: string;
}

export interface MetricsGridProps {
  /**
   * Array of metrics to display as StatCards
   */
  metrics: MetricData[];
}

export function MetricsGrid({ metrics }: MetricsGridProps): JSX.Element {
  return (
    <div className={styles.grid}>
      {metrics.map((metric, index) => (
        <StatCard
          key={`${metric.label}-${index}`}
          label={metric.label}
          value={metric.value}
          {...(metric.trendLabel && { trendLabel: metric.trendLabel })}
        />
      ))}
    </div>
  );
}
