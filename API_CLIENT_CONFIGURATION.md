# 🔌 API Client Configuration

## ✅ Current Configuration

The API client is already properly configured to use the base URL from environment variables.

---

## 📁 File Structure

```
apps/web/
├── src/
│   └── services/
│       └── api/
│           └── client.ts          # API client configuration
└── .env.local                     # Local environment variables (create this)
```

---

## 🔧 API Client Configuration

### File: `apps/web/src/services/api/client.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

    if (error.response?.status === 401 && !isLoginRequest && !isLoginPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🌍 Environment Variables

### Root `.env` File

```env
# Frontend / API URLs (production: set to your Vercel and Render/Railway URLs)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### For Next.js Frontend

Create `apps/web/.env.local` (this file is gitignored):

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# ML Service URL
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

**Important:** 
- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- `.env.local` is gitignored by default
- Restart Next.js dev server after changing environment variables

---

## 📊 Usage in Components

### Current Usage (Correct ✅)

```typescript
// In apps/web/src/app/dashboard/products/page.tsx
import apiClient from '@/services/api/client';

// Fetch products - baseURL is automatically prepended
const response = await apiClient.get('/api/products');

// Create product
await apiClient.post('/api/products', productData);

// Update product
await apiClient.put(`/api/products/${id}`, productData);

// Delete product
await apiClient.delete(`/api/products/${id}`);
```

### How It Works

1. **Base URL from env:** `http://localhost:3001`
2. **Endpoint:** `/api/products`
3. **Full URL:** `http://localhost:3001/api/products`

The base URL is automatically prepended to all requests!

---

## 🔐 Authentication

### Automatic Token Injection

The API client automatically adds the JWT token to all requests:

```typescript
// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Result:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Automatic 401 Handling

The API client automatically handles unauthorized errors:

```typescript
// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoginRequest && !isLoginPage) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🌐 Environment-Specific Configuration

### Development (Local)

**File:** `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

### Staging

**File:** `apps/web/.env.staging`
```env
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com
NEXT_PUBLIC_ML_SERVICE_URL=https://ml-staging.yourdomain.com
```

### Production

**File:** `apps/web/.env.production`
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ML_SERVICE_URL=https://ml.yourdomain.com
```

**Or set in deployment platform:**
- Vercel: Environment Variables section
- Netlify: Environment Variables section
- Railway: Variables tab

---

## 🚀 Deployment Configuration

### Vercel

1. Go to Project Settings
2. Navigate to Environment Variables
3. Add variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-api.railway.app`
   - `NEXT_PUBLIC_ML_SERVICE_URL` = `https://your-ml.railway.app`

### Netlify

1. Go to Site Settings
2. Navigate to Build & Deploy > Environment
3. Add variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-api.railway.app`
   - `NEXT_PUBLIC_ML_SERVICE_URL` = `https://your-ml.railway.app`

### Railway (Frontend)

1. Go to your frontend service
2. Click on Variables tab
3. Add variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-api.railway.app`
   - `NEXT_PUBLIC_ML_SERVICE_URL` = `https://your-ml.railway.app`

---

## 🧪 Testing Different Environments

### Test Local API

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Test Staging API

```env
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com
```

### Test Production API

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Restart dev server after changing:**
```bash
cd apps/web
# Stop server (Ctrl+C)
pnpm dev
```

---

## 📝 API Client Features

### 1. Base URL Configuration
- ✅ Uses environment variable
- ✅ Fallback to localhost
- ✅ Automatically prepends to all requests

### 2. Authentication
- ✅ Automatic token injection
- ✅ Reads from localStorage
- ✅ Adds Bearer token to headers

### 3. Error Handling
- ✅ Automatic 401 handling
- ✅ Clears auth data on unauthorized
- ✅ Redirects to login page
- ✅ Skips redirect during login

### 4. Headers
- ✅ Content-Type: application/json
- ✅ Authorization: Bearer token

---

## 🔍 Debugging

### Check Current Base URL

Add this to any component:

```typescript
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
```

### Check Full Request URL

```typescript
apiClient.interceptors.request.use((config) => {
  console.log('Request URL:', config.baseURL + config.url);
  return config;
});
```

### Check Response

```typescript
try {
  const response = await apiClient.get('/api/products');
  console.log('Response:', response.data);
} catch (error) {
  console.error('Error:', error.response?.data);
}
```

---

## ⚠️ Common Issues

### Issue 1: Environment Variable Not Working

**Problem:** API calls go to wrong URL

**Solution:**
1. Ensure variable starts with `NEXT_PUBLIC_`
2. Restart Next.js dev server
3. Clear browser cache
4. Check `.env.local` file exists

### Issue 2: CORS Errors

**Problem:** Browser blocks requests

**Solution:**
Update backend CORS configuration:

```typescript
// In apps/api/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

### Issue 3: 401 Errors

**Problem:** Unauthorized errors

**Solution:**
1. Check token exists in localStorage
2. Verify token is valid
3. Check backend JWT_SECRET matches
4. Ensure token hasn't expired

---

## 📚 Best Practices

### 1. Use Environment Variables
```typescript
// ✅ GOOD
baseURL: process.env.NEXT_PUBLIC_API_URL

// ❌ BAD
baseURL: 'http://localhost:3001'
```

### 2. Use Relative Paths
```typescript
// ✅ GOOD
apiClient.get('/api/products')

// ❌ BAD
apiClient.get('http://localhost:3001/api/products')
```

### 3. Handle Errors
```typescript
// ✅ GOOD
try {
  const response = await apiClient.get('/api/products');
  return response.data;
} catch (error) {
  console.error('Error:', error);
  throw error;
}
```

### 4. Use TypeScript
```typescript
// ✅ GOOD
interface Product {
  _id: string;
  name: string;
  price: number;
}

const response = await apiClient.get<Product[]>('/api/products');
```

---

## ✅ Summary

**Current Configuration:**
- ✅ API client uses `process.env.NEXT_PUBLIC_API_URL`
- ✅ Base URL is `http://localhost:3001` (development)
- ✅ Automatic token injection
- ✅ Automatic 401 handling
- ✅ All API calls use relative paths

**No Changes Needed:**
The products page and all other components are already using the API client correctly with the base URL from environment variables!

**To Change API URL:**
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Restart Next.js dev server
3. All API calls will use the new URL automatically

---

**Created:** February 15, 2026
**Status:** Already Configured ✅
**Action Required:** None - Already using base URL from env
