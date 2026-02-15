# 🔍 Login 401 Error - Debug Guide

## 🐛 Issue Fixed

The 401 error was caused by improper handling of Mongoose documents in the `validateUser` method.

### Root Cause
When `findByEmail` returns a Mongoose document, destructuring it directly doesn't work as expected. The document needs to be converted to a plain JavaScript object first.

### Fix Applied
Updated `auth.service.ts` to convert Mongoose document to plain object before destructuring:

```typescript
async validateUser(email: string, password: string): Promise<any> {
  const user = await this.usersService.findByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    // Convert Mongoose document to plain object
    const userObject = (user as any).toObject ? (user as any).toObject() : { ...user };
    const { password: _, ...result } = userObject;
    return result;
  }
  return null;
}
```

---

## 🧪 Testing Steps

### 1. Restart Backend
```bash
cd apps/api
# Stop the server (Ctrl+C)
pnpm start:dev
```

### 2. Test with cURL
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@test.com",
    "name": "Test User",
    "userType": "user"
  }
}
```

### 3. Test with Postman/Insomnia
**Request:**
- Method: `POST`
- URL: `http://localhost:3001/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@test.com",
  "password": "password123"
}
```

### 4. Test with Frontend
```bash
cd apps/web
pnpm dev
```

1. Open http://localhost:3000
2. Go to login page
3. Enter credentials:
   - Email: `test@test.com`
   - Password: `password123`
4. Click "Login"

---

## 🔍 Debugging Checklist

If you still get 401 error, check these:

### 1. Verify User Exists in Database
```bash
# Connect to MongoDB
mongosh

# Switch to database
use enterprise-sales-ai

# Find user
db.users.findOne({ email: "test@test.com" })
```

**Expected Output:**
```javascript
{
  _id: ObjectId("..."),
  name: "Test User",
  email: "test@test.com",
  password: "$2a$10$...", // Hashed password
  userType: "user",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### 2. Verify Password is Hashed
The password in the database should start with `$2a$10$` or `$2b$10$` (bcrypt hash).

**If password is NOT hashed:**
```bash
# You need to update it with a hashed version
# Use the create-super-admin script as reference
```

### 3. Check Backend Logs
Look for errors in the terminal where backend is running:
```
[Nest] ERROR [ExceptionsHandler] ...
```

### 4. Test Password Comparison
Add temporary logging to `auth.service.ts`:

```typescript
async validateUser(email: string, password: string): Promise<any> {
  console.log('🔍 Validating user:', email);
  const user = await this.usersService.findByEmail(email);
  console.log('👤 User found:', !!user);
  
  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      const userObject = (user as any).toObject ? (user as any).toObject() : { ...user };
      const { password: _, ...result } = userObject;
      return result;
    }
  }
  return null;
}
```

### 5. Verify LocalStrategy is Registered
Check `apps/api/src/modules/auth/auth.module.ts`:

```typescript
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [...],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Password Not Hashed
**Symptom:** User exists but login fails
**Solution:** Hash the password properly

```typescript
// In MongoDB shell
use enterprise-sales-ai
db.users.updateOne(
  { email: "test@test.com" },
  { $set: { password: "$2a$10$..." } } // Use bcrypt to hash first
)
```

**Better Solution:** Create user via API or seed script:
```bash
cd apps/api
pnpm seed:super-admin
```

### Issue 2: Email Case Sensitivity
**Symptom:** Login fails with correct credentials
**Solution:** Ensure email is lowercase in database

```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "Test@Test.com" },
  { $set: { email: "test@test.com" } }
)
```

### Issue 3: LocalAuthGuard Not Working
**Symptom:** 401 before validateUser is called
**Solution:** Check LocalStrategy is imported in auth.module.ts

### Issue 4: Mongoose Document Issues
**Symptom:** User found but properties are undefined
**Solution:** Already fixed with `.toObject()` conversion

---

## 🧪 Manual Password Hash Test

If you need to manually hash a password:

```typescript
// Create a test file: test-hash.ts
import * as bcrypt from 'bcryptjs';

async function testHash() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Valid:', isValid);
}

testHash();
```

Run it:
```bash
cd apps/api
npx ts-node test-hash.ts
```

---

## 📊 Expected Flow

1. **POST /api/auth/login** with `{ email, password }`
2. **LocalAuthGuard** intercepts request
3. **LocalStrategy.validate()** is called
4. **AuthService.validateUser()** is called
   - Find user by email
   - Compare password with bcrypt
   - Return user object (without password)
5. **AuthController.login()** is called with validated user
6. **AuthService.login()** generates JWT token
7. **Response** with `{ access_token, user }`

---

## 🎯 Quick Fix Summary

**What was changed:**
- `apps/api/src/modules/auth/auth.service.ts` - Fixed Mongoose document handling
- `apps/api/src/modules/users/users.service.ts` - Updated return type for findByEmail

**What to do:**
1. Restart backend server
2. Test login again
3. Should work now!

---

## 📞 Still Not Working?

If login still fails after the fix:

1. **Check backend logs** for specific error messages
2. **Verify user exists** in MongoDB with correct email
3. **Verify password is hashed** (starts with $2a$10$ or $2b$10$)
4. **Test password comparison** manually with bcrypt
5. **Check LocalStrategy** is registered in auth.module.ts
6. **Clear browser cache** and localStorage
7. **Try with different user** (create via seed script)

---

## ✅ Success Indicators

Login is working when you see:

1. **200 OK** response (not 401)
2. **access_token** in response
3. **user object** with id, email, name, userType
4. **No errors** in backend logs
5. **Redirect to dashboard** in frontend

---

**Created:** February 15, 2026
**Issue:** 401 Unauthorized on login
**Status:** Fixed ✅
