/**
 * Cross-Project Monitoring Tab
 * 
 * Real-time monitoring - SPLIT în componente mici conform RULES.md
 */

'use client';

import { EcosystemOverview } from './EcosystemOverview';
import { ProjectsStatusList } from './ProjectsStatusList';
import { DeploymentTimeline } from './DeploymentTimeline';
import { useCrossProjectMetrics } from '../hooks/useCrossProjectMetrics';
import styles from './CrossProjectTab.module.css';

export function CrossProjectTab(): JSX.Element {
  const { metrics, loading, error } = useCrossProjectMetrics();

  if (loading) {
    return (
      <div className={styles.loading || ""}>
        <div className={styles.spinner || ""}></div>
        <p>Loading ecosystem metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error || ""}>
        <p>Failed to load ecosystem data: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container || ""}>
      <EcosystemOverview metrics={metrics} />
      <ProjectsStatusList metrics={metrics} />
      <DeploymentTimeline />
    </div>
  );
}
