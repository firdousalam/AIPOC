'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Products', href: '/dashboard/products', icon: '📦' },
    { name: 'Sales', href: '/dashboard/sales', icon: '💰' },
    { name: 'Inventory', href: '/dashboard/inventory', icon: '📋' },
    { name: 'Forecast', href: '/dashboard/forecast', icon: '📈' },
    { name: 'AI Insights', href: '/dashboard/insights', icon: '🤖' },
    { name: 'Reports', href: '/dashboard/reports', icon: '📄' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 bg-gray-800">
                <h1 className="text-white text-xl font-bold">Sales AI</h1>
            </div>

            {/* User Info */}
            <div className="flex items-center px-4 py-4 bg-gray-800 border-b border-gray-700">
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-400">{user?.email || 'admin@example.com'}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }
              `}
                        >
                            <span className="mr-3 text-xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <span className="mr-3 text-xl">🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
}
