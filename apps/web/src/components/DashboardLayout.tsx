'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated && pathname?.startsWith('/dashboard')) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router, pathname]);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
                {/* Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 py-4 flex items-center">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 truncate">
                            {getPageTitle(pathname)}
                        </h2>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
                </main>
            </div>
        </div>
    );
}

function getPageTitle(pathname: string | null): string {
    if (!pathname) return 'Dashboard';

    const titles: Record<string, string> = {
        '/dashboard': 'Dashboard Overview',
        '/dashboard/products': 'Products',
        '/dashboard/sales': 'Sales',
        '/dashboard/inventory': 'Inventory',
        '/dashboard/forecast': 'Forecast',
        '/dashboard/insights': 'AI Insights',
        '/dashboard/reports': 'Reports',
        '/dashboard/categories': 'Categories',
        '/dashboard/companies': 'Companies',
        '/dashboard/distributors': 'Distributors',
        '/dashboard/users': 'Users',
        '/dashboard/settings': 'Settings',
    };

    return titles[pathname] || 'Dashboard';
}
