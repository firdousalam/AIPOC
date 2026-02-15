'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/api/client';

interface Product {
    _id: string;
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
    distributor?: string;
    company?: string;
    mrp?: number;
    salePrice?: number;
    discount?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function ProductsPage() {
    const { user, isSuperAdmin } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [error, setError] = useState('');

    // Search and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const tableRef = useRef<HTMLDivElement>(null);

    const canEdit = user?.userType === 'super' || user?.userType === 'admin';

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Filter products based on search term
        if (searchTerm.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
        setCurrentPage(1); // Reset to first page when searching
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await apiClient.get('/api/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await apiClient.delete(`/api/products/${productId}`);
            setProducts(products.filter(p => p._id !== productId));
            setError('');
        } catch (err: any) {
            console.error('Error deleting product:', err);
            setError(err.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Smooth scroll to top of table
        tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <span className="mr-2">➕</span>
                        Add Product
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

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, ID, category, company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                        </div>
                    </div>

                    {/* Items per page */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-600">per page</span>
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-3 text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                    {searchTerm && ` (filtered from ${products.length} total)`}
                </div>
            </div>

            {/* Products Table */}
            <div ref={tableRef} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                {canEdit && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {product.description || 'No description'}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                ID: {product._id}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {product.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {product.salePrice ? (
                                                <>
                                                    <div className="font-semibold">${product.salePrice.toFixed(2)}</div>
                                                    {product.mrp && product.mrp > product.salePrice && (
                                                        <div className="text-xs text-gray-500 line-through">
                                                            ${product.mrp.toFixed(2)}
                                                        </div>
                                                    )}
                                                    {product.discount && (
                                                        <div className="text-xs text-green-600">
                                                            {product.discount}% OFF
                                                        </div>
                                                    )}
                                                </>
                                            ) : product.price ? (
                                                <div className="font-semibold">${product.price.toFixed(2)}</div>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(product.stock || 0) < 20
                                                ? 'bg-red-100 text-red-800'
                                                : (product.stock || 0) < 50
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            {product.stock || 0} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {product.company || 'N/A'}
                                        </div>
                                        {product.distributor && (
                                            <div className="text-xs text-gray-500">
                                                Dist: {product.distributor}
                                            </div>
                                        )}
                                    </td>
                                    {canEdit && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
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

                {currentItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? 'No products found matching your search.' : 'No products found. Add your first product!'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ‹
                                </button>
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 2 ||
                                        pageNumber === currentPage + 2
                                    ) {
                                        return (
                                            <span
                                                key={pageNumber}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ›
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <ProductModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchProducts();
                    }}
                    canEdit={canEdit}
                />
            )}

            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                        fetchProducts();
                    }}
                    canEdit={canEdit}
                />
            )}
        </div>
    );
}

// Product Modal Component
function ProductModal({
    product,
    onClose,
    onSuccess,
    canEdit,
}: {
    product?: Product;
    onClose: () => void;
    onSuccess: () => void;
    canEdit: boolean;
}) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        category: product?.category || '',
        stock: product?.stock || 0,
        distributor: product?.distributor || '',
        company: product?.company || '',
        mrp: product?.mrp || 0,
        salePrice: product?.salePrice || 0,
        discount: product?.discount || 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canEdit) {
            setError('You do not have permission to perform this action');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (product) {
                // Update existing product
                await apiClient.put(`/api/products/${product._id}`, formData);
            } else {
                // Create new product
                await apiClient.post('/api/products', formData);
            }
            onSuccess();
        } catch (err: any) {
            console.error('Error saving product:', err);
            setError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof Product, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter product name"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter product description"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Electronics"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleChange('stock', Number(e.target.value))}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0"
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company/Manufacturer
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Apple Inc"
                            />
                        </div>

                        {/* Distributor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Distributor
                            </label>
                            <input
                                type="text"
                                value={formData.distributor}
                                onChange={(e) => handleChange('distributor', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Tech Distributors"
                            />
                        </div>

                        {/* MRP */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                MRP (Maximum Retail Price)
                            </label>
                            <input
                                type="number"
                                value={formData.mrp}
                                onChange={(e) => handleChange('mrp', Number(e.target.value))}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Sale Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sale Price
                            </label>
                            <input
                                type="number"
                                value={formData.salePrice}
                                onChange={(e) => handleChange('salePrice', Number(e.target.value))}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', Number(e.target.value))}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                value={formData.discount}
                                onChange={(e) => handleChange('discount', Number(e.target.value))}
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
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
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
