/**
 * Deployment Timeline Component
 * 
 * Timeline cu roadmap-ul deployment-urilor
 * Conform RULES.md: <30 linii, simple display
 */

'use client';

import { Card, Badge } from '@vantage-lane/ui-core';
import styles from './DeploymentTimeline.module.css';

export function DeploymentTimeline(): JSX.Element {
  return (
    <Card className={styles.timelineCard}>
      <h3 className={styles.cardTitle}>Deployment Roadmap</h3>
      
      <div className={styles.timeline}>
        <div className={styles.timelineItem}>
          <Badge color="success">✓ Completed</Badge>
          <span>Admin Dashboard - Production ready</span>
        </div>
        <div className={styles.timelineItem}>
          <Badge color="info">🚧 In Progress</Badge>
          <span>Landing Page - Cristi working</span>
        </div>
        <div className={styles.timelineItem}>
          <Badge color="neutral">📅 Planned</Badge>
          <span>Backend + Driver + Client Apps - 2025</span>
        </div>
      </div>
    </Card>
  );
}
