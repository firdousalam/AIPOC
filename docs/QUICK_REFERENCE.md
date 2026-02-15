# 🚀 Quick Reference Card

## 📋 Essential Commands

### Start Services
```bash
# Backend (Terminal 1)
cd apps/api && pnpm start:dev

# Frontend (Terminal 2)
cd apps/web && pnpm dev

# ML Service (Terminal 3 - Optional)
cd apps/ml-service && uvicorn app.main:app --reload --port 8000
```

### Create Super Admin
```bash
cd apps/api && pnpm seed:super-admin
```

### Load Sample Data
```bash
python load_sample_data.py
```

---

## 🔐 Default Credentials

**Super Admin:**
- Email: `admin@example.com`
- Password: `Admin123!`

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **ML Service:** http://localhost:8000
- **API Docs:** http://localhost:3001/api

---

## 👥 User Types

| Type | Access | User Management | Can Be Deleted |
|------|--------|----------------|----------------|
| **super** | Full | ✅ Yes | ❌ No |
| **admin** | Full | ❌ No | ✅ Yes |
| **user** | Basic | ❌ No | ✅ Yes |

---

## 📊 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Users (Super Admin Only)
```
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Products
```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Sales
```
GET    /api/sales
POST   /api/sales
PUT    /api/sales/:id
DELETE /api/sales/:id
```

---

## 📁 Key Files

### Backend
```
apps/api/src/
├── app.module.ts                    # Main module
├── main.ts                          # Entry point
├── common/guards/
│   ├── jwt-auth.guard.ts           # JWT guard
│   └── super-admin.guard.ts        # Super admin guard
├── modules/
│   ├── auth/                       # Authentication
│   ├── users/                      # User management
│   ├── products/                   # Products
│   ├── sales/                      # Sales
│   ├── inventory/                  # Inventory
│   ├── forecast/                   # ML forecasting
│   └── insights/                   # AI insights
└── scripts/
    └── create-super-admin.ts       # Seed script
```

### Frontend
```
apps/web/src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── login/page.tsx              # Login page
│   └── dashboard/                  # Dashboard pages
├── components/
│   ├── Sidebar.tsx                 # Navigation
│   └── DashboardLayout.tsx         # Layout
├── contexts/
│   └── AuthContext.tsx             # Auth context
└── services/
    └── api/client.ts               # API client
```

---

## 🔧 Environment Variables

### Required
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

### Optional
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# ML/AI
AI_MODEL_URL=http://localhost:11434
AI_MODEL_NAME=llama2
```

---

## 🧪 Testing Checklist

### Super Admin
- [x] Login
- [x] See "Users" in sidebar
- [x] Access /dashboard/users
- [x] Add user
- [x] Edit user
- [x] Delete user
- [x] Cannot delete super admin

### Admin
- [x] Login
- [x] No "Users" in sidebar
- [x] Redirect from /dashboard/users
- [x] Access other features

### User
- [x] Login
- [x] No "Users" in sidebar
- [x] Limited access

---

## 🐛 Common Issues

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

### JWT Token Invalid
- Check JWT_SECRET in .env
- Clear browser localStorage
- Login again

### Users Section Not Visible
- Verify logged in as super admin
- Check userType in localStorage
- Check backend returns userType

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **QUICK_START.md** | 5-minute setup |
| **USER_MANAGEMENT_SETUP.md** | User management setup |
| **PROJECT_ARCHITECTURE.md** | Architecture guide |
| **USER_MANUAL.md** | Complete user manual |
| **IMPLEMENTATION_COMPLETE.md** | Implementation details |
| **CONTEXT_TRANSFER_SUMMARY.md** | Complete project status |
| **QUICK_REFERENCE.md** | This file |

---

## 🎯 Quick Actions

### Add New User
1. Login as super admin
2. Go to Users page
3. Click "Add User"
4. Fill form and submit

### Change User Type
1. Go to Users page
2. Click "Edit" on user
3. Change user type dropdown
4. Click "Update User"

### Delete User
1. Go to Users page
2. Click "Delete" on user
3. Confirm deletion
4. (Cannot delete super admins)

---

## 🔄 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

### Backend (Railway/Render)
```bash
# Push to GitHub
git push origin main

# Connect to Railway/Render
# Set environment variables
# Deploy
```

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=long-random-string-min-32-chars
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

---

## ✨ Features Summary

### Authentication
✅ JWT token authentication
✅ Protected routes
✅ Auto-redirect
✅ Password hashing

### User Management
✅ CRUD operations
✅ Role-based access
✅ Super admin guard
✅ Email validation

### Dashboard
✅ Modern UI
✅ Responsive design
✅ Role-based navigation
✅ 8 modules

### ML & AI
✅ Sales forecasting
✅ AI insights
✅ Data preprocessing
✅ Batch predictions

---

## 📞 Need Help?

1. Check documentation files
2. Check browser console
3. Check backend logs
4. Verify environment variables
5. Check MongoDB connection
6. Verify JWT token

---

## 🎉 Status

✅ All 8 tasks complete
✅ User management functional
✅ No TypeScript errors
✅ No linting issues
✅ Production ready

---

**Version:** 1.0.0
**Last Updated:** February 15, 2026
