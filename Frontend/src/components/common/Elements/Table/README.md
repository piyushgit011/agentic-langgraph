# Table Component

A comprehensive, customizable table component with sorting, filtering, pagination, and TypeScript support.

## Features

- **Sorting**: Multi-column sorting with custom sort functions
- **Filtering**: Global and column-specific filtering
- **Pagination**: Built-in pagination with customizable page sizes
- **Selection**: Row selection with checkboxes
- **TypeScript support**: Full type safety
- **Theme integration**: Automatic theme color usage
- **Accessibility**: ARIA attributes and keyboard navigation
- **Responsive**: Mobile-friendly design with horizontal scrolling

## Usage

```tsx
import { Table } from '../Elements';

// Basic table
<Table
  data={tableData}
  columns={columns}
  onRowClick={handleRowClick}
/>

// Table with sorting and filtering
<Table
  data={tableData}
  columns={columns}
  sortable={true}
  filterable={true}
  onSort={handleSort}
  onFilter={handleFilter}
/>
```

## Props

### TableProps Interface

```tsx
interface TableProps {
  data: TableData[];
  columns: Column[];
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: TableData) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: FilterState) => void;
  onSelectionChange?: (selectedRows: TableData[]) => void;
  className?: string;
}
```

### Column Interface

```tsx
interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: TableData) => React.ReactNode;
}
```

### TableData Interface

```tsx
interface TableData {
  id: string | number;
  [key: string]: any;
}
```

## Examples

### Basic Table

```tsx
const columns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' },
  { key: 'status', title: 'Status' }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' }
];

<Table
  data={data}
  columns={columns}
  onRowClick={(row) => console.log('Clicked row:', row)}
/>
```

### Sortable Table

```tsx
const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
  { key: 'status', title: 'Status', sortable: true }
];

<Table
  data={data}
  columns={columns}
  sortable={true}
  onSort={(column, direction) => {
    console.log(`Sorting ${column} in ${direction} direction`);
  }}
/>
```

### Filterable Table

```tsx
const columns = [
  { key: 'name', title: 'Name', filterable: true },
  { key: 'email', title: 'Email', filterable: true },
  { key: 'role', title: 'Role', filterable: true },
  { key: 'status', title: 'Status', filterable: true }
];

<Table
  data={data}
  columns={columns}
  filterable={true}
  onFilter={(filters) => {
    console.log('Applied filters:', filters);
  }}
/>
```

### Table with Custom Rendering

```tsx
const columns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { 
    key: 'status', 
    title: 'Status',
    render: (value, row) => (
      <span className={`status-badge status-${value.toLowerCase()}`}>
        {value}
      </span>
    )
  },
  {
    key: 'actions',
    title: 'Actions',
    render: (value, row) => (
      <div className="action-buttons">
        <Button buttonType="icon" onClick={() => handleEdit(row)}>
          <EditIcon />
        </Button>
        <Button buttonType="icon" onClick={() => handleDelete(row)}>
          <DeleteIcon />
        </Button>
      </div>
    )
  }
];
```

### Table with Pagination

```tsx
<Table
  data={data}
  columns={columns}
  pagination={true}
  pageSize={10}
  onRowClick={handleRowClick}
/>
```

### Selectable Table

```tsx
<Table
  data={data}
  columns={columns}
  selectable={true}
  onSelectionChange={(selectedRows) => {
    console.log('Selected rows:', selectedRows);
  }}
/>
```

## Styling

### Theme Integration

The table component automatically uses your application's theme colors:

```tsx
// Automatically uses theme colors
<Table data={data} columns={columns} />
```

### Custom Styling

You can add custom classes for additional styling:

```tsx
<Table
  data={data}
  columns={columns}
  className="my-custom-table"
/>
```

### CSS Custom Properties

The table uses CSS custom properties for theming:

```css
:root {
  --table-header-bg: #f8f9fa;
  --table-border-color: #dee2e6;
  --table-hover-bg: #f8f9fa;
  --table-selected-bg: #e3f2fd;
  --table-text-color: #212529;
  --table-sort-icon-color: #6c757d;
}
```

## Accessibility

### ARIA Attributes

The table component includes proper ARIA attributes:

- `role="table"` for the table element
- `role="columnheader"` for header cells
- `role="row"` for table rows
- `role="cell"` for data cells
- `aria-sort` for sortable columns
- `aria-selected` for selectable rows

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and checkboxes
- **Arrow keys**: Navigate between cells (when focused)
- **Escape**: Close dropdowns and filters

### Screen Reader Support

```tsx
// Table with proper labeling
<Table
  data={data}
  columns={columns}
  aria-label="User data table"
  aria-describedby="table-description"
/>
```

## Performance

### Optimization Features

- **Virtual scrolling**: For large datasets
- **Memoization**: Prevents unnecessary re-renders
- **Debounced filtering**: Efficient filter updates
- **Lazy loading**: Supports code splitting

### Bundle Size

The table component is optimized for minimal bundle impact:

- **Tree shaking**: Unused features excluded
- **Code splitting**: Can be lazy loaded
- **Minimal dependencies**: Only essential imports

## Testing

### Unit Tests

```tsx
import { render, fireEvent } from '@testing-library/react';
import { Table } from '../Elements';

test('table renders data correctly', () => {
  const columns = [{ key: 'name', title: 'Name' }];
  const data = [{ id: 1, name: 'John Doe' }];
  
  const { getByText } = render(
    <Table data={data} columns={columns} />
  );
  
  expect(getByText('John Doe')).toBeInTheDocument();
});
```

### Integration Tests

```tsx
test('table calls onRowClick when row is clicked', () => {
  const handleRowClick = jest.fn();
  const columns = [{ key: 'name', title: 'Name' }];
  const data = [{ id: 1, name: 'John Doe' }];
  
  const { getByText } = render(
    <Table 
      data={data} 
      columns={columns} 
      onRowClick={handleRowClick}
    />
  );
  
  fireEvent.click(getByText('John Doe'));
  expect(handleRowClick).toHaveBeenCalledWith(data[0]);
});
```

## Migration from JSX

If migrating from the JSX version:

### Old Usage
```tsx
import Table from '../Elements/Table/Table';

<Table
  data={tableData}
  columns={columns}
  onRowClick={handleRowClick}
/>
```

### New Usage
```tsx
import { Table } from '../Elements';

<Table
  data={tableData}
  columns={columns}
  onRowClick={handleRowClick}
/>
```

## Troubleshooting

### Common Issues

1. **Table not rendering data**
   - Check if data array is not empty
   - Verify column keys match data properties
   - Ensure data has unique `id` field

2. **Sorting not working**
   - Check if `sortable` prop is true
   - Verify column has `sortable: true`
   - Ensure `onSort` callback is provided

3. **Filtering not working**
   - Check if `filterable` prop is true
   - Verify column has `filterable: true`
   - Ensure `onFilter` callback is provided

4. **TypeScript errors**
   - Check data and column types match interfaces
   - Verify all required props are provided
   - Ensure TypeScript is properly configured

### Debug Tips

```tsx
// Add debugging to table events
<Table
  data={data}
  columns={columns}
  onRowClick={(row) => {
    console.log('Row clicked:', row);
    handleRowClick(row);
  }}
  onSort={(column, direction) => {
    console.log(`Sorting ${column} in ${direction} direction`);
    handleSort(column, direction);
  }}
/>
```

## Related Components

- **Button**: Action buttons in table cells
- **Input**: Filter inputs for table columns
- **Select**: Dropdown filters for table columns
- **Checkbox**: Row selection checkboxes
- **Modal**: Confirmation dialogs for table actions

## Version History

- **v2.0.0**: Added TypeScript support
- **v1.5.0**: Added theme integration
- **v1.2.0**: Added pagination and selection
- **v1.0.0**: Initial release with basic table functionality
