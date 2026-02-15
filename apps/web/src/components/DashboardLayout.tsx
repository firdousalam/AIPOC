'use client';

import { useEffect } from 'react';
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

    useEffect(() => {
        if (!loading && !isAuthenticated && pathname?.startsWith('/dashboard')) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router, pathname]);

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
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {getPageTitle(pathname)}
                        </h2>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">{children}</div>
                </main>
            </div>
        </div>
    );
}

function getPageTitle(pathname: string | null): string {
    if (!pathname) return 'Dashboard';

    const titles: Record<string, string> = {
        '/dashboard': 'Dashboard Overview',
        '/dashboard/products': 'Products Management',
        '/dashboard/sales': 'Sales Tracking',
        '/dashboard/inventory': 'Inventory Management',
        '/dashboard/forecast': 'Sales Forecasting',
        '/dashboard/insights': 'AI Insights',
        '/dashboard/reports': 'Reports',
        '/dashboard/settings': 'Settings',
    };

    return titles[pathname] || 'Dashboard';
}
