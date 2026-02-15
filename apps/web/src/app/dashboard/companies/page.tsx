'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/api/client';

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

export default function CompaniesPage() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const canEdit = user?.userType === 'super' || user?.userType === 'admin';

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiClient.get('/api/settings/companies');
            setCompanies(response.data);
        } catch (err: any) {
            console.error('Error fetching companies:', err);
            setError(err.response?.data?.message || 'Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this company?')) return;

        try {
            await apiClient.delete(`/api/settings/companies/${id}`);
            fetchCompanies();
            setError('');
        } catch (err: any) {
            console.error('Error deleting company:', err);
            setError(err.response?.data?.message || 'Failed to delete company');
        }
    };

    const handleEdit = (company: Company) => {
        setEditingCompany(company);
        setShowModal(true);
    };

    const filteredCompanies = companies.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading companies...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Manage manufacturers and companies</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => {
                            setEditingCompany(null);
                            setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                        <span className="mr-2">➕</span>
                        Add Company
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
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Website
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
                            {filteredCompanies.map((company) => (
                                <tr key={company._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {company.name}
                                            </div>
                                            {company.description && (
                                                <div className="text-sm text-gray-500">
                                                    {company.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {company.email && <div>📧 {company.email}</div>}
                                            {company.phone && <div>📞 {company.phone}</div>}
                                            {!company.email && !company.phone && <span className="text-gray-400">N/A</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-indigo-600 hover:text-indigo-900"
                                            >
                                                🌐 Visit
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    {canEdit && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(company)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company._id)}
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
                    {filteredCompanies.map((company) => (
                        <div key={company._id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="mb-3">
                                <div className="text-base font-medium text-gray-900 mb-1">
                                    {company.name}
                                </div>
                                {company.description && (
                                    <div className="text-sm text-gray-600 mb-2">
                                        {company.description}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 mb-3">
                                {company.email && (
                                    <div className="text-sm text-gray-900">📧 {company.email}</div>
                                )}
                                {company.phone && (
                                    <div className="text-sm text-gray-900">📞 {company.phone}</div>
                                )}
                                {company.website && (
                                    <div>
                                        <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            🌐 Visit Website
                                        </a>
                                    </div>
                                )}
                                <div className="text-xs text-gray-500">
                                    Created: {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>

                            {canEdit && (
                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => handleEdit(company)}
                                        className="flex-1 px-3 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(company._id)}
                                        className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? 'No companies found matching your search.' : 'No companies found. Add your first company!'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
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
                        fetchCompanies();
                    }}
                    setError={setError}
                    canEdit={canEdit}
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
    canEdit,
}: {
    company: Company | null;
    onClose: () => void;
    onSuccess: () => void;
    setError: (msg: string) => void;
    canEdit: boolean;
}) {
    const [formData, setFormData] = useState({
        name: company?.name || '',
        description: company?.description || '',
        website: company?.website || '',
        email: company?.email || '',
        phone: company?.phone || '',
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
            if (company) {
                await apiClient.put(`/api/settings/companies/${company._id}`, formData);
            } else {
                await apiClient.post('/api/settings/companies', formData);
            }
            onSuccess();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to save company';
            setLocalError(errorMsg);
            setError(errorMsg);
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
                            disabled={loading || !canEdit}
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
