# Sales Item Expansion Feature

## Overview
The sales listing page now displays only the first 2 products for sales with multiple items, with an expandable "...more" link to show all products.

## Features

### Desktop Table View
- Shows first 2 products by default
- Displays "...more (X more)" link if there are more than 2 products
- Click "...more" to expand and show all products
- Click "show less" to collapse back to 2 products
- Each product shows: Product Name × Quantity

### Mobile Card View
- Same functionality as desktop
- Shows first 2 products by default
- Expandable "...more" link for additional products
- "show less" to collapse

## Implementation Details

### State Management
```typescript
const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());
```

Uses a Set to track which sales are expanded by their ID. This allows:
- Multiple sales to be expanded simultaneously
- Efficient lookup (O(1))
- Easy add/remove operations

### Display Logic
```typescript
const isExpanded = expandedSales.has(sale._id);
const displayItems = isExpanded ? sale.items : sale.items.slice(0, 2);
const hasMore = sale.items.length > 2;
```

For each sale:
1. Check if it's in the expanded set
2. Show all items if expanded, otherwise show first 2
3. Display "...more" button only if there are more than 2 items

### Expand/Collapse Actions

**Expand:**
```typescript
onClick={() => setExpandedSales(prev => new Set(prev).add(sale._id))}
```

**Collapse:**
```typescript
onClick={() => {
    const newSet = new Set(expandedSales);
    newSet.delete(sale._id);
    setExpandedSales(newSet);
}}
```

## User Experience

### Before Expansion
```
Products:
  Wireless Headphones × 2
  Smart Watch × 1
  ...more (3 more)
```

### After Expansion
```
Products:
  Wireless Headphones × 2
  Smart Watch × 1
  Laptop Stand × 1
  Cotton T-Shirt × 3
  Yoga Mat × 2
  show less
```

## Benefits

1. **Cleaner UI**: Reduces visual clutter for sales with many products
2. **Better Performance**: Less DOM elements rendered initially
3. **Improved Readability**: Easier to scan through sales list
4. **Flexible**: Users can expand only the sales they're interested in
5. **Consistent**: Same behavior on desktop and mobile

## Technical Considerations

### Performance
- Expansion state is maintained per sale
- No API calls needed for expansion (data already loaded)
- Minimal re-renders (only affected sale row updates)

### Accessibility
- Buttons are keyboard accessible
- Clear labels ("...more (X more)" and "show less")
- Maintains focus context

### Responsive Design
- Works on both desktop table and mobile cards
- Touch-friendly button sizes on mobile
- Consistent interaction pattern across devices

## Future Enhancements

Potential improvements:
- Remember expansion state in localStorage
- "Expand All" / "Collapse All" buttons
- Keyboard shortcuts (e.g., Space to toggle)
- Animation for smooth expand/collapse
- Show item count badge on collapsed view
