'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊', requiresSuper: false },
    { name: 'Products', href: '/dashboard/products', icon: '📦', requiresSuper: false },
    { name: 'Sales', href: '/dashboard/sales', icon: '💰', requiresSuper: false },
    { name: 'Inventory', href: '/dashboard/inventory', icon: '📋', requiresSuper: false },
    { name: 'Forecast', href: '/dashboard/forecast', icon: '📈', requiresSuper: false },
    { name: 'AI Insights', href: '/dashboard/insights', icon: '🤖', requiresSuper: false },
    { name: 'Reports', href: '/dashboard/reports', icon: '📄', requiresSuper: false },
    { name: 'Categories', href: '/dashboard/categories', icon: '📁', requiresSuper: false },
    { name: 'Companies', href: '/dashboard/companies', icon: '🏢', requiresSuper: false },
    { name: 'Distributors', href: '/dashboard/distributors', icon: '🚚', requiresSuper: false },
    { name: 'Users', href: '/dashboard/users', icon: '👥', requiresSuper: true },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout, isSuperAdmin } = useAuth();

    // Filter navigation based on user type
    const filteredNavigation = navigation.filter(item =>
        !item.requiresSuper || isSuperAdmin
    );

    const handleLinkClick = () => {
        // Close sidebar on mobile when a link is clicked
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && onClose && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    flex flex-col w-64 bg-gray-900 min-h-screen
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 bg-gray-800 px-4">
                    <h1 className="text-white text-xl font-bold">Sales AI</h1>
                    {/* Close button for mobile */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* User Info */}
                <div className="flex items-center px-4 py-4 bg-gray-800 border-b border-gray-700">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@example.com'}</p>
                        {user?.userType && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${user.userType === 'super' ? 'bg-yellow-500 text-yellow-900' : 'bg-blue-500 text-blue-900'
                                }`}>
                                {user.userType}
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {filteredNavigation.map((item) => {
                        // For Dashboard, only match exact path
                        const isActive = item.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={handleLinkClick}
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
                        onClick={() => {
                            logout();
                            if (onClose) onClose();
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <span className="mr-3 text-xl">🚪</span>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
