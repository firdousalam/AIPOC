'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/api/client';
import { CURRENCY_SYMBOL, formatCurrency } from '@/utils/constants';

interface Product {
    _id: string;
    productId?: string;
    name?: string;
    description?: string;
    costPrice?: number;
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
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [error, setError] = useState('');

    // Pagination state
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    const tableRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const canEdit = user?.userType === 'super' || user?.userType === 'admin';

    useEffect(() => {
        fetchProducts();
    }, [currentPage, itemsPerPage]);

    // Debounced search effect
    useEffect(() => {
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Reset to page 1 when search changes
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            // Set new timeout for debounced search
            searchTimeoutRef.current = setTimeout(() => {
                fetchProducts();
            }, 500);
        }

        // Cleanup function
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    const fetchProducts = async () => {
        try {
            setSearchLoading(true);
            setLoading(false); // Hide initial loading screen
            setError('');

            // Build query parameters
            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
            };
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await apiClient.get('/api/products', { params });

            // Handle paginated response
            if (response.data.products) {
                setProducts(response.data.products);
                setTotalItems(response.data.total);
                setTotalPages(response.data.totalPages);
            } else {
                // Fallback for non-paginated response
                setProducts(response.data);
                setTotalItems(response.data.length);
                setTotalPages(1);
            }
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleDateSearch = () => {
        setCurrentPage(1); // Reset to first page
        fetchProducts();
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setCurrentPage(1); // Reset to first page
        // Trigger fetch with useEffect
        fetchProducts();
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await apiClient.delete(`/api/products/${productId}`);
            // Refresh current page
            fetchProducts();
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

    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    const handleExportToExcel = () => {
        // Prepare data for export (current page only)
        const exportData = products.map(product => ({
            'Product ID': product.productId || 'N/A',
            'Name': product.name || 'N/A',
            'Description': product.description || 'No description',
            'Category': product.category || 'Uncategorized',
            'Company': product.company || 'N/A',
            'Distributor': product.distributor || 'N/A',
            'Stock': product.stock || 0,
            'MRP': product.mrp ? `${CURRENCY_SYMBOL}${product.mrp.toFixed(2)}` : 'N/A',
            'Sale Price': product.salePrice ? `${CURRENCY_SYMBOL}${product.salePrice.toFixed(2)}` : 'N/A',
            'Cost Price': product.costPrice ? `${CURRENCY_SYMBOL}${product.costPrice.toFixed(2)}` : 'N/A',
            'Discount': product.discount ? `${product.discount}%` : 'N/A',
            'Created At': product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A',
        }));

        // Convert to CSV
        const headers = Object.keys(exportData[0] || {});
        const csvContent = [
            headers.join(','),
            ...exportData.map(row =>
                headers.map(header => {
                    const value = row[header as keyof typeof row];
                    // Escape commas and quotes in values
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `products_page${currentPage}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Manage your product catalog</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleExportToExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                        disabled={products.length === 0}
                    >
                        <span className="mr-2">📥</span>
                        Export to Excel
                    </button>
                    {canEdit && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                        >
                            <span className="mr-2">➕</span>
                            Add Product
                        </button>
                    )}
                </div>
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
                <div className="flex flex-col gap-4">
                    {/* Search and Date Filters Row */}
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
                        {/* Search */}
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Products
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name, product ID, category, company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                                {searchLoading && (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Date Range Filters */}
                        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                            <div className="flex-1 sm:flex-none">
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex-1 sm:flex-none">
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDateSearch}
                                    disabled={!startDate && !endDate}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Search
                                </button>
                                {(startDate || endDate) && (
                                    <button
                                        onClick={handleClearDates}
                                        className="flex-1 sm:flex-none px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                        title="Clear date filters"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div ref={tableRef} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product ID
                                </th>
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
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-indigo-600">
                                            {product.productId || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {product.description || 'No description'}
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
                                                    <div className="font-semibold">{formatCurrency(product.salePrice)}</div>
                                                    {product.mrp && product.mrp > product.salePrice && (
                                                        <div className="text-xs text-gray-500 line-through">
                                                            {formatCurrency(product.mrp)}
                                                        </div>
                                                    )}
                                                    {product.discount && (
                                                        <div className="text-xs text-green-600">
                                                            {product.discount}% OFF
                                                        </div>
                                                    )}
                                                </>
                                            ) : product.costPrice ? (
                                                <div className="font-semibold">{formatCurrency(product.costPrice)}</div>
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
                                                onClick={() => handleView(product)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
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

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {products.map((product) => (
                        <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-indigo-600 mb-1">
                                        {product.productId || 'N/A'}
                                    </div>
                                    <div className="text-base font-medium text-gray-900">
                                        {product.name || 'N/A'}
                                    </div>
                                </div>
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {product.category || 'Uncategorized'}
                                </span>
                            </div>

                            <div className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {product.description || 'No description'}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <div className="text-xs text-gray-500">Price</div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {product.salePrice ? formatCurrency(product.salePrice) : product.costPrice ? formatCurrency(product.costPrice) : 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Stock</div>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(product.stock || 0) < 20
                                            ? 'bg-red-100 text-red-800'
                                            : (product.stock || 0) < 50
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        {product.stock || 0}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Company</div>
                                    <div className="text-sm text-gray-900">{product.company || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Distributor</div>
                                    <div className="text-sm text-gray-900">{product.distributor || 'N/A'}</div>
                                </div>
                            </div>

                            {canEdit && (
                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => handleView(product)}
                                        className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 px-3 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="flex-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? 'No products found matching your search.' : 'No products found. Add your first product!'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="bg-white rounded-lg shadow px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Left side - Items per page */}
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

                        {/* Right side - Page navigation and results count */}
                        <div className="flex items-center gap-6">
                            {/* Results count */}
                            <div className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
                            </div>

                            {/* Page navigation */}
                            {totalPages > 1 && (
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-700">
                                        Page <span className="font-medium">{currentPage}</span> of{' '}
                                        <span className="font-medium">{totalPages}</span>
                                    </p>
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
                            )}
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

            {/* View Product Modal */}
            {showViewModal && selectedProduct && (
                <ProductViewModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedProduct(null);
                    }}
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
        costPrice: product?.costPrice || 0,
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
    const [nextProductId, setNextProductId] = useState<string>('');

    // Settings data
    const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
    const [companies, setCompanies] = useState<Array<{ _id: string; name: string }>>([]);
    const [distributors, setDistributors] = useState<Array<{ _id: string; name: string }>>([]);
    const [loadingSettings, setLoadingSettings] = useState(true);

    useEffect(() => {
        fetchSettings();
        if (!product) {
            fetchNextProductId();
        }
    }, []);

    const fetchNextProductId = async () => {
        try {
            const response = await apiClient.get('/api/products');
            const products = response.data;

            let nextNumber = 1;
            if (products.length > 0) {
                // Find the highest product number
                const productNumbers = products
                    .map((p: Product) => p.productId ? parseInt(p.productId.replace('PROD-', '')) : 0)
                    .filter((num: number) => !isNaN(num));

                if (productNumbers.length > 0) {
                    nextNumber = Math.max(...productNumbers) + 1;
                }
            }

            setNextProductId(`PROD-${String(nextNumber).padStart(4, '0')}`);
        } catch (err: any) {
            console.error('Error fetching next product ID:', err);
            setNextProductId('PROD-0001');
        }
    };

    const fetchSettings = async () => {
        try {
            setLoadingSettings(true);
            const [categoriesRes, companiesRes, distributorsRes] = await Promise.all([
                apiClient.get('/api/settings/categories'),
                apiClient.get('/api/settings/companies'),
                apiClient.get('/api/settings/distributors'),
            ]);
            setCategories(categoriesRes.data);
            setCompanies(companiesRes.data);
            setDistributors(distributorsRes.data);
        } catch (err: any) {
            console.error('Error fetching settings:', err);
            setError('Failed to load categories, companies, and distributors');
        } finally {
            setLoadingSettings(false);
        }
    };

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
                        {/* Product ID - Display for both new and existing products */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product ID
                            </label>
                            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-indigo-600 font-semibold">
                                {product?.productId || nextProductId || 'Generating...'}
                            </div>
                            {!product && (
                                <p className="text-xs text-gray-500 mt-1">
                                    This ID will be automatically assigned when you create the product
                                </p>
                            )}
                        </div>

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
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={loadingSettings}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
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
                            <select
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={loadingSettings}
                            >
                                <option value="">Select a company</option>
                                {companies.map((comp) => (
                                    <option key={comp._id} value={comp.name}>
                                        {comp.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Distributor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Distributor
                            </label>
                            <select
                                value={formData.distributor}
                                onChange={(e) => handleChange('distributor', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={loadingSettings}
                            >
                                <option value="">Select a distributor</option>
                                {distributors.map((dist) => (
                                    <option key={dist._id} value={dist.name}>
                                        {dist.name}
                                    </option>
                                ))}
                            </select>
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

                        {/* Cost Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cost Price
                            </label>
                            <input
                                type="number"
                                value={formData.costPrice}
                                onChange={(e) => handleChange('costPrice', Number(e.target.value))}
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


// Product View Modal (Read-only)
function ProductViewModal({
    product,
    onClose,
}: {
    product: Product;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product ID */}
                        <div className="md:col-span-2 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <label className="block text-sm font-medium text-indigo-900 mb-1">
                                Product ID
                            </label>
                            <div className="text-2xl font-bold text-indigo-600">
                                {product.productId || 'N/A'}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name
                            </label>
                            <div className="text-lg font-semibold text-gray-900">
                                {product.name || 'N/A'}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                {product.description || 'No description'}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <div className="text-gray-900">
                                <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {product.category || 'Uncategorized'}
                                </span>
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity
                            </label>
                            <div className="text-gray-900">
                                <span
                                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${(product.stock || 0) < 20
                                        ? 'bg-red-100 text-red-800'
                                        : (product.stock || 0) < 50
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}
                                >
                                    {product.stock || 0} units
                                </span>
                            </div>
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company/Manufacturer
                            </label>
                            <div className="text-gray-900 font-medium">
                                {product.company || 'N/A'}
                            </div>
                        </div>

                        {/* Distributor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Distributor
                            </label>
                            <div className="text-gray-900 font-medium">
                                {product.distributor || 'N/A'}
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* MRP */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        MRP
                                    </label>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {product.mrp ? formatCurrency(product.mrp) : 'N/A'}
                                    </div>
                                </div>

                                {/* Sale Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sale Price
                                    </label>
                                    <div className="text-lg font-semibold text-green-600">
                                        {product.salePrice ? formatCurrency(product.salePrice) : 'N/A'}
                                    </div>
                                </div>

                                {/* Cost Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cost Price
                                    </label>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {product.costPrice ? formatCurrency(product.costPrice) : 'N/A'}
                                    </div>
                                </div>

                                {/* Discount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount
                                    </label>
                                    <div className="text-lg font-semibold text-orange-600">
                                        {product.discount ? `${product.discount}%` : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Created At
                                    </label>
                                    <div className="text-sm text-gray-600">
                                        {product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Updated
                                    </label>
                                    <div className="text-sm text-gray-600">
                                        {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
