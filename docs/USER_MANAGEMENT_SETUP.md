# User Management - Quick Setup Guide

## ✅ Complete Implementation

Both frontend and backend have been fully implemented for user management with role-based access control.

## 🚀 Quick Start

### 1. Start Backend

```bash
# Terminal 1: Start backend
pnpm --filter api start:dev
```

### 2. Create Super Admin

```bash
# Terminal 2: Create initial super admin
pnpm --filter api seed:super-admin
```

**Output:**
```
✅ Super admin created successfully!
Email: admin@example.com
Password: Admin123!
User Type: super
```

### 3. Start Frontend

```bash
# Terminal 3: Start frontend
pnpm --filter web dev
```

### 4. Login and Test

1. Open: http://localhost:3000
2. Login with:
   - Email: `admin@example.com`
   - Password: `Admin123!`
3. See "👥 Users" in sidebar
4. Click to access User Management
5. Add/Edit/Delete users

## 📋 Features

### User Types
- **Super Admin** (`super`) - Full access + user management
- **Admin** (`admin`) - Full access except user management
- **User** (`user`) - Basic access

### User Management (Super Admin Only)
- ✅ View all users
- ✅ Add new users
- ✅ Edit users
- ✅ Delete users (except super admins)
- ✅ Change user types
- ✅ Update passwords

### Security
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Password hashing (bcrypt)
- ✅ Super admin guard
- ✅ Protected routes
- ✅ Email uniqueness
- ✅ Cannot delete super admins

## 🔧 API Endpoints

All endpoints require super admin authentication:

```
GET    /api/users           # List all users
GET    /api/users/:id       # Get user by ID
POST   /api/users           # Create user
PUT    /api/users/:id       # Update user
DELETE /api/users/:id       # Delete user
```

## 📝 Testing Checklist

### Super Admin:
- [x] Login as super admin
- [x] See "Users" in sidebar
- [x] Access /dashboard/users
- [x] View all users
- [x] Add new user (all types)
- [x] Edit user
- [x] Change user type
- [x] Update password
- [x] Delete regular user
- [x] Cannot delete super admin

### Regular Admin:
- [x] Login as admin
- [x] Do NOT see "Users" in sidebar
- [x] Redirect from /dashboard/users
- [x] Access other features
- [x] See user type badge

## 🎯 Next Steps

### Create Additional Users

1. Login as super admin
2. Go to Users page
3. Click "Add User"
4. Create admin users:
   ```
   Name: John Doe
   Email: john@example.com
   Password: John123!
   User Type: admin
   ```
5. Create regular users:
   ```
   Name: Jane Smith
   Email: jane@example.com
   Password: Jane123!
   User Type: user
   ```

### Test Different User Types

1. Logout
2. Login as admin user
3. Verify "Users" section is hidden
4. Logout
5. Login as regular user
6. Verify limited access

## 📚 Documentation

- `USER_MANAGEMENT_GUIDE.md` - Complete frontend guide
- `BACKEND_USER_MANAGEMENT.md` - Complete backend guide
- `USER_MANAGEMENT_SUMMARY.md` - Quick reference

## 🐛 Troubleshooting

### Issue: Super admin not created

**Solution:**
```bash
# Run seed script again
pnpm --filter api seed:super-admin
```

### Issue: Users section not visible

**Check:**
1. Logged in as super admin
2. `userType === 'super'` in user object
3. Backend returns correct userType

### Issue: 403 Forbidden on user endpoints

**Check:**
1. User is super admin
2. JWT token is valid
3. Super admin guard is working

### Issue: Cannot create users

**Check:**
1. Backend is running
2. MongoDB is running
3. Check network tab for errors
4. Verify API endpoint

## 📊 Database Schema

```typescript
User {
  _id: ObjectId
  name: string
  email: string (unique)
  password: string (hashed)
  userType: 'super' | 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}
```

## 🔐 Default Credentials

**Super Admin:**
- Email: `admin@example.com`
- Password: `Admin123!`
- Type: `super`

⚠️ **Change password after first login!**

## ✨ Summary

✅ Frontend complete
✅ Backend complete
✅ Super admin guard implemented
✅ User CRUD operations working
✅ Role-based access control active
✅ Password hashing enabled
✅ API documentation updated
✅ Seed script created

**Status:** Fully Functional - Ready to Use! 🎉

---

**Created:** February 15, 2026
**Version:** 1.0.0
