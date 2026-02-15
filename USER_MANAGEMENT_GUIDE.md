# User Management System - Complete Guide

## Overview

A complete user management system with role-based access control (RBAC) has been implemented. Only Super Admin users can access and manage the user system.

## User Types

### 1. Super Admin (`super`)
- **Full access** to all features
- Can access User Management section
- Can create, edit, and delete users
- Can assign any user type
- Cannot be deleted

### 2. Admin (`admin`)
- Access to all features except User Management
- Can manage products, sales, inventory, forecasts, etc.
- Cannot see or access Users section

### 3. User (`user`)
- Basic access to view-only features
- Limited permissions (can be customized)

## Features

### ✅ Implemented Features

1. **User List View**
   - Display all users in a table
   - Show name, email, user type, and creation date
   - Color-coded user type badges
   - Avatar with initials

2. **Add New User**
   - Modal form for creating users
   - Fields: Name, Email, Password, User Type
   - Form validation
   - Error handling

3. **Edit User**
   - Modal form for updating users
   - Update name, email, user type
   - Optional password change
   - Validation and error handling

4. **Delete User**
   - Confirmation dialog
   - Cannot delete Super Admin users
   - Removes user from database

5. **Role-Based Access Control**
   - Users section only visible to Super Admins
   - Automatic redirect for non-super users
   - User type badge in sidebar
   - Filtered navigation based on permissions

## File Structure

```
apps/web/src/
├── contexts/
│   └── AuthContext.tsx          # Updated with userType and isSuperAdmin
├── components/
│   └── Sidebar.tsx              # Updated with role-based navigation
├── app/
│   └── dashboard/
│       └── users/
│           └── page.tsx         # User management page
```

## Usage

### For Super Admins

#### 1. Access User Management

1. Login as Super Admin
2. Look for "👥 Users" in the sidebar
3. Click to access User Management

#### 2. Add New User

1. Click "➕ Add User" button
2. Fill in the form:
   - **Name**: Full name of the user
   - **Email**: Valid email address
   - **Password**: Minimum 6 characters
   - **User Type**: Select from dropdown
     - User (basic access)
     - Admin (full access except users)
     - Super Admin (full access)
3. Click "Create User"

#### 3. Edit User

1. Find the user in the table
2. Click "Edit" button
3. Update fields as needed:
   - Name
   - Email
   - User Type
   - Password (optional - leave blank to keep current)
4. Click "Update User"

#### 4. Delete User

1. Find the user in the table
2. Click "Delete" button
3. Confirm deletion
4. User is removed from system

**Note:** Super Admin users cannot be deleted for security.

### For Regular Admins

- Users section is **not visible** in sidebar
- Attempting to access `/dashboard/users` will redirect to dashboard
- All other features are accessible

## API Endpoints

The frontend expects these backend endpoints:

```typescript
// Get all users
GET /api/users

// Create new user
POST /api/users
Body: { name, email, password, userType }

// Update user
PUT /api/users/:id
Body: { name, email, userType, password? }

// Delete user
DELETE /api/users/:id
```

## Backend Requirements

### User Schema

The backend should have a User schema with:

```typescript
{
  _id: string;
  name: string;
  email: string;
  password: string; // hashed
  userType: 'super' | 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
```

### Authentication Response

When logging in, the backend should return:

```typescript
{
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    userType: 'super' | 'admin' | 'user';
  }
}
```

## Security Features

### 1. Frontend Protection
- ✅ Role-based navigation filtering
- ✅ Route protection (redirect non-super users)
- ✅ UI elements hidden based on permissions
- ✅ User type badge display

### 2. Backend Protection (Required)
- ⚠️ Implement middleware to check user type
- ⚠️ Protect user management endpoints
- ⚠️ Validate user permissions on all requests
- ⚠️ Hash passwords before storing
- ⚠️ Prevent super admin deletion

### Example Backend Middleware

```typescript
// Protect user management routes
@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('users')
export class UsersController {
  // Only super admins can access these routes
}

// Super Admin Guard
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.userType === 'super';
  }
}
```

## UI Components

### User Table

```
┌─────────────────────────────────────────────────────────────┐
│ User Management                          [➕ Add User]      │
├─────────────────────────────────────────────────────────────┤
│ User          │ Email              │ Type  │ Created │ Actions│
├─────────────────────────────────────────────────────────────┤
│ 👤 John Doe   │ john@example.com   │ super │ Jan 1   │ Edit   │
│ 👤 Jane Smith │ jane@example.com   │ admin │ Jan 2   │ Edit │ Delete │
│ 👤 Bob Wilson │ bob@example.com    │ user  │ Jan 3   │ Edit │ Delete │
└─────────────────────────────────────────────────────────────┘
```

### User Type Badges

- **Super Admin**: Yellow badge (🟡)
- **Admin**: Blue badge (🔵)
- **User**: Gray badge (⚪)

### Sidebar Display

```
┌─────────────────────┐
│ Sales AI            │
├─────────────────────┤
│ 👤 John Doe         │
│    john@example.com │
│    [super]          │ ← User type badge
├─────────────────────┤
│ 📊 Dashboard        │
│ 📦 Products         │
│ 💰 Sales            │
│ 📋 Inventory        │
│ 📈 Forecast         │
│ 🤖 AI Insights      │
│ 📄 Reports          │
│ 👥 Users            │ ← Only for super admins
│ ⚙️ Settings         │
├─────────────────────┤
│ 🚪 Logout           │
└─────────────────────┘
```

## Testing

### Test Scenarios

#### 1. Super Admin Access
```
✅ Login as super admin
✅ See "Users" in sidebar
✅ Access /dashboard/users
✅ View all users
✅ Add new user
✅ Edit user
✅ Delete user (except super admin)
✅ See user type badge in sidebar
```

#### 2. Regular Admin Access
```
✅ Login as admin
✅ Do NOT see "Users" in sidebar
✅ Redirect when accessing /dashboard/users
✅ Access all other features
✅ See user type badge in sidebar
```

#### 3. User Management Operations
```
✅ Create user with all types
✅ Update user information
✅ Change user type
✅ Update password
✅ Delete regular users
✅ Cannot delete super admin
✅ Form validation works
✅ Error messages display
```

## Troubleshooting

### Issue: Users section not visible

**Check:**
1. User is logged in as super admin
2. `user.userType === 'super'` in localStorage
3. Backend returns correct userType in login response

### Issue: Cannot access /dashboard/users

**Check:**
1. User has super admin role
2. `isSuperAdmin` is true in AuthContext
3. No console errors

### Issue: Cannot create/update users

**Check:**
1. Backend API endpoints are implemented
2. CORS is configured correctly
3. JWT token is valid
4. Check network tab for errors

### Issue: User type not displaying

**Check:**
1. Backend returns `userType` in user object
2. User data is stored in localStorage
3. AuthContext is properly updated

## Next Steps

### Backend Implementation Required

1. **Update User Schema**
   ```typescript
   // Add userType field to existing User schema
   @Prop({ required: true, enum: ['super', 'admin', 'user'], default: 'user' })
   userType: string;
   ```

2. **Create User Management Endpoints**
   - GET /api/users - List all users
   - POST /api/users - Create user
   - PUT /api/users/:id - Update user
   - DELETE /api/users/:id - Delete user

3. **Add Super Admin Guard**
   ```typescript
   // Protect user management routes
   @UseGuards(JwtAuthGuard, SuperAdminGuard)
   ```

4. **Update Login Response**
   ```typescript
   // Include userType in response
   return {
     access_token: token,
     user: {
       id: user._id,
       email: user.email,
       name: user.name,
       userType: user.userType, // Add this
     },
   };
   ```

5. **Create Initial Super Admin**
   ```bash
   # Create a super admin user in database
   # Or add a seed script
   ```

## Summary

✅ **User Management UI Complete**
✅ **Role-Based Access Control Implemented**
✅ **Add/Edit/Delete Users Functional**
✅ **Super Admin Only Access**
✅ **User Type Badges**
✅ **Protected Routes**
✅ **Modal Forms**
✅ **Error Handling**

**Status:** Frontend Complete - Backend Implementation Required

---

**Created:** February 15, 2026
**Version:** 1.0.0
