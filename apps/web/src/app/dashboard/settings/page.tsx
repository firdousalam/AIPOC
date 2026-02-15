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

interface Company {
    _id: string;
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Distributor {
    _id: string;
    name: string;
    description?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

type TabType = 'categories' | 'companies' | 'distributors';

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('categories');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const canEdit = user?.userType === 'super' || user?.userType === 'admin';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage categories, companies, and distributors</p>
            </div>

            {/* Global Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                        ✕
                    </button>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
                        ✕
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'categories'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            📁 Categories
                        </button>
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'companies'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            🏢 Companies
                        </button>
                        <button
                            onClick={() => setActiveTab('distributors')}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'distributors'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            🚚 Distributors
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'categories' && (
                        <CategoriesTab canEdit={canEdit} setError={setError} setSuccess={setSuccess} />
                    )}
                    {activeTab === 'companies' && (
                        <CompaniesTab canEdit={canEdit} setError={setError} setSuccess={setSuccess} />
                    )}
                    {activeTab === 'distributors' && (
                        <DistributorsTab canEdit={canEdit} setError={setError} setSuccess={setSuccess} />
                    )}
                </div>
            </div>
        </div>
    );
}

// Categories Tab Component
function CategoriesTab({
    canEdit,
    setError,
    setSuccess,
}: {
    canEdit: boolean;
    setError: (msg: string) => void;
    setSuccess: (msg: string) => void;
}) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/settings/categories');
            setCategories(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await apiClient.delete(`/api/settings/categories/${id}`);
            setSuccess('Category deleted successfully');
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    if (loading) {
        return <div className="text-center py-8">Loading categories...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Categories</h2>
                {canEdit && (
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        ➕ Add Category
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            {canEdit && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        {category.description && (
                            <p className="text-sm text-gray-600">{category.description}</p>
                        )}
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No categories found. Add your first category!
                </div>
            )}

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
                        setSuccess(editingCategory ? 'Category updated successfully' : 'Category created successfully');
                        fetchCategories();
                    }}
                    setError={setError}
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
}: {
    category: Category | null;
    onClose: () => void;
    onSuccess: () => void;
    setError: (msg: string) => void;
}) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (category) {
                await apiClient.put(`/api/settings/categories/${category._id}`, formData);
            } else {
                await apiClient.post('/api/settings/categories', formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save category');
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
                            disabled={loading}
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


// Companies Tab Component
function CompaniesTab({
    canEdit,
    setError,
    setSuccess,
}: {
    canEdit: boolean;
    setError: (msg: string) => void;
    setSuccess: (msg: string) => void;
}) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/settings/companies');
            setCompanies(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this company?')) return;

        try {
            await apiClient.delete(`/api/settings/companies/${id}`);
            setSuccess('Company deleted successfully');
            fetchCompanies();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete company');
        }
    };

    const handleEdit = (company: Company) => {
        setEditingCompany(company);
        setShowModal(true);
    };

    if (loading) {
        return <div className="text-center py-8">Loading companies...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Companies / Manufacturers</h2>
                {canEdit && (
                    <button
                        onClick={() => {
                            setEditingCompany(null);
                            setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        ➕ Add Company
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map((company) => (
                    <div key={company._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{company.name}</h3>
                            {canEdit && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(company)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(company._id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        {company.description && (
                            <p className="text-sm text-gray-600 mb-2">{company.description}</p>
                        )}
                        <div className="text-xs text-gray-500 space-y-1">
                            {company.website && <div>🌐 {company.website}</div>}
                            {company.email && <div>📧 {company.email}</div>}
                            {company.phone && <div>📞 {company.phone}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {companies.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No companies found. Add your first company!
                </div>
            )}

            {showModal && (
                <CompanyModal
                    company={editingCompany}
                    onClose={() => {
                        setShowModal(false);
                        setEditingCompany(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingCompany(null);
                        setSuccess(editingCompany ? 'Company updated successfully' : 'Company created successfully');
                        fetchCompanies();
                    }}
                    setError={setError}
                />
            )}
        </div>
    );
}

// Company Modal
function CompanyModal({
    company,
    onClose,
    onSuccess,
    setError,
}: {
    company: Company | null;
    onClose: () => void;
    onSuccess: () => void;
    setError: (msg: string) => void;
}) {
    const [formData, setFormData] = useState({
        name: company?.name || '',
        description: company?.description || '',
        website: company?.website || '',
        email: company?.email || '',
        phone: company?.phone || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (company) {
                await apiClient.put(`/api/settings/companies/${company._id}`, formData);
            } else {
                await apiClient.post('/api/settings/companies', formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save company');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            {company ? 'Edit Company' : 'Add Company'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                            ✕
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                            placeholder="Enter company name"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="contact@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="+1 234 567 8900"
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
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Saving...' : company ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Distributors Tab Component
function DistributorsTab({
    canEdit,
    setError,
    setSuccess,
}: {
    canEdit: boolean;
    setError: (msg: string) => void;
    setSuccess: (msg: string) => void;
}) {
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);

    useEffect(() => {
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/settings/distributors');
            setDistributors(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch distributors');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this distributor?')) return;

        try {
            await apiClient.delete(`/api/settings/distributors/${id}`);
            setSuccess('Distributor deleted successfully');
            fetchDistributors();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete distributor');
        }
    };

    const handleEdit = (distributor: Distributor) => {
        setEditingDistributor(distributor);
        setShowModal(true);
    };

    if (loading) {
        return <div className="text-center py-8">Loading distributors...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Distributors</h2>
                {canEdit && (
                    <button
                        onClick={() => {
                            setEditingDistributor(null);
                            setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        ➕ Add Distributor
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {distributors.map((distributor) => (
                    <div key={distributor._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{distributor.name}</h3>
                            {canEdit && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(distributor)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(distributor._id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        {distributor.description && (
                            <p className="text-sm text-gray-600 mb-2">{distributor.description}</p>
                        )}
                        <div className="text-xs text-gray-500 space-y-1">
                            {distributor.contactPerson && <div>👤 {distributor.contactPerson}</div>}
                            {distributor.email && <div>📧 {distributor.email}</div>}
                            {distributor.phone && <div>📞 {distributor.phone}</div>}
                            {distributor.address && <div>📍 {distributor.address}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {distributors.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No distributors found. Add your first distributor!
                </div>
            )}

            {showModal && (
                <DistributorModal
                    distributor={editingDistributor}
                    onClose={() => {
                        setShowModal(false);
                        setEditingDistributor(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingDistributor(null);
                        setSuccess(editingDistributor ? 'Distributor updated successfully' : 'Distributor created successfully');
                        fetchDistributors();
                    }}
                    setError={setError}
                />
            )}
        </div>
    );
}

// Distributor Modal
function DistributorModal({
    distributor,
    onClose,
    onSuccess,
    setError,
}: {
    distributor: Distributor | null;
    onClose: () => void;
    onSuccess: () => void;
    setError: (msg: string) => void;
}) {
    const [formData, setFormData] = useState({
        name: distributor?.name || '',
        description: distributor?.description || '',
        contactPerson: distributor?.contactPerson || '',
        email: distributor?.email || '',
        phone: distributor?.phone || '',
        address: distributor?.address || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (distributor) {
                await apiClient.put(`/api/settings/distributors/${distributor._id}`, formData);
            } else {
                await apiClient.post('/api/settings/distributors', formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save distributor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            {distributor ? 'Edit Distributor' : 'Add Distributor'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                            ✕
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                            placeholder="Enter distributor name"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Person
                        </label>
                        <input
                            type="text"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="contact@distributor.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="+1 234 567 8900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter full address"
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
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Saving...' : distributor ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
