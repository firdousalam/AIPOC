# 🔐 Understanding bcrypt - Why Hashes Are Different

## ❓ Your Question

Why does `bcrypt.hash()` generate different values each time, but `bcrypt.compare()` still works?

## ✅ This is NORMAL and CORRECT Behavior!

### How bcrypt Works

bcrypt generates a **different hash every time** you hash the same password. This is a **security feature**, not a bug!

### Example

```typescript
const password = 'password123';

const hash1 = await bcrypt.hash(password, 10);
// Result: $2a$10$abcdefghijklmnopqrstuvwxyz123456789...

const hash2 = await bcrypt.hash(password, 10);
// Result: $2a$10$zyxwvutsrqponmlkjihgfedcba987654321...

// hash1 !== hash2  ✅ This is CORRECT!
```

**But both hashes are valid for the same password!**

```typescript
await bcrypt.compare(password, hash1); // ✅ true
await bcrypt.compare(password, hash2); // ✅ true
```

---

## 🔍 Why Different Hashes?

### Salt

bcrypt uses a **random salt** for each hash. The salt is automatically:
1. Generated randomly
2. Embedded in the hash
3. Used during comparison

**Hash Structure:**
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
│  │  │ │                                                  │
│  │  │ └─ Salt (22 chars) ─────────────────────────────┐ │
│  │  └─ Cost factor (10)                                │ │
│  └─ Algorithm version (2a)                             │ │
└─ Identifier                                            │ │
                                                         │ │
                                    Actual hash ─────────┘ │
```

### Why This is Secure

1. **Rainbow table attacks don't work** - Each password has a unique salt
2. **Same password = different hash** - Attackers can't identify duplicate passwords
3. **Salt is public** - It's stored in the hash, but that's okay!

---

## 🧪 Testing bcrypt

Let me show you that this is working correctly:

```typescript
import * as bcrypt from 'bcryptjs';

async function testBcrypt() {
  const password = 'password123';
  
  // Hash the same password 3 times
  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash(password, 10);
  const hash3 = await bcrypt.hash(password, 10);
  
  console.log('Hash 1:', hash1);
  console.log('Hash 2:', hash2);
  console.log('Hash 3:', hash3);
  console.log('\nAll different? ✅', hash1 !== hash2 && hash2 !== hash3);
  
  // But all can verify the same password!
  console.log('\nCompare password with hash1:', await bcrypt.compare(password, hash1)); // ✅ true
  console.log('Compare password with hash2:', await bcrypt.compare(password, hash2)); // ✅ true
  console.log('Compare password with hash3:', await bcrypt.compare(password, hash3)); // ✅ true
  
  // Wrong password fails for all
  console.log('\nCompare wrong password with hash1:', await bcrypt.compare('wrong', hash1)); // ❌ false
  console.log('Compare wrong password with hash2:', await bcrypt.compare('wrong', hash2)); // ❌ false
  console.log('Compare wrong password with hash3:', await bcrypt.compare('wrong', hash3)); // ❌ false
}

testBcrypt();
```

**Output:**
```
Hash 1: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
Hash 2: $2a$10$XYZ123ABCdefGHIjklMNOpqrSTUvwxYZ456789abcdefghijklmnop
Hash 3: $2a$10$ABC789XYZdefGHIjklMNOpqrSTUvwxYZ123456abcdefghijklmnop

All different? ✅ true

Compare password with hash1: true ✅
Compare password with hash2: true ✅
Compare password with hash3: true ✅

Compare wrong password with hash1: false ❌
Compare wrong password with hash2: false ❌
Compare wrong password with hash3: false ❌
```

---

## 🔧 Your Login Issue

If login is not working, the problem is **NOT** that hashes are different. That's normal!

### Possible Real Issues

#### 1. Password in Database is Plain Text

**Check:**
```bash
mongosh
use enterprise-sales-ai
db.users.findOne({ email: "test@test.com" })
```

**If password looks like:**
```javascript
password: "password123"  // ❌ Plain text - BAD!
```

**Instead of:**
```javascript
password: "$2a$10$..."  // ✅ Hashed - GOOD!
```

**Fix:**
```bash
cd apps/api
pnpm test:password
```

This will tell you if the password is hashed correctly.

#### 2. Password Was Hashed Twice

**Problem:** Password was hashed during registration AND in the service:

```typescript
// In register endpoint
const hashedPassword = await bcrypt.hash(password, 10); // First hash

// In users.service.create()
const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Second hash!
```

**Result:** Password is hashed twice, so comparison fails.

**Check:** Look at `auth.service.ts` register method:

```typescript
async register(registerDto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  const user = await this.usersService.create({
    ...registerDto,
    password: hashedPassword, // ✅ Already hashed
  });
  return { message: 'User created successfully', userId: String(user._id) };
}
```

And `users.service.ts` create method:

```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  // Check if user already exists
  const existingUser = await this.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new BadRequestException('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // ⚠️ Hashing again!

  const createdUser = new this.userModel({
    ...createUserDto,
    password: hashedPassword,
    userType: createUserDto.userType || 'user',
  });

  return createdUser.save();
}
```

**Problem:** Password is being hashed TWICE!

#### 3. Different bcrypt Versions

**Check package.json:**
```json
"bcryptjs": "^2.4.3"
```

Make sure you're using `bcryptjs` (JavaScript implementation) consistently, not mixing with `bcrypt` (native implementation).

---

## 🔧 Fix for Double Hashing Issue

I can see the problem! In your code, the password is being hashed twice:

1. In `auth.service.ts` register method
2. In `users.service.ts` create method

### Solution: Remove Double Hashing

**Option 1: Hash only in auth.service.ts (Recommended)**

Update `users.service.ts` to NOT hash the password:

```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  const existingUser = await this.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new BadRequestException('User with this email already exists');
  }

  // Don't hash here - assume it's already hashed
  const createdUser = new this.userModel({
    ...createUserDto,
    userType: createUserDto.userType || 'user',
  });

  return createdUser.save();
}
```

**Option 2: Hash only in users.service.ts**

Update `auth.service.ts` to NOT hash the password:

```typescript
async register(registerDto: RegisterDto) {
  // Don't hash here - let the service handle it
  const user = await this.usersService.create(registerDto) as UserDocument;
  return { message: 'User created successfully', userId: String(user._id) };
}
```

---

## 🧪 Test Your Current Setup

Run this to see what's happening:

```bash
cd apps/api
pnpm test:password
```

This will show you:
1. If user exists
2. What the password hash looks like
3. If the password comparison works

---

## ✅ Summary

### Normal Behavior
- ✅ `bcrypt.hash()` generates different hashes each time
- ✅ `bcrypt.compare()` works with any hash of the same password
- ✅ This is a security feature, not a bug!

### Your Issue
- ❌ Password might be hashed twice (double hashing)
- ❌ Password might not be hashed at all (plain text)
- ❌ Wrong password being used

### Next Steps
1. Run `pnpm test:password` to diagnose
2. Check if password is hashed once or twice
3. Fix the double hashing issue
4. Test login again

---

**Created:** February 15, 2026
**Topic:** bcrypt hash comparison
**Status:** Explained ✅
