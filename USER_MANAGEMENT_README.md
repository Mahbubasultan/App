# User Management System

A complete User Management dashboard with View, Edit, and Delete functionality built with React, TypeScript, and Tailwind CSS.

## Features

### ✅ View User Details
- Click the **eye icon (👁️)** to view full user details in a modal
- Displays profile picture/avatar with initials fallback
- Shows all user information: name, email, phone, role, status, address, bio
- Color-coded role and status badges
- Responsive modal design

### ✅ Edit User
- Click the **edit icon (✏️)** to edit user information
- Currently shows alert (ready for implementation)

### ✅ Delete User
- Click the **delete icon (🗑️)** to delete a user
- Shows confirmation dialog before deletion
- Prevents accidental deletions

## Components

### 1. UserTable Component
**Location:** `src/components/admin/UserTable.tsx`

Main component that displays the user table with all actions.

**Features:**
- Responsive table layout
- Avatar with initials fallback
- Role and status badges
- Action buttons (View, Edit, Delete)
- Empty state handling
- Loading state

### 2. UserViewModal Component
**Location:** `src/components/admin/UserViewModal.tsx`

Modal for viewing complete user details.

**Features:**
- Full user profile display
- Profile picture with online status indicator
- Organized information grid
- Icons for each field
- Responsive design
- Click outside to close

### 3. DeleteConfirmDialog Component
**Location:** `src/components/admin/DeleteConfirmDialog.tsx`

Confirmation dialog for user deletion.

**Features:**
- Warning icon
- User name display
- Confirm/Cancel actions
- Prevents accidental deletions

### 4. User Types
**Location:** `src/types/user.ts`

TypeScript interfaces for type safety.

## Usage

### Access the Page
Navigate to: `http://localhost:3000/admin/user-management`

### View User Details
```tsx
// Click the eye icon button
<button onClick={() => handleViewUser(user)}>
  {/* Eye icon */}
</button>
```

### Edit User
```tsx
// Click the edit icon button
<button onClick={() => handleEditUser(user)}>
  {/* Edit icon */}
</button>
```

### Delete User
```tsx
// Click the delete icon button
<button onClick={() => handleDeleteClick(user)}>
  {/* Delete icon */}
</button>
```

## State Management

```tsx
const [users, setUsers] = useState<User[]>([]);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [userToDelete, setUserToDelete] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(false);
```

## User Interface

### Role Badges
- **Admin**: Purple badge
- **Manager**: Blue badge
- **User**: Green badge
- **Viewer**: Gray badge

### Status Badges
- **Active**: Green badge
- **Inactive**: Gray badge
- **Suspended**: Red badge

## Customization

### Add More Fields
Edit `src/types/user.ts`:
```tsx
export interface User {
  // ... existing fields
  department?: string;
  salary?: number;
  // Add your custom fields
}
```

### Change Colors
Modify badge colors in `UserTable.tsx`:
```tsx
const getRoleBadgeColor = (role: string) => {
  const colors = {
    Admin: 'bg-purple-100 text-purple-800',
    // Add your custom colors
  };
  return colors[role as keyof typeof colors];
};
```

### Connect to API
Replace mock data with API calls:
```tsx
// In UserTable.tsx
useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  const response = await fetch('/api/users');
  const data = await response.json();
  setUsers(data);
};
```

## Mobile Responsive

All components are fully responsive:
- Table scrolls horizontally on mobile
- Modal adapts to screen size
- Touch-friendly button sizes
- Optimized spacing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- Next.js 15+

## Future Enhancements

- [ ] Implement Edit User functionality
- [ ] Add pagination
- [ ] Add search/filter
- [ ] Add sorting
- [ ] Add bulk actions
- [ ] Add export to CSV
- [ ] Add user creation form
- [ ] Add role-based permissions
- [ ] Add activity logs
- [ ] Add email notifications

## License

MIT
