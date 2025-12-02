/**
 * Performance Table Columns
 * 
 * DataTable columns pentru slow requests
 * Conform RULES.md: ui-core components, lucide-react icons
 */

import { Badge } from '@vantage-lane/ui-core';
import { SlowRequest } from '@entities/health';

export const performanceColumns = [
  {
    id: 'method',
    accessorKey: 'method',
    header: 'Method',
    cell: ({ getValue }: { getValue: () => string }) => (
      <Badge color={getValue() === 'GET' ? 'neutral' : 'info'}>
        {getValue()}
      </Badge>
    )
  },
  {
    id: 'path',
    accessorKey: 'path',
    header: 'Endpoint',
    cell: ({ getValue }: { getValue: () => string }) => (
      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
        {getValue()}
      </code>
    )
  },
  {
    id: 'responseTime',
    accessorKey: 'responseTime',
    header: 'Response Time',
    cell: ({ getValue }: { getValue: () => number }) => {
      const time = getValue();
      const color = time > 1000 ? 'danger' : 
                    time > 500 ? 'warning' : 'success';
      return (
        <Badge color={color}>
          {time}ms
        </Badge>
      );
    }
  },
  {
    id: 'statusCode',
    accessorKey: 'statusCode',
    header: 'Status',
    cell: ({ getValue }: { getValue: () => number }) => {
      const code = getValue();
      const color = code >= 500 ? 'danger' :
                    code >= 400 ? 'warning' : 'success';
      return (
        <Badge color={color}>
          {code}
        </Badge>
      );
    }
  },
  {
    id: 'timestamp',
    accessorKey: 'timestamp',
    header: 'Time',
    cell: ({ getValue }: { getValue: () => string }) => {
      const time = new Date(getValue());
      return (
        <span className="text-sm text-gray-600">
          {time.toLocaleTimeString()}
        </span>
      );
    }
  }
];
