/**
 * LaunchTab — Launch & Scale roadmap
 *
 * REGULA 11: < 200 lines | Lucide React icons
 */

'use client';

import React from 'react';
import { Badge } from '@vantage-lane/ui-core';
import { CheckCircle, Play, Clock } from 'lucide-react';
import type { BIData, LaunchMilestone } from '@entities/business-intelligence';
import styles from './BIPage.module.css';

interface Props { data: BIData }

function statusIcon(status: LaunchMilestone['status']) {
  const size = 16;
  switch (status) {
    case 'done': return <CheckCircle size={size} color="var(--color-success-500)" />;
    case 'active': return <Play size={size} color="var(--color-theme-500)" />;
    case 'upcoming': return <Clock size={size} color="var(--color-text-secondary)" />;
  }
}

function statusBadge(status: LaunchMilestone['status']): 'success' | 'info' | 'neutral' {
  if (status === 'done') return 'success';
  if (status === 'active') return 'info';
  return 'neutral';
}

export function LaunchTab({ data }: Props) {
  return (
    <div className={styles.tabContent}>
      {data.launchPlan.map((milestone) => (
        <div key={milestone.phase} className={styles.milestone} data-status={milestone.status}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
            {statusIcon(milestone.status)}
            <span className={styles.milestoneTitle}>{milestone.title}</span>
            <Badge color={statusBadge(milestone.status)} size="sm" variant="solid">
              {milestone.status}
            </Badge>
          </div>
          <p className={styles.milestoneDesc}>{milestone.description}</p>
          <div className={styles.milestoneItems}>
            {milestone.items.map((item, idx) => (
              <span key={idx}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
