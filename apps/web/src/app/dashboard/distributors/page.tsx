'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/api/client';

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

export default function DistributorsPage() {
    const { user } = useAuth();
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const canEdit = user?.userType === 'super' || user?.userType === 'admin';

    useEffect(() => {
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiClient.get('/api/settings/distributors');
            setDistributors(response.data);
        } catch (err: any) {
            console.error('Error fetching distributors:', err);
            setError(err.response?.data?.message || 'Failed to fetch distributors');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this distributor?')) return;

        try {
            await apiClient.delete(`/api/settings/distributors/${id}`);
            fetchDistributors();
            setError('');
        } catch (err: any) {
            console.error('Error deleting distributor:', err);
            setError(err.response?.data?.message || 'Failed to delete distributor');
        }
    };

    const handleEdit = (distributor: Distributor) => {
        setEditingDistributor(distributor);
        setShowModal(true);
    };

    const filteredDistributors = distributors.filter(distributor =>
        distributor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distributor.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distributor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distributor.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading distributors...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Distributors</h1>
                    <p className="text-gray-600">Manage distributors and suppliers</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => {
                            setEditingDistributor(null);
                            setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <span className="mr-2">➕</span>
                        Add Distributor
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
                        placeholder="Search distributors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Distributors Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Distributor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Person
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Address
                                </th>
                                {canEdit && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDistributors.map((distributor) => (
                                <tr key={distributor._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {distributor.name}
                                            </div>
                                            {distributor.description && (
                                                <div className="text-sm text-gray-500">
                                                    {distributor.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {distributor.contactPerson || <span className="text-gray-400">N/A</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {distributor.email && <div>📧 {distributor.email}</div>}
                                            {distributor.phone && <div>📞 {distributor.phone}</div>}
                                            {!distributor.email && !distributor.phone && <span className="text-gray-400">N/A</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {distributor.address ? (
                                                <div className="max-w-xs truncate">📍 {distributor.address}</div>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    {canEdit && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(distributor)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(distributor._id)}
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

                {filteredDistributors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? 'No distributors found matching your search.' : 'No distributors found. Add your first distributor!'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
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
                        fetchDistributors();
                    }}
                    setError={setError}
                    canEdit={canEdit}
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
    canEdit,
}: {
    distributor: Distributor | null;
    onClose: () => void;
    onSuccess: () => void;
    setError: (msg: string) => void;
    canEdit: boolean;
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
            if (distributor) {
                await apiClient.put(`/api/settings/distributors/${distributor._id}`, formData);
            } else {
                await apiClient.post('/api/settings/distributors', formData);
            }
            onSuccess();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to save distributor';
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
                            {distributor ? 'Edit Distributor' : 'Add Distributor'}
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
                            disabled={loading || !canEdit}
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
