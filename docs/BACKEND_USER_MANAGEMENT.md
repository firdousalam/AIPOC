# Backend User Management - Implementation Complete ✅

## Overview

The backend has been fully updated to support user management with role-based access control (RBAC).

## Changes Made

### 1. Updated User Schema
**File:** `apps/api/src/modules/users/users.schema.ts`

```typescript
@Prop({ required: true, enum: ['super', 'admin', 'user'], default: 'user' })
userType: string;
```

- Changed `role` to `userType`
- Added enum validation
- Default value: `'user'`

### 2. Updated DTOs

**CreateUserDto** (`apps/api/src/modules/users/dto/create-user.dto.ts`):
- Added `userType` field with enum validation

**UpdateUserDto** (`apps/api/src/modules/users/dto/update-user.dto.ts`) - NEW:
- All fields optional
- Supports partial updates
- Password hashing on update

**RegisterDto** (`apps/api/src/modules/auth/dto/register.dto.ts`):
- Added optional `userType` field

### 3. Created Super Admin Guard
**File:** `apps/api/src/common/guards/super-admin.guard.ts`

```typescript
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = request.user;
    return user && user.userType === 'super';
  }
}
```

- Checks if user has `userType === 'super'`
- Throws `ForbiddenException` if not authorized
- Used to protect user management endpoints

### 4. Updated Users Service
**File:** `apps/api/src/modules/users/users.service.ts`

**New Methods:**
- `update(id, updateUserDto)` - Update user with validation
- `remove(id)` - Delete user (prevents super admin deletion)

**Enhanced Methods:**
- `create()` - Now hashes password and checks for duplicates
- `findAll()` - Excludes password from results
- `findOne()` - Excludes password from results

**Features:**
- ✅ Password hashing on create/update
- ✅ Email uniqueness validation
- ✅ Prevent super admin deletion
- ✅ Password excluded from responses
- ✅ Error handling with proper exceptions

### 5. Updated Users Controller
**File:** `apps/api/src/modules/users/users.controller.ts`

**Protected with Guards:**
```typescript
@UseGuards(JwtAuthGuard, SuperAdminGuard)
```

**Endpoints:**
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**All endpoints:**
- ✅ Require authentication (JWT)
- ✅ Require super admin role
- ✅ Have Swagger documentation
- ✅ Return proper HTTP status codes
- ✅ Include error responses

### 6. Updated Auth Service
**File:** `apps/api/src/modules/auth/auth.service.ts`

**Login Response:**
```typescript
{
  access_token: string,
  user: {
    id: string,
    email: string,
    name: string,
    userType: string  // ← Added
  }
}
```

**JWT Payload:**
```typescript
{
  email: string,
  sub: string,
  userType: string  // ← Added
}
```

### 7. Updated JWT Strategy
**File:** `apps/api/src/modules/auth/strategies/jwt.strategy.ts`

**Validate Method:**
```typescript
async validate(payload: any) {
  return { 
    userId: payload.sub, 
    email: payload.email,
    userType: payload.userType  // ← Added
  };
}
```

- JWT token now includes `userType`
- Available in `request.user` for guards

### 8. Created Super Admin Seed Script
**File:** `apps/api/src/scripts/create-super-admin.ts`

**Creates initial super admin:**
- Email: `admin@example.com`
- Password: `Admin123!`
- User Type: `super`

**Run with:**
```bash
pnpm --filter api seed:super-admin
```

## API Endpoints

### User Management (Super Admin Only)

#### 1. List All Users
```http
GET /api/users
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "admin",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z"
  }
]
```

#### 2. Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "userType": "admin",
  "createdAt": "2026-02-15T00:00:00.000Z"
}
```

#### 3. Create User
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "userType": "admin"
}
```

**Response:**
```json
{
  "_id": "new_user_id",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "userType": "admin",
  "createdAt": "2026-02-15T00:00:00.000Z"
}
```

#### 4. Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "userType": "super",
  "password": "NewPassword123!"  // Optional
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "userType": "super",
  "updatedAt": "2026-02-15T00:00:00.000Z"
}
```

#### 5. Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Error (Super Admin):**
```json
{
  "statusCode": 400,
  "message": "Cannot delete super admin users"
}
```

### Authentication

#### Login (Updated)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Super Admin",
    "userType": "super"  // ← Now included
  }
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd apps/api
pnpm install
```

### 2. Start MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Create Super Admin
```bash
pnpm --filter api seed:super-admin
```

**Output:**
```
✅ Super admin created successfully!
Email: admin@example.com
Password: Admin123!
User Type: super

⚠️  Please change the password after first login!
```

### 4. Start Backend
```bash
pnpm --filter api start:dev
```

### 5. Test API
```bash
# Login as super admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'

# Get token from response, then list users
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Features

### 1. Password Security
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Passwords never returned in API responses
- ✅ Password validation (minimum 6 characters)

### 2. Authorization
- ✅ JWT authentication required for all user endpoints
- ✅ Super admin role required for user management
- ✅ Cannot delete super admin users
- ✅ Email uniqueness enforced

### 3. Validation
- ✅ Email format validation
- ✅ User type enum validation
- ✅ Required fields validation
- ✅ Duplicate email prevention

### 4. Error Handling
- ✅ Proper HTTP status codes
- ✅ Descriptive error messages
- ✅ Not Found exceptions
- ✅ Bad Request exceptions
- ✅ Forbidden exceptions

## Testing

### Test Super Admin Access

```bash
# 1. Login as super admin
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | jq -r '.access_token')

# 2. List users
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer $TOKEN"

# 3. Create user
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "userType": "admin"
  }'

# 4. Update user
curl -X PUT http://localhost:3001/api/users/USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "userType": "user"
  }'

# 5. Delete user
curl -X DELETE http://localhost:3001/api/users/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Test Regular Admin (Should Fail)

```bash
# 1. Create regular admin user first (as super admin)
# 2. Login as regular admin
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.user@example.com","password":"Admin123!"}' \
  | jq -r '.access_token')

# 3. Try to list users (should fail with 403)
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "statusCode": 403,
  "message": "Only super admins can access this resource"
}
```

## Database Migration

If you have existing users without `userType`:

```javascript
// Run in MongoDB shell
db.users.updateMany(
  { userType: { $exists: false } },
  { $set: { userType: 'user' } }
);

// Make first user super admin
db.users.updateOne(
  { email: 'admin@example.com' },
  { $set: { userType: 'super' } }
);
```

## Swagger Documentation

Access API documentation at:
```
http://localhost:3001/api/docs
```

All user management endpoints are documented with:
- Request/response schemas
- Authentication requirements
- Error responses
- Example payloads

## Files Created/Modified

### Created (2 files):
1. `apps/api/src/modules/users/dto/update-user.dto.ts`
2. `apps/api/src/common/guards/super-admin.guard.ts`
3. `apps/api/src/scripts/create-super-admin.ts`

### Modified (7 files):
1. `apps/api/src/modules/users/users.schema.ts`
2. `apps/api/src/modules/users/dto/create-user.dto.ts`
3. `apps/api/src/modules/users/users.service.ts`
4. `apps/api/src/modules/users/users.controller.ts`
5. `apps/api/src/modules/auth/auth.service.ts`
6. `apps/api/src/modules/auth/strategies/jwt.strategy.ts`
7. `apps/api/src/modules/auth/dto/register.dto.ts`
8. `apps/api/package.json`

## Summary

✅ **User Schema Updated** - Added `userType` field
✅ **DTOs Created/Updated** - Create, Update, Register
✅ **Super Admin Guard** - Role-based access control
✅ **Users Service** - Full CRUD with validation
✅ **Users Controller** - Protected endpoints
✅ **Auth Service** - Returns `userType` in login
✅ **JWT Strategy** - Includes `userType` in payload
✅ **Seed Script** - Create initial super admin
✅ **API Documentation** - Swagger updated
✅ **Security** - Password hashing, validation, authorization

**Status:** Backend Complete - Ready for Integration ✅

---

**Created:** February 15, 2026
**Version:** 1.0.0
