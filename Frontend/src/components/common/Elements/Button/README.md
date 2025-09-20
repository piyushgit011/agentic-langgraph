# Button Component

A comprehensive, customizable button component with multiple variants and TypeScript support.

## Features

- **Multiple button types**: 20+ predefined button styles
- **Icon support**: Left and right icon positioning
- **TypeScript support**: Full type safety
- **Theme integration**: Automatic theme color usage
- **Accessibility**: ARIA attributes and keyboard navigation
- **Responsive**: Mobile-friendly design

## Usage

```tsx
import { Button } from '../Elements';

// Basic button
<Button>Click me</Button>

// Button with type
<Button buttonType="dashed" leftIcon={<AddIcon />}>
  Add Item
</Button>

// Form submit button
<Button buttonType="custom" type="submit">
  Submit Form
</Button>
```

## Props

### ButtonProps Interface

```tsx
interface ButtonProps {
  children: React.ReactNode;
  buttonType?: ButtonType;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}
```

### ButtonType Options

| Type | Description | Use Case |
|------|-------------|----------|
| `custom` | Standard button with all features | Primary actions |
| `dashed` | Dashed border for adding items | Add new items |
| `text` | Transparent background | Secondary actions |
| `light` | Light gray background | Secondary actions |
| `dark` | Dark background | Dark theme actions |
| `square` | Square buttons for action icons | Icon-only actions |
| `icon` | Transparent icon buttons | Toolbar actions |
| `send` | Circular send button | Chat/messaging |
| `next` | Primary action button | Navigation |
| `rounded` | Rounded corner button | Modern UI |
| `ai` | AI tutor button | AI features |
| `page` | Pagination buttons | Navigation |
| `search` | Search button | Search functionality |
| `circle` | Circular button | Floating actions |
| `dropdown` | Dropdown trigger | Menu triggers |
| `dropdownItem` | Dropdown menu item | Menu items |
| `circleFilled` | Filled circular button | Status indicators |
| `modalLight` | Light modal button | Modal actions |
| `modalDark` | Dark modal button | Modal actions |
| `back` | Back navigation button | Navigation |
| `start` | Start action button | Onboarding |
| `toggle` | Toggle button | Settings |

## Examples

### Basic Buttons

```tsx
// Primary button
<Button buttonType="custom" onClick={handleSubmit}>
  Submit Form
</Button>

// Secondary button
<Button buttonType="text" onClick={handleCancel}>
  Cancel
</Button>

// Disabled button
<Button buttonType="custom" disabled>
  Loading...
</Button>
```

### Icon Buttons

```tsx
// Button with left icon
<Button buttonType="dashed" leftIcon={<AddIcon />}>
  Add New Item
</Button>

// Button with right icon
<Button buttonType="custom" rightIcon={<ArrowRightIcon />}>
  Continue
</Button>

// Icon-only button
<Button buttonType="icon" onClick={handleDelete}>
  <DeleteIcon />
</Button>
```

### Form Buttons

```tsx
// Submit button
<Button buttonType="custom" type="submit">
  Save Changes
</Button>

// Reset button
<Button buttonType="text" type="reset">
  Reset Form
</Button>
```

### Navigation Buttons

```tsx
// Back button
<Button buttonType="back" onClick={handleBack}>
  Back
</Button>

// Next button
<Button buttonType="next" onClick={handleNext}>
  Next Step
</Button>
```

### Specialized Buttons

```tsx
// AI tutor button
<Button buttonType="ai" onClick={handleAIAssist}>
  Ask AI Tutor
</Button>

// Search button
<Button buttonType="search" onClick={handleSearch}>
  Search
</Button>

// Toggle button
<Button buttonType="toggle" onClick={handleToggle}>
  Toggle Settings
</Button>
```

## Styling

### Theme Integration

The button component automatically uses your application's theme colors:

```tsx
// Automatically uses theme colors
<Button buttonType="custom">Themed Button</Button>
```

### Custom Styling

You can add custom classes for additional styling:

```tsx
<Button buttonType="custom" className="my-custom-button">
  Custom Styled Button
</Button>
```

### CSS Custom Properties

The button uses CSS custom properties for theming:

```css
:root {
  --button-primary-color: #007bff;
  --button-secondary-color: #6c757d;
  --button-success-color: #28a745;
  --button-danger-color: #dc3545;
  --button-warning-color: #ffc107;
  --button-info-color: #17a2b8;
}
```

## Accessibility

### ARIA Attributes

The button component includes proper ARIA attributes:

- `role="button"` for non-button elements
- `aria-disabled` for disabled state
- `aria-label` for icon-only buttons
- `aria-describedby` for buttons with descriptions

### Keyboard Navigation

- **Enter/Space**: Activates the button
- **Tab**: Focuses the button
- **Escape**: Closes dropdowns (if applicable)

### Screen Reader Support

```tsx
// Icon button with proper labeling
<Button 
  buttonType="icon" 
  onClick={handleDelete}
  aria-label="Delete item"
>
  <DeleteIcon />
</Button>
```

## Performance

### Optimization Features

- **React.memo**: Prevents unnecessary re-renders
- **Event delegation**: Efficient event handling
- **Lazy loading**: Supports code splitting

### Bundle Size

The button component is optimized for minimal bundle impact:

- **Tree shaking**: Unused button types excluded
- **Code splitting**: Can be lazy loaded
- **Minimal dependencies**: Only essential imports

## Testing

### Unit Tests

```tsx
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../Elements';

test('button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <Button onClick={handleClick}>Click me</Button>
  );
  
  fireEvent.click(getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

```tsx
test('button submits form when type is submit', () => {
  const handleSubmit = jest.fn();
  const { getByRole } = render(
    <form onSubmit={handleSubmit}>
      <Button type="submit">Submit</Button>
    </form>
  );
  
  fireEvent.click(getByRole('button'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
```

## Migration from JSX

If migrating from the JSX version:

### Old Usage
```tsx
import CustomButton from '../Elements/Button/Button';

<CustomButton
  buttonType="custom"
  onClick={handleClick}
>
  Click me
</CustomButton>
```

### New Usage
```tsx
import { Button } from '../Elements';

<Button
  buttonType="custom"
  onClick={handleClick}
>
  Click me
</Button>
```

## Troubleshooting

### Common Issues

1. **Button not responding to clicks**
   - Check if `onClick` prop is provided
   - Verify button is not disabled
   - Ensure no overlapping elements

2. **Styling not applied**
   - Check if theme is properly configured
   - Verify CSS custom properties are defined
   - Ensure no conflicting styles

3. **TypeScript errors**
   - Check prop types match interface
   - Verify imports are correct
   - Ensure TypeScript is properly configured

### Debug Tips

```tsx
// Add debugging to button clicks
<Button 
  onClick={(e) => {
    console.log('Button clicked:', e);
    handleClick(e);
  }}
>
  Debug Button
</Button>
```

## Related Components

- **Input**: Form input fields
- **Modal**: Modal dialogs with buttons
- **Select**: Dropdown components
- **Checkbox**: Form checkboxes
- **RadioButton**: Form radio buttons

## Version History

- **v2.0.0**: Added TypeScript support
- **v1.5.0**: Added theme integration
- **v1.0.0**: Initial release with basic button types
