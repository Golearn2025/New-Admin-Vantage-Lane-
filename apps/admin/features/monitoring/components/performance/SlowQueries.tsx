/**
 * Slow Queries Component
 * 
 * Lista cu query-uri lente din Supabase
 * Conform RULES.md: <30 linii
 */

'use client';

import { Card, DataTable } from '@vantage-lane/ui-core';
import { slowQueriesColumns } from '../../columns/slowQueriesColumns';
import type { SlowQuery } from '../../types';
import React, { useMemo } from 'react';
import styles from './SlowQueries.module.css';

interface SlowQueriesProps {
  queries: SlowQuery[];
}

export function SlowQueries({ queries }: SlowQueriesProps): JSX.Element {
  return (
    <Card className={styles.queriesCard || ""}>
      <h3 className={styles.cardTitle || ""}>Slow Database Queries</h3>
      
      <DataTable
        data={queries || []}
        columns={slowQueriesColumns}
        pagination={{ 
          pageSize: 5,
          pageIndex: 0,
          totalCount: queries?.length || 0
        }}
      />
    </Card>
  );
}
