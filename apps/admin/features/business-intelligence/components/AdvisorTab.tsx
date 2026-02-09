/**
 * AdvisorTab — All AI insights, filterable by category
 *
 * REGULA 11: < 200 lines | Lucide React icons
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge } from '@vantage-lane/ui-core';
import { AlertTriangle, Zap, TrendingUp, Sprout, Info } from 'lucide-react';
import type { BIData, AIInsight, InsightCategory } from '@entities/business-intelligence';
import styles from './BIPage.module.css';

interface Props { data: BIData }

const CATEGORIES: { key: InsightCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'risk', label: 'Risk' },
  { key: 'action', label: 'Action' },
  { key: 'opportunity', label: 'Opportunity' },
  { key: 'growth', label: 'Growth' },
  { key: 'system', label: 'System' },
];

function badgeColor(cat: InsightCategory): 'danger' | 'warning' | 'success' | 'info' | 'neutral' {
  const map: Record<InsightCategory, 'danger' | 'warning' | 'success' | 'info' | 'neutral'> = {
    risk: 'danger', action: 'warning', opportunity: 'success', growth: 'info', system: 'neutral',
  };
  return map[cat];
}

function catIcon(cat: InsightCategory) {
  const size = 16;
  switch (cat) {
    case 'risk': return <AlertTriangle size={size} />;
    case 'action': return <Zap size={size} />;
    case 'opportunity': return <TrendingUp size={size} />;
    case 'growth': return <Sprout size={size} />;
    case 'system': return <Info size={size} />;
  }
}

export function AdvisorTab({ data }: Props) {
  const [filter, setFilter] = useState<InsightCategory | 'all'>('all');
  const filtered = useMemo(() => {
    if (filter === 'all') return data.insights;
    return data.insights.filter(i => i.category === filter);
  }, [data.insights, filter]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.filterRow}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            className={`${styles.filterBtn} ${filter === c.key ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
            {c.key !== 'all' && (
              <span> ({data.insights.filter(i => i.category === c.key).length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <div style={{ padding: 'var(--spacing-4)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No insights for this category.
          </div>
        </Card>
      )}

      {filtered.map(insight => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  return (
    <div className={styles.insightCard} data-category={insight.category}>
      <div style={{ flexShrink: 0, paddingTop: 'var(--spacing-1)' }}>
        {catIcon(insight.category)}
      </div>
      <div className={styles.insightBody}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)', flexWrap: 'wrap' }}>
          <Badge color={badgeColor(insight.category)} size="sm" variant="solid">
            {insight.category.toUpperCase()}
          </Badge>
          <Badge color={insight.priority === 'critical' ? 'danger' : 'neutral'} size="sm">
            {insight.priority}
          </Badge>
          <span className={styles.insightTitle}>{insight.title}</span>
        </div>
        <p className={styles.insightDesc}>{insight.description}</p>
        <p className={styles.insightWhy}>Why: {insight.why}</p>
        <p className={styles.insightRec}>→ {insight.recommendation}</p>
      </div>
    </div>
  );
}
