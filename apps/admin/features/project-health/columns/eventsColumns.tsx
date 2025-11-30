/**
 * Events Table Columns
 * 
 * DataTable columns pentru system events
 * Conform RULES.md: ui-core only, lucide-react icons
 */

import React, { useMemo } from 'react';
import { Badge } from '@vantage-lane/ui-core';
import { SystemEvent } from '@entities/health';

export const eventsColumns = [
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }: { getValue: () => 'info' | 'warning' | 'error' | 'success' }) => {
      const type = getValue();
      const color = 
        type === 'error' ? 'danger' :
        type === 'warning' ? 'warning' :
        type === 'success' ? 'success' : 'info';
      
      return (
        <Badge color={color}>
          {type.toUpperCase()}
        </Badge>
      );
    }
  },
  {
    id: 'message',
    accessorKey: 'message',
    header: 'Message',
    cell: ({ getValue }: { getValue: () => string }) => (
      <span className="text-sm">{getValue()}</span>
    )
  },
  {
    id: 'timestamp',
    accessorKey: 'timestamp',
    header: 'Time',
    cell: ({ getValue }: { getValue: () => string }) => {
      const time = new Date(getValue());
      return (
        <div className="text-sm text-gray-600">
          <div>{time.toLocaleTimeString()}</div>
          <div className="text-xs">{time.toLocaleDateString()}</div>
        </div>
      );
    }
  },
  {
    id: 'details',
    accessorKey: 'details',
    header: 'Details',
    cell: ({ getValue }: { getValue: () => Record<string, unknown> | undefined }) => {
      const details = getValue();
      if (!details) return <span className="text-gray-400">-</span>;

      // Memoize detail entries to prevent re-creation on every render
      const DetailEntries = useMemo(() => 
        Object.entries(details).map(([key, value]) => (
          <div key={key}>
            {key}: {String(value)}
          </div>
        )), 
        [details]
      );
      
      return (
        <div className="text-xs text-gray-500">
          {DetailEntries}
        </div>
      );
    }
  }
];
