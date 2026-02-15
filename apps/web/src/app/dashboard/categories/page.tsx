'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/api/client';

interface Category {
    _id: string;
    name: string;
    description?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function CategoriesPage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const canEdit = user?.userType === 'super' || user?.userType === 'admin';

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiClient.get('/api/settings/categories');
            setCategories(response.data);
        } catch (err: any) {
            console.error('Error fetching categories:', err);
            setError(err.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await apiClient.delete(`/api/settings/categories/${id}`);
            fetchCategories();
            setError('');
        } catch (err: any) {
            console.error('Error deleting category:', err);
            setError(err.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const filteredCategories = categories.filter(category =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Manage product categories</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                        <span className="mr-2">➕</span>
                        Add Category
                    </button>
                )}
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

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                {canEdit && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCategories.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">
                                            {category.description || 'No description'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    {canEdit && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                        <div key={category._id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="text-base font-medium text-gray-900 mb-1">
                                        {category.name}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        {category.description || 'No description'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Created: {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {canEdit && (
                                <div className="flex gap-2 pt-3 border-t border-gray-200 mt-3">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex-1 px-3 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? 'No categories found matching your search.' : 'No categories found. Add your first category!'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => {
                        setShowModal(false);
                        setEditingCategory(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingCategory(null);
                        fetchCategories();
                    }}
                    setError={setError}
                    canEdit={canEdit}
                />
            )}
        </div>
    );
}

// Category Modal
function CategoryModal({
    category,
    onClose,
    onSuccess,
    setError,
    canEdit,
}: {
    category: Category | null;
    onClose: () => void;
    onSuccess: () => void;
    setError: (msg: string) => void;
    canEdit: boolean;
}) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
    });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canEdit) {
            setLocalError('You do not have permission to perform this action');
            return;
        }

        setLoading(true);
        setLocalError('');

        try {
            if (category) {
                await apiClient.put(`/api/settings/categories/${category._id}`, formData);
            } else {
                await apiClient.post('/api/settings/categories', formData);
            }
            onSuccess();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to save category';
            setLocalError(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            {category ? 'Edit Category' : 'Add Category'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                            ✕
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {localError && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            {localError}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter description (optional)"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !canEdit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Saving...' : category ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
