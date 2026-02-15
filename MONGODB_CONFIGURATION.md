# 🔐 MongoDB Configuration Guide

## ✅ Security Update Complete

All hardcoded MongoDB credentials have been removed from the codebase.

---

## 📁 Files Updated

### 1. `.env`
**Before:**
```env
MONGODB_URI=mongodb+srv://TechnophileFirdous:Zuni2058Feb@cluster0.hwth0kg.mongodb.net/?appName=Cluster0/enterprise-sales-ai
```

**After:**
```env
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai
```

### 2. `apps/api/src/app.module.ts`
**Before:**
```typescript
MongooseModule.forRoot(
  process.env.MONGODB_URI || 'mongodb+srv://TechnophileFirdous:Zuni2058Feb@cluster0.hwth0kg.mongodb.net/?appName=Cluster0/enterprise-sales-ai',
),
```

**After:**
```typescript
MongooseModule.forRoot(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-sales-ai',
),
```

---

## 🔧 Configuration Options

### Option 1: Local MongoDB (Development)

**In `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai
```

**Requirements:**
- MongoDB installed locally
- MongoDB service running

**Start MongoDB:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Production)

**In `.env`:**
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Steps to Get Connection String:**

1. **Login to MongoDB Atlas**
   - Go to https://cloud.mongodb.com/

2. **Select Your Cluster**
   - Click "Connect" on your cluster

3. **Choose Connection Method**
   - Select "Connect your application"

4. **Copy Connection String**
   - Select "Node.js" driver
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<database>` with your database name

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/enterprise-sales-ai?retryWrites=true&w=majority
```

### Option 3: Docker MongoDB

**In `.env`:**
```env
MONGODB_URI=mongodb://mongodb:27017/enterprise-sales-ai
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## 🔐 Security Best Practices

### 1. Never Commit Credentials

**Add to `.gitignore`:**
```
.env
.env.local
.env.production
```

### 2. Use Environment Variables

**Always use:**
```typescript
process.env.MONGODB_URI
```

**Never hardcode:**
```typescript
'mongodb+srv://user:pass@...' // ❌ DON'T DO THIS
```

### 3. Different Credentials per Environment

**Development (`.env`):**
```env
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai-dev
```

**Production (Server Environment Variables):**
```env
MONGODB_URI=mongodb+srv://prod_user:secure_pass@cluster.mongodb.net/enterprise-sales-ai-prod
```

### 4. Use Strong Passwords

**Bad:**
```
password123
admin
mypassword
```

**Good:**
```
K9$mP2#vL8@qR5!nX7
aB3$dE6&fG9*hI2@jK5
```

### 5. Restrict IP Access (MongoDB Atlas)

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access"
3. Add your server's IP address
4. Don't use `0.0.0.0/0` (allows all IPs) in production

### 6. Use Database Users with Limited Permissions

**Create a user for your app:**
```javascript
// In MongoDB shell
use admin
db.createUser({
  user: "app_user",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "enterprise-sales-ai" }
  ]
})
```

**Connection string:**
```env
MONGODB_URI=mongodb://app_user:secure_password@localhost:27017/enterprise-sales-ai
```

---

## 🧪 Testing Connection

### Test Local Connection

```bash
# Connect with mongosh
mongosh mongodb://localhost:27017/enterprise-sales-ai

# Or test from your app
cd apps/api
pnpm start:dev
```

**Look for:**
```
[Nest] INFO [MongooseModule] Mongoose connected to mongodb://localhost:27017/enterprise-sales-ai
```

### Test Atlas Connection

```bash
# Test with mongosh
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/enterprise-sales-ai" --username YOUR_USERNAME

# Or test from your app
cd apps/api
pnpm start:dev
```

---

## 🔄 Migration Guide

### If You Were Using Atlas Before

**1. Update Your `.env` File:**
```env
# Replace with your actual Atlas connection string
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/enterprise-sales-ai?retryWrites=true&w=majority
```

**2. Restart Backend:**
```bash
cd apps/api
pnpm start:dev
```

**3. Verify Connection:**
Check backend logs for successful connection message.

### If You Want to Use Local MongoDB

**1. Install MongoDB:**
- **Windows:** https://www.mongodb.com/try/download/community
- **Mac:** `brew install mongodb-community`
- **Linux:** `sudo apt-get install mongodb`

**2. Start MongoDB Service:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**3. Update `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai
```

**4. Restart Backend:**
```bash
cd apps/api
pnpm start:dev
```

---

## 🚀 Deployment Configuration

### Vercel (Frontend)

No MongoDB configuration needed for frontend.

### Railway (Backend)

**1. Add Environment Variable:**
- Go to Railway dashboard
- Select your project
- Go to "Variables" tab
- Add: `MONGODB_URI` = `your_connection_string`

### Render (Backend)

**1. Add Environment Variable:**
- Go to Render dashboard
- Select your service
- Go to "Environment" tab
- Add: `MONGODB_URI` = `your_connection_string`

### Heroku (Backend)

**1. Add Config Var:**
```bash
heroku config:set MONGODB_URI="your_connection_string"
```

---

## 📊 Connection String Format

### Local MongoDB
```
mongodb://[username:password@]host[:port]/database
```

**Examples:**
```
mongodb://localhost:27017/mydb
mongodb://admin:password@localhost:27017/mydb
mongodb://192.168.1.100:27017/mydb
```

### MongoDB Atlas
```
mongodb+srv://[username:password@]host/database[?options]
```

**Examples:**
```
mongodb+srv://user:pass@cluster0.abc123.mongodb.net/mydb
mongodb+srv://user:pass@cluster0.abc123.mongodb.net/mydb?retryWrites=true&w=majority
```

### With Authentication Database
```
mongodb://user:pass@host:port/database?authSource=admin
```

---

## 🐛 Troubleshooting

### Error: "MongooseServerSelectionError"

**Cause:** Can't connect to MongoDB

**Solutions:**
1. Check MongoDB is running: `mongosh`
2. Check connection string is correct
3. Check firewall/network settings
4. Check IP whitelist (Atlas)

### Error: "Authentication failed"

**Cause:** Wrong username/password

**Solutions:**
1. Verify credentials in MongoDB
2. Check password special characters are URL-encoded
3. Verify user has correct permissions

### Error: "Connection string is invalid"

**Cause:** Malformed connection string

**Solutions:**
1. Check format matches examples above
2. URL-encode special characters in password
3. Remove extra spaces

### Special Characters in Password

If your password has special characters, URL-encode them:

```
@ → %40
: → %3A
/ → %2F
? → %3F
# → %23
[ → %5B
] → %5D
```

**Example:**
```
Password: P@ss:word/123
Encoded:  P%40ss%3Aword%2F123
```

---

## ✅ Verification Checklist

- [x] Removed hardcoded credentials from `.env`
- [x] Removed hardcoded credentials from `app.module.ts`
- [x] `.env` file is in `.gitignore`
- [x] Using `process.env.MONGODB_URI` in code
- [x] Connection string works locally
- [x] Backend starts without errors
- [x] Can create/read data from database

---

## 📚 Additional Resources

- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Mongoose Connection Options](https://mongoosejs.com/docs/connections.html)
- [Environment Variables Best Practices](https://12factor.net/config)

---

**Created:** February 15, 2026
**Issue:** Exposed MongoDB credentials
**Status:** Fixed ✅
**Security:** Improved ✅
