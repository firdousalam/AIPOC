# 🔧 Double Hashing Issue - FIXED

## 🐛 The Problem

Your password was being hashed **TWICE**, which is why login was failing!

### What Was Happening

**During Registration:**
1. `auth.service.ts` hashed the password: `bcrypt.hash(password, 10)` → Hash1
2. `users.service.ts` hashed it AGAIN: `bcrypt.hash(Hash1, 10)` → Hash2
3. Database stored: Hash2 (double-hashed)

**During Login:**
1. User enters plain password: `password123`
2. `bcrypt.compare(password123, Hash2)` → ❌ FALSE
3. Because Hash2 is a hash of Hash1, not password123!

### Visual Example

```
Registration Flow (BEFORE FIX):
password123 
  → bcrypt.hash() in auth.service 
  → $2a$10$abc... (Hash1)
  → bcrypt.hash() in users.service 
  → $2a$10$xyz... (Hash2) 
  → Stored in DB

Login Flow:
password123 
  → bcrypt.compare(password123, Hash2) 
  → ❌ FALSE (because Hash2 is hash of Hash1, not password123)
```

---

## ✅ The Fix

Removed the double hashing by only hashing once in `users.service.ts`.

### Changes Made

#### 1. `apps/api/src/modules/auth/auth.service.ts`

**BEFORE:**
```typescript
async register(registerDto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(registerDto.password, 10); // ❌ First hash
  const user = await this.usersService.create({
    ...registerDto,
    password: hashedPassword, // Passing Hash1
  }) as UserDocument;
  return { message: 'User created successfully', userId: String(user._id) };
}
```

**AFTER:**
```typescript
async register(registerDto: RegisterDto) {
  // Don't hash here - let users.service handle it
  const user = await this.usersService.create(registerDto) as UserDocument;
  return { message: 'User created successfully', userId: String(user._id) };
}
```

#### 2. `apps/api/src/modules/auth/auth.service.ts` - Removed Debug Logs

**BEFORE:**
```typescript
async validateUser(email: string, password: string): Promise<any> {
  const user = await this.usersService.findByEmail(email);
  console.log(user);
  console.log("db password", user.password);
  console.log("password", password);
  console.log("bcrypt password ", await bcrypt.hash(password, 10)); // ❌ Wrong!
  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("password match");
    const userObject = (user as any).toObject ? (user as any).toObject() : { ...user };
    const { password: _, ...result } = userObject;
    console.log("result", result);
    return result;
  }
  return null;
}
```

**AFTER:**
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

**Note:** The line `await bcrypt.hash(password, 10)` in your debug log was creating a NEW hash each time, which is why it looked different. That's not how you verify passwords - you use `bcrypt.compare()` instead!

#### 3. `apps/api/src/modules/users/users.service.ts` - NO CHANGES

This file still hashes the password (which is correct):

```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  const existingUser = await this.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new BadRequestException('User with this email already exists');
  }

  // Hash password (ONLY ONCE)
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  const createdUser = new this.userModel({
    ...createUserDto,
    password: hashedPassword,
    userType: createUserDto.userType || 'user',
  });

  return createdUser.save();
}
```

---

## 🔄 New Flow (AFTER FIX)

```
Registration Flow:
password123 
  → users.service.create()
  → bcrypt.hash() ONCE
  → $2a$10$abc... (Hash1)
  → Stored in DB

Login Flow:
password123 
  → bcrypt.compare(password123, Hash1) 
  → ✅ TRUE (correct!)
```

---

## ⚠️ Important: Existing Users

**If you already created users with the old code, they have double-hashed passwords!**

### Option 1: Delete and Recreate Users

```bash
# Connect to MongoDB
mongosh
use enterprise-sales-ai

# Delete all users
db.users.deleteMany({})

# Create super admin
cd apps/api
pnpm seed:super-admin
```

### Option 2: Update Existing User Passwords

```bash
# Connect to MongoDB
mongosh
use enterprise-sales-ai

# List all users
db.users.find({}, { email: 1, name: 1 })

# For each user, you need to reset their password
# (They'll need to register again or you manually set a new password)
```

### Option 3: Manual Password Reset

```bash
cd apps/api
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password123', 10).then(h => console.log(h));"
```

Copy the hash, then in MongoDB:
```javascript
db.users.updateOne(
  { email: "test@test.com" },
  { $set: { password: "PASTE_HASH_HERE" } }
)
```

---

## 🧪 Testing

### 1. Restart Backend
```bash
cd apps/api
# Stop server (Ctrl+C)
pnpm start:dev
```

### 2. Create New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@test.com",
    "password": "password123"
  }'
```

### 3. Login with New User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "newuser@test.com",
    "name": "New User",
    "userType": "user"
  }
}
```

### 4. Test Password Verification
```bash
cd apps/api
pnpm test:password
```

---

## 📊 Understanding bcrypt.compare() vs bcrypt.hash()

### ❌ WRONG Way to Check Password

```typescript
// DON'T DO THIS!
const inputPassword = "password123";
const dbPassword = "$2a$10$abc...";

const newHash = await bcrypt.hash(inputPassword, 10);
if (newHash === dbPassword) { // ❌ Always false!
  // This will NEVER work because bcrypt generates different hashes each time
}
```

### ✅ CORRECT Way to Check Password

```typescript
// DO THIS!
const inputPassword = "password123";
const dbPassword = "$2a$10$abc...";

const isValid = await bcrypt.compare(inputPassword, dbPassword);
if (isValid) { // ✅ Works correctly!
  // Password is correct
}
```

### Why?

- `bcrypt.hash()` generates a **NEW** hash with a **NEW** salt each time
- `bcrypt.compare()` extracts the salt from the stored hash and uses it to verify
- This is why hashes are different but comparison still works!

---

## 🎯 Summary

### What Was Wrong
- ❌ Password hashed twice (double hashing)
- ❌ Debug logs showing new hashes (confusing)
- ❌ Existing users have double-hashed passwords

### What Was Fixed
- ✅ Removed first hash in auth.service.ts
- ✅ Removed confusing debug logs
- ✅ Now hashes only once in users.service.ts

### What You Need to Do
1. ✅ Restart backend server
2. ✅ Delete old users OR reset their passwords
3. ✅ Create new users (will work correctly)
4. ✅ Test login (should work now!)

---

## 🔍 Verification Checklist

- [ ] Backend restarted
- [ ] Old users deleted or passwords reset
- [ ] New user created via register endpoint
- [ ] Login works with new user
- [ ] `pnpm test:password` shows password is valid
- [ ] No 401 errors

---

## 📞 Still Having Issues?

If login still doesn't work:

1. **Check if user was created BEFORE or AFTER the fix**
   - Users created BEFORE have double-hashed passwords
   - Users created AFTER will work correctly

2. **Delete all users and start fresh**
   ```bash
   mongosh
   use enterprise-sales-ai
   db.users.deleteMany({})
   ```

3. **Create super admin**
   ```bash
   cd apps/api
   pnpm seed:super-admin
   ```

4. **Test login**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"Admin123!"}'
   ```

---

**Created:** February 15, 2026
**Issue:** Double hashing causing login failure
**Status:** Fixed ✅
**Action Required:** Delete old users or reset passwords
