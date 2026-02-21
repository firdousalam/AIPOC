'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/services/api/client';
import { formatCurrency } from '@/utils/constants';

interface InventoryItem {
    _id: string;
    productId: string;
    productName: string;
    quantity: number;
    reorderLevel: number;
    location?: string;
    lastRestocked?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Product {
    _id: string;
    productId: string;
    name: string;
    costPrice?: number;
    stock?: number;
}

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'ok'>('all');

    // Form state
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        quantity: 0,
        reorderLevel: 10,
        location: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInventory();
        fetchProducts();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/inventory');
            setInventory(response.data);
        } catch (err: any) {
            console.error('Error fetching inventory:', err);
            setError(err.response?.data?.message || 'Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('/api/products?limit=1000');
            setProducts(response.data.products || response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleOpenModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                reorderLevel: item.reorderLevel,
                location: item.location || '',
            });
        } else {
            setEditingItem(null);
            setFormData({
                productId: '',
                productName: '',
                quantity: 0,
                reorderLevel: 10,
                location: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            productId: '',
            productName: '',
            quantity: 0,
            reorderLevel: 10,
            location: '',
        });
    };

    const handleProductChange = (productId: string) => {
        const product = products.find(p => p._id === productId);
        if (product) {
            setFormData({
                ...formData,
                productId: product._id,
                productName: product.name,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (editingItem) {
                await apiClient.put(`/api/inventory/${editingItem._id}`, formData);
            } else {
                await apiClient.post('/api/inventory', formData);
            }
            handleCloseModal();
            fetchInventory();
        } catch (err: any) {
            console.error('Error saving inventory:', err);
            setError(err.response?.data?.message || 'Failed to save inventory');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inventory item?')) return;

        try {
            await apiClient.delete(`/api/inventory/${id}`);
            fetchInventory();
        } catch (err: any) {
            console.error('Error deleting inventory:', err);
            setError(err.response?.data?.message || 'Failed to delete inventory');
        }
    };

    const getStockStatus = (item: InventoryItem) => {
        if (item.quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (item.quantity <= item.reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    const filteredInventory = inventory.filter(item => {
        if (filterStatus === 'low') return item.quantity <= item.reorderLevel;
        if (filterStatus === 'ok') return item.quantity > item.reorderLevel;
        return true;
    });

    const lowStockCount = inventory.filter(item => item.quantity <= item.reorderLevel).length;
    const outOfStockCount = inventory.filter(item => item.quantity === 0).length;
    const totalValue = inventory.reduce((sum, item) => {
        const product = products.find(p => p._id === item.productId);
        return sum + (item.quantity * (product?.costPrice || 0));
    }, 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading inventory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Track and manage product stock levels</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                    <span className="mr-2">➕</span>
                    Add Inventory Item
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                        ✕
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Items</div>
                    <div className="text-2xl font-bold text-gray-900">{inventory.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">Low Stock</div>
                    <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">Out of Stock</div>
                    <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'all'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({inventory.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('low')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'low'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Low Stock ({lowStockCount})
                    </button>
                    <button
                        onClick={() => setFilterStatus('ok')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'ok'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        In Stock ({inventory.length - lowStockCount})
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reorder Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInventory.map((item) => {
                                const status = getStockStatus(item);
                                return (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                            <div className="text-xs text-gray-500">ID: {item.productId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{item.quantity}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.reorderLevel}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.location || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredInventory.map((item) => {
                        const status = getStockStatus(item);
                        return (
                            <div key={item._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="text-base font-medium text-gray-900">{item.productName}</div>
                                        <div className="text-xs text-gray-500">ID: {item.productId}</div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                                    <div>
                                        <span className="text-gray-500">Quantity:</span>
                                        <span className="ml-1 font-semibold">{item.quantity}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Reorder:</span>
                                        <span className="ml-1 font-medium">{item.reorderLevel}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-500">Location:</span>
                                        <span className="ml-1 font-medium">{item.location || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredInventory.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No inventory items found.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Product Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product
                                </label>
                                <select
                                    value={formData.productId}
                                    onChange={(e) => handleProductChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    disabled={!!editingItem}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(product => (
                                        <option key={product._id} value={product._id}>
                                            {product.name} (Stock: {product.stock || 0})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Reorder Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reorder Level
                                </label>
                                <input
                                    type="number"
                                    value={formData.reorderLevel}
                                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Warehouse A, Shelf 3"
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
