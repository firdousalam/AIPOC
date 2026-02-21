'use client';

import { useEffect, useState, useRef } from 'react';
import apiClient from '@/services/api/client';
import { CURRENCY_SYMBOL, formatCurrency } from '@/utils/constants';

interface SaleItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

interface CustomerInfo {
    name?: string;
    email?: string;
    mobile?: string;
    panOrVoterId?: string;
}

interface Sale {
    _id: string;
    items: SaleItem[];
    totalAmount: number;
    saleDate: string;
    customer?: CustomerInfo;
    paymentMethod?: string;
    notes?: string;
    createdAt?: string;
}

interface Product {
    _id: string;
    name: string;
    costPrice: number;
    stock: number;
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);
    const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());

    // Pagination state
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    // Form state
    const [saleItems, setSaleItems] = useState<SaleItem[]>([
        { productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
    ]);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({});
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const tableRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchSales();
        fetchProducts();
    }, [currentPage, itemsPerPage]);

    // Debounced search effect
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            searchTimeoutRef.current = setTimeout(() => {
                fetchSales();
            }, 500);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('/api/products?limit=1000');
            setProducts(response.data.products || response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const fetchSales = async () => {
        try {
            setSearchLoading(true);
            setLoading(false);
            setError('');

            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
            };
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await apiClient.get('/api/sales', { params });

            if (response.data.sales) {
                setSales(response.data.sales);
                setTotalItems(response.data.total);
                setTotalPages(response.data.totalPages);
            } else {
                setSales(response.data);
                setTotalItems(response.data.length);
                setTotalPages(1);
            }
        } catch (err: any) {
            console.error('Error fetching sales:', err);
            setError(err.response?.data?.message || 'Failed to fetch sales');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleDateSearch = () => {
        setCurrentPage(1);
        fetchSales();
    };

    const handleClearDates = () => {
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
        fetchSales();
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleProductChange = (index: number, productId: string) => {
        const product = products.find(p => p._id === productId);
        if (product) {
            const newItems = [...saleItems];
            newItems[index] = {
                productId: product._id,
                productName: product.name,
                quantity: newItems[index].quantity,
                unitPrice: product.costPrice,
                totalPrice: product.costPrice * newItems[index].quantity
            };
            setSaleItems(newItems);
        }
    };

    const handleQuantityChange = (index: number, quantity: number) => {
        const newItems = [...saleItems];
        newItems[index].quantity = quantity;
        newItems[index].totalPrice = newItems[index].unitPrice * quantity;
        setSaleItems(newItems);
    };

    const addSaleItem = () => {
        setSaleItems([...saleItems, { productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
    };

    const removeSaleItem = (index: number) => {
        if (saleItems.length > 1) {
            setSaleItems(saleItems.filter((_, i) => i !== index));
        }
    };

    const calculateTotal = () => {
        return saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    const resetForm = () => {
        setSaleItems([{ productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
        setCustomerInfo({});
        setSaleDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod('Cash');
        setNotes('');
        setEditingSale(null);
    };

    const handleOpenModal = (sale?: Sale) => {
        if (sale) {
            setEditingSale(sale);
            setSaleItems(sale.items);
            setCustomerInfo(sale.customer || {});
            setSaleDate(new Date(sale.saleDate).toISOString().split('T')[0]);
            setPaymentMethod(sale.paymentMethod || 'Cash');
            setNotes(sale.notes || '');
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const saleData = {
                items: saleItems.filter(item => item.productId),
                totalAmount: calculateTotal(),
                saleDate: new Date(saleDate),
                customer: Object.keys(customerInfo).length > 0 ? customerInfo : undefined,
                paymentMethod: paymentMethod || undefined,
                notes: notes || undefined,
            };

            if (editingSale) {
                await apiClient.put(`/api/sales/${editingSale._id}`, saleData);
            } else {
                await apiClient.post('/api/sales', saleData);
            }

            handleCloseModal();
            fetchSales();
        } catch (err: any) {
            console.error('Error saving sale:', err);
            setError(err.response?.data?.message || 'Failed to save sale');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sale?')) return;

        try {
            await apiClient.delete(`/api/sales/${id}`);
            fetchSales();
        } catch (err: any) {
            console.error('Error deleting sale:', err);
            setError(err.response?.data?.message || 'Failed to delete sale');
        }
    };

    const handleExportToExcel = () => {
        const exportData = sales.flatMap(sale =>
            sale.items.map(item => ({
                'Date': new Date(sale.saleDate).toLocaleDateString(),
                'Product': item.productName,
                'Quantity': item.quantity,
                'Unit Price': item.unitPrice.toFixed(2),
                'Item Total': item.totalPrice.toFixed(2),
                'Sale Total': sale.totalAmount.toFixed(2),
                'Customer': sale.customer?.name || 'N/A',
                'Email': sale.customer?.email || 'N/A',
                'Mobile': sale.customer?.mobile || 'N/A',
                'Payment Method': sale.paymentMethod || 'N/A',
            }))
        );

        const headers = Object.keys(exportData[0] || {});
        const csvContent = [
            headers.join(','),
            ...exportData.map(row =>
                headers.map(header => {
                    const value = row[header as keyof typeof row];
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sales_page${currentPage}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading sales...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Track all sales transactions</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleExportToExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                        disabled={sales.length === 0}
                    >
                        <span className="mr-2">📥</span>
                        Export to Excel
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                        <span className="mr-2">➕</span>
                        Record Sale
                    </button>
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
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
                        {/* Search */}
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Sales
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by product, customer, payment method..."
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
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div ref={tableRef} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Products
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.map((sale) => {
                                const isExpanded = expandedSales.has(sale._id);
                                const displayItems = isExpanded ? sale.items : sale.items.slice(0, 2);
                                const hasMore = sale.items.length > 2;

                                return (
                                    <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(sale.saleDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {displayItems.map((item, idx) => (
                                                <div key={idx} className="text-sm">
                                                    <span className="font-medium text-gray-900">{item.productName}</span>
                                                    <span className="text-gray-500"> × {item.quantity}</span>
                                                </div>
                                            ))}
                                            {hasMore && !isExpanded && (
                                                <button
                                                    onClick={() => setExpandedSales(prev => new Set(prev).add(sale._id))}
                                                    className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                                                >
                                                    ...more ({sale.items.length - 2} more)
                                                </button>
                                            )}
                                            {hasMore && isExpanded && (
                                                <button
                                                    onClick={() => {
                                                        const newSet = new Set(expandedSales);
                                                        newSet.delete(sale._id);
                                                        setExpandedSales(newSet);
                                                    }}
                                                    className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                                                >
                                                    show less
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {sale.customer?.name || 'N/A'}
                                            </div>
                                            {sale.customer?.email && (
                                                <div className="text-xs text-gray-500">
                                                    {sale.customer.email}
                                                </div>
                                            )}
                                            {sale.customer?.mobile && (
                                                <div className="text-xs text-gray-500">
                                                    {sale.customer.mobile}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(sale.totalAmount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {sale.paymentMethod || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleOpenModal(sale)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sale._id)}
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
                    {sales.map((sale) => {
                        const isExpanded = expandedSales.has(sale._id);
                        const displayItems = isExpanded ? sale.items : sale.items.slice(0, 2);
                        const hasMore = sale.items.length > 2;

                        return (
                            <div key={sale._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-600 mb-1">
                                            {new Date(sale.saleDate).toLocaleDateString()}
                                        </div>
                                        {displayItems.map((item, idx) => (
                                            <div key={idx} className="text-base font-medium text-gray-900">
                                                {item.productName} × {item.quantity}
                                            </div>
                                        ))}
                                        {hasMore && !isExpanded && (
                                            <button
                                                onClick={() => setExpandedSales(prev => new Set(prev).add(sale._id))}
                                                className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                                            >
                                                ...more ({sale.items.length - 2} more)
                                            </button>
                                        )}
                                        {hasMore && isExpanded && (
                                            <button
                                                onClick={() => {
                                                    const newSet = new Set(expandedSales);
                                                    newSet.delete(sale._id);
                                                    setExpandedSales(newSet);
                                                }}
                                                className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                                            >
                                                show less
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(sale.totalAmount)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm">
                                    <div className="text-gray-600">
                                        Customer: {sale.customer?.name || 'N/A'}
                                    </div>
                                    <div className="text-gray-600">
                                        Payment: {sale.paymentMethod || 'N/A'}
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(sale)}
                                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sale._id)}
                                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {sales.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm ? 'No sales found matching your search.' : 'No sales found.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="bg-white rounded-lg shadow px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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

                        <div className="flex items-center gap-6">
                            <div className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} sales
                            </div>

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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingSale ? 'Edit Sale' : 'Record New Sale'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Sale Items */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Products
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addSaleItem}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        + Add Product
                                    </button>
                                </div>
                                {saleItems.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-3 items-start">
                                        <div className="flex-1">
                                            <select
                                                value={item.productId}
                                                onChange={(e) => handleProductChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                {products.map(product => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.name} - {CURRENCY_SYMBOL}{product.costPrice.toFixed(2)} (Stock: {product.stock})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Qty"
                                                required
                                            />
                                        </div>
                                        <div className="w-32 flex items-center">
                                            <span className="text-sm font-medium text-gray-700">
                                                {CURRENCY_SYMBOL}{item.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        {saleItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSaleItem(index)}
                                                className="px-3 py-2 text-red-600 hover:text-red-800"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                        <span className="text-2xl font-bold text-indigo-600">
                                            {formatCurrency(calculateTotal())}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sale Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sale Date
                                </label>
                                <input
                                    type="date"
                                    value={saleDate}
                                    onChange={(e) => setSaleDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Customer Information */}
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information (Optional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.name || ''}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Customer name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={customerInfo.email || ''}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="customer@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerInfo.mobile || ''}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            PAN / Voter ID
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.panOrVoterId || ''}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, panOrVoterId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="PAN or Voter ID"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select payment method</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Net Banking">Net Banking</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Additional notes..."
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
                                    disabled={submitting || saleItems.filter(item => item.productId).length === 0}
                                >
                                    {submitting ? 'Saving...' : editingSale ? 'Update Sale' : 'Record Sale'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
