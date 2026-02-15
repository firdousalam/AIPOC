# Authentication & Dashboard Setup

## Overview

This Next.js application now includes a complete authentication system with JWT tokens and a dashboard with sidebar navigation.

## Features

✅ **JWT Authentication**
- Login with email/password
- Token stored in localStorage
- Automatic token refresh
- Protected routes

✅ **Dashboard Layout**
- Left sidebar navigation
- User profile display
- Responsive design
- Modern UI with Tailwind CSS

✅ **Modules**
- Dashboard Overview
- Products Management
- Sales Tracking
- Inventory Management
- Sales Forecasting
- AI Insights
- Reports
- Settings

## File Structure

```
apps/web/src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout wrapper
│   │   ├── page.tsx              # Dashboard home
│   │   ├── products/page.tsx     # Products module
│   │   ├── sales/page.tsx        # Sales module
│   │   ├── inventory/page.tsx    # Inventory module
│   │   ├── forecast/page.tsx     # Forecast module
│   │   ├── insights/page.tsx     # AI Insights module
│   │   ├── reports/page.tsx      # Reports module
│   │   └── settings/page.tsx     # Settings module
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (redirects to login/dashboard)
│   └── providers.tsx             # React Query + Auth providers
├── components/
│   ├── Sidebar.tsx               # Left sidebar navigation
│   └── DashboardLayout.tsx       # Dashboard layout component
├── contexts/
│   └── AuthContext.tsx           # Authentication context
└── services/
    └── api/
        └── client.ts             # Axios client with JWT interceptor

```

## Usage

### 1. Start the Application

```bash
# From project root
pnpm --filter web dev
```

The app will run on http://localhost:3000

### 2. Login

Navigate to http://localhost:3000 (will redirect to /login)

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `Admin123!`

### 3. Access Dashboard

After login, you'll be redirected to `/dashboard` with:
- Sidebar navigation
- Dashboard overview with stats
- Quick actions
- Recent activity

### 4. Navigate Modules

Click on any sidebar item to navigate:
- 📊 Dashboard - Overview and stats
- 📦 Products - Product management
- 💰 Sales - Sales tracking
- 📋 Inventory - Inventory management
- 📈 Forecast - ML forecasting
- 🤖 AI Insights - AI-powered insights
- 📄 Reports - Custom reports
- ⚙️ Settings - User settings

## Authentication Flow

### Login Process

1. User enters email/password
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend returns JWT token + user data
5. Frontend stores token in localStorage
6. Frontend redirects to `/dashboard`

### Protected Routes

All `/dashboard/*` routes are protected:
- Check if user is authenticated
- If not, redirect to `/login`
- If yes, render dashboard layout

### Token Management

```typescript
// Token is automatically added to all API requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic logout on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Logout

Click "Logout" in sidebar:
1. Removes token from localStorage
2. Clears user state
3. Redirects to `/login`

## API Integration

### Using the Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import apiClient from '@/services/api/client';

// Token is automatically included
const response = await apiClient.get('/api/products');
const products = response.data;
```

## Customization

### Adding New Modules

1. **Create page file:**
```bash
apps/web/src/app/dashboard/my-module/page.tsx
```

2. **Add to sidebar navigation:**
```typescript
// apps/web/src/components/Sidebar.tsx
const navigation = [
  // ... existing items
  { name: 'My Module', href: '/dashboard/my-module', icon: '🎯' },
];
```

3. **Update page title:**
```typescript
// apps/web/src/components/DashboardLayout.tsx
const titles: Record<string, string> = {
  // ... existing titles
  '/dashboard/my-module': 'My Module Title',
};
```

### Styling

The app uses Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo
        // Add your colors
      },
    },
  },
};
```

## Security Best Practices

✅ **Implemented:**
- JWT tokens for authentication
- HTTP-only cookies (can be enabled)
- Automatic token expiration
- Protected routes
- CORS configuration

⚠️ **Recommendations:**
- Use HTTPS in production
- Implement refresh tokens
- Add rate limiting
- Enable CSRF protection
- Use secure cookie flags

## Troubleshooting

### Issue: "Cannot find module '@/contexts/AuthContext'"

**Solution:** Ensure TypeScript paths are configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Login redirects to login page

**Solution:** Check:
1. Backend API is running on port 3001
2. CORS is configured correctly
3. JWT_SECRET is set in backend `.env`
4. User exists in database

### Issue: Token expired

**Solution:** Login again. Token expires after 7 days (configurable in backend).

## Next Steps

1. ✅ Authentication system complete
2. ✅ Dashboard layout complete
3. ✅ Basic modules created
4. 🔄 Implement full CRUD operations
5. 🔄 Add ML forecasting UI
6. 🔄 Add AI insights chat
7. 🔄 Add charts and visualizations
8. 🔄 Add form validation
9. 🔄 Add loading states
10. 🔄 Add error handling

## Support

For issues or questions, refer to:
- `USER_MANUAL.md` - Complete user guide
- `PROJECT_ARCHITECTURE.md` - Technical documentation
- API Docs: http://localhost:3001/api/docs
