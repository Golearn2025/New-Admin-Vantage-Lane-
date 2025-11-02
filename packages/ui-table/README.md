# @vantage-lane/ui-table

Reusable DataTable component for Vantage Lane Admin.

## Features

- ✅ Fixed table layout (headers always align with body)
- ✅ Long text truncated with ellipsis + tooltip
- ✅ Column resizing with mouse
- ✅ Sticky header (optional)
- ✅ Row click handler
- ✅ Pagination (optional)
- ✅ Sorting (optional)
- ✅ 100% Design Tokens

## Usage

```tsx
import { DataTable } from '@vantage-lane/ui-table';

<DataTable
  data={rows}
  columns={[
    { key: 'client', header: 'Client', width: 180, resizable: true },
    { key: 'route', header: 'Route', width: 220, resizable: true },
  ]}
  onRowClick={(row) => console.log(row)}
  stickyHeader
  pagination={{
    pageIndex: 0,
    pageSize: 25,
    totalCount: 100,
    onPageChange: (page) => {}
  }}
/>
```
