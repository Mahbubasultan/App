# Community Savings App - Fintech Design System Guide

## Overview

Your Community Savings App has been redesigned with a modern fintech/dashboard style. This document outlines the design system, color palette, and components you should use across all pages.

## Color Palette

### Primary Colors
- **Sidebar**: `#14532D` (Dark Green) - Keep existing sidebar unchanged ✓
- **Primary Action**: `#16A34A` (Green) - Main buttons, accents, active states
- **Page Background**: `#F0FDF4` (Very Light Green) - All page backgrounds
- **White**: `#FFFFFF` - Cards, tables, modals, inputs

### Text Colors
- **Primary Text**: `#1F2937` (Dark Gray)
- **Secondary Text**: `#6B7280` (Medium Gray)
- **Light Text**: `#9CA3AF` (Light Gray)

### Status Colors
- **Success/Active**: Green `#16A34A`
- **Pending**: Yellow `#F59E0B`
- **Error/Rejected**: Red `#EF4444`
- **Warning/On Hold**: Orange `#F97316`
- **Info**: Blue `#3B82F6`

## Updated Components

### 1. DashboardCard (New Component)
Used for KPI cards on dashboards. Shows large numbers with icons and trend indicators.

```tsx
import { DashboardCard } from '@/components/ui/DashboardCard';

<DashboardCard
  title="Total Savings"
  value="250,000 RWF"
  subValue="125 shares"
  icon={Wallet}
  iconColor="green"
  trend={{ percentage: 12.5, isPositive: true, label: 'vs last month' }}
  onClick={() => router.push('/member/my-savings')}
/>
```

**Features:**
- White background with subtle shadow
- Large bold numbers
- Green icon in background
- Growth percentage indicator
- Clickable for navigation

### 2. Card Component (Updated)
Updated for fintech appearance with improved shadows and rounded corners.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>My Transactions</CardTitle>
    <CardDescription>View all your recent transactions</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

**Features:**
- Rounded corners (22-24px)
- Soft shadows
- White background
- Light gray borders

### 3. Button Component (Updated)
Updated colors to use the new primary green (#16A34A).

```tsx
import { Button } from '@/components/ui/Button';

// Primary button (green)
<Button variant="primary">Save Changes</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Outline button
<Button variant="outline">Learn More</Button>

// Danger button
<Button variant="danger">Delete</Button>
```

### 4. Badge Component (Updated)
Updated with new status variants for fintech style.

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="active">Active</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="completed">Completed</Badge>
```

### 5. Input Component (Updated)
Updated with green focus state and improved styling.

```tsx
import { Input, Select } from '@/components/ui/Input';

<Input
  label="Amount"
  placeholder="Enter amount"
  error={errors.amount}
  helperText="This is required"
/>

<Select
  label="Choose option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
/>
```

**Features:**
- White background
- Light gray borders
- Green focus state
- Rounded corners (22px)

### 6. Table Component (New)
Professional fintech table component for data display.

```tsx
import { Table } from '@/components/ui/Table';

<Table
  columns={[
    { key: 'name', label: 'Name', width: '30%' },
    { 
      key: 'amount', 
      label: 'Amount', 
      render: (value) => `${value.toLocaleString()} RWF`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <Badge variant={value.toLowerCase()}>{value}</Badge>
    },
  ]}
  data={data}
  onRowClick={(row) => console.log(row)}
/>
```

**Features:**
- Desktop table view with hover effects
- Mobile card view
- Responsive design
- Empty state handling
- Custom cell rendering

### 7. Chart Components (New)
Modern fintech charts using Recharts with professional styling.

```tsx
import { FinchartLine, FinchartBar } from '@/components/ui/Chart';

// Line chart with area fill
<FinchartLine
  data={data}
  dataKey="savings"
  title="Monthly Savings Growth"
  description="Trend over the last 6 months"
  color="#16A34A"
  showArea={true}
  height={300}
  xAxisKey="month"
/>

// Bar chart
<FinchartBar
  data={data}
  dataKey="members"
  title="Member Growth"
  color="#16A34A"
  height={300}
/>
```

**Features:**
- Green gradient area fills
- Smooth curved lines
- White chart container
- Rounded corners
- Soft shadows
- Responsive sizing
- Custom tooltips

## Tailwind Configuration Updates

The following color classes are now available:

- `bg-background-light` - Very light green page background
- `text-text-primary` - Primary text color
- `text-text-secondary` - Secondary text color
- `bg-primary-600` - Primary action green
- `text-primary-600` - Primary text green
- `shadow-card` - Card shadow (soft shadow)
- `shadow-medium` - Medium shadow
- `shadow-soft` - Soft shadow

## Usage Examples by Page Type

### Dashboard Pages
1. Add header with title and description
2. Use DashboardCard grid (4 columns on desktop, responsive on mobile)
3. Add charts with FinchartLine or FinchartBar
4. Use Table component for data lists

Example structure:
```tsx
<div className="space-y-8">
  {/* Header */}
  <div>
    <h1 className="text-4xl font-bold text-text-primary">Dashboard Title</h1>
    <p className="text-text-secondary mt-2">Description</p>
  </div>

  {/* KPI Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {/* DashboardCard components */}
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* FinchartLine and FinchartBar */}
  </div>

  {/* Data Tables */}
  <Table {/* props */} />
</div>
```

### Form Pages
1. Use white Card containers
2. Use updated Input/Select components
3. Use green Button variants
4. Add helper text and error states

Example structure:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Create New Entry</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Input label="Name" placeholder="Enter name" />
      <Input label="Amount" placeholder="Enter amount" />
      <Button variant="primary">Submit</Button>
    </div>
  </CardContent>
</Card>
```

### List/Table Pages
1. Use Card container for search/filters
2. Use Table component for data display
3. Use Badge for statuses
4. Use Button for actions

## Pages to Update

All pages should follow this fintech design system:

**Member Pages:**
- ✓ Dashboard (Updated)
- My Savings
- Shares
- Loans
- Notifications
- Payment

**Accountant Pages:**
- Dashboard
- Shares
- Savings
- Loans
- Guarantors
- Verify

**Admin Pages:**
- ✓ Dashboard (Updated)
- Members
- Groups
- Savings
- Deposits
- Withdrawals
- Transactions
- Reports
- Settings
- Accountants
- Users
- Announcements

## Implementation Checklist

When updating each page:
- [ ] Update page background to use `bg-background-light`
- [ ] Update text colors to use `text-text-primary` and `text-text-secondary`
- [ ] Replace old cards with new Card component
- [ ] Use DashboardCard for KPI cards
- [ ] Use FinchartLine/FinchartBar for charts
- [ ] Use Table component for data lists
- [ ] Update buttons to use primary-600 color
- [ ] Update badges to use new variants
- [ ] Update modals to use white background with shadow-card
- [ ] Ensure hover states use primary-700
- [ ] Add soft shadows with shadow-card or shadow-soft
- [ ] Use rounded-2xl or rounded-3xl for borders
- [ ] Test responsive design on mobile

## Notes

- The sidebar navigation (#14532D) remains unchanged ✓
- All pages now use the light green background (#F0FDF4)
- Primary action color is now #16A34A (vibrant green)
- Spacing is more generous for a modern, spacious feel
- All components use Tailwind CSS classes

## Support

For questions about the design system or implementation:
1. Review this guide
2. Check existing updated pages (Member Dashboard, Admin Dashboard)
3. Look at component examples in `/src/components/ui/`
