'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import apiClient from '@/services/api/client';

interface Stats {
    totalSales: number;
    totalRevenue: number;
    totalProducts: number;
    lowStockItems: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats>({
        totalSales: 0,
        totalRevenue: 0,
        totalProducts: 0,
        lowStockItems: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch products
            const productsResponse = await apiClient.get('/api/products');
            const products = productsResponse.data;

            // Fetch sales
            const salesResponse = await apiClient.get('/api/sales');
            const sales = salesResponse.data;

            // Calculate stats
            const totalRevenue = sales.reduce(
                (sum: number, sale: any) => sum + (sale.totalAmount || 0),
                0
            );
            const lowStock = products.filter((p: any) => p.stock < 20).length;

            setStats({
                totalSales: sales.length,
                totalRevenue,
                totalProducts: products.length,
                lowStockItems: lowStock,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="mt-2 text-gray-600">
                    Here's what's happening with your business today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Sales"
                    value={stats.totalSales}
                    icon="💰"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon="📈"
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon="📦"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Low Stock Items"
                    value={stats.lowStockItems}
                    icon="⚠️"
                    color="bg-red-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <QuickActionCard
                    title="Add New Product"
                    description="Add a new product to your inventory"
                    icon="➕"
                    href="/dashboard/products"
                />
                <QuickActionCard
                    title="Record Sale"
                    description="Record a new sales transaction"
                    icon="💵"
                    href="/dashboard/sales"
                />
                <QuickActionCard
                    title="View Forecast"
                    description="See AI-powered sales predictions"
                    icon="🔮"
                    href="/dashboard/forecast"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    <ActivityItem
                        icon="📦"
                        title="New product added"
                        description="Dell XPS 15 Laptop"
                        time="2 hours ago"
                    />
                    <ActivityItem
                        icon="💰"
                        title="Sale recorded"
                        description="$1,299.99 - Laptop"
                        time="3 hours ago"
                    />
                    <ActivityItem
                        icon="📈"
                        title="Forecast generated"
                        description="30-day sales prediction"
                        time="5 hours ago"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`${color} rounded-full p-3 text-2xl`}>{icon}</div>
            </div>
        </div>
    );
}

function QuickActionCard({
    title,
    description,
    icon,
    href,
}: {
    title: string;
    description: string;
    icon: string;
    href: string;
}) {
    return (
        <a
            href={href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="flex items-start">
                <div className="text-3xl mr-4">{icon}</div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </a>
    );
}

function ActivityItem({
    icon,
    title,
    description,
    time,
}: {
    icon: string;
    title: string;
    description: string;
    time: string;
}) {
    return (
        <div className="flex items-start">
            <div className="text-2xl mr-4">{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <span className="text-xs text-gray-500">{time}</span>
        </div>
    );
}
