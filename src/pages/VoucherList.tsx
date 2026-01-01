import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Upload, Edit, Trash2, Download, Search, X, FunnelPlus } from 'lucide-react';
import { useVoucher } from '../contexts/VoucherContext';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import type { Voucher } from '../services/voucherService';

export function VoucherList() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    vouchers,
    meta,
    isLoading,
    error,
    fetchVouchers,
    deleteVoucher,
    exportCSV,
    clearError,
  } = useVoucher();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterByExpiryDate, setFilterByExpiryDate] = useState(false);
  const [expiryDateDesc, setExpiryDateDesc] = useState(true);
  const [filterByDiscount, setFilterByDiscount] = useState(false);
  const [discountDesc, setDiscountDesc] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);

  // Show toast from navigation state (after add/edit voucher)
  useEffect(() => {
    if (location.state?.message) {
      setToast({
        message: location.state.message,
        variant: location.state.variant || 'success',
      });
      // Clear the navigation state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    // Cleanup function to clear timeout if searchQuery changes before delay completes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  // Fetch vouchers on mount and when filters change
  useEffect(() => {
    fetchVouchers({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchQuery,
      sort_by: sortBy,
      sort_order: sortOrder,
    });
  }, [currentPage, itemsPerPage, debouncedSearchQuery, sortBy, sortOrder, fetchVouchers]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleDelete = (voucher: Voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!voucherToDelete) return;

    setIsDeleting(true);
    try {
      await deleteVoucher(voucherToDelete.id);
      setIsDeleteModalOpen(false);
      setVoucherToDelete(null);
      setToast({
        message: 'Voucher deleted successfully!',
        variant: 'success',
      });
    } catch (err: any) {
      console.error('Failed to delete voucher:', err);
      setToast({
        message: err?.message || 'Failed to delete voucher. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setVoucherToDelete(null);
  };

  const handleExport = async () => {
    try {
      await exportCSV();
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Apply filter when checkbox changes
  useEffect(() => {
    // Priority: expiry_date > discount_percent > created_at
    if (filterByExpiryDate) {
      setSortBy('expiry_date');
      setSortOrder(expiryDateDesc ? 'desc' : 'asc');
    } else if (filterByDiscount) {
      setSortBy('discount_percent');
      setSortOrder(discountDesc ? 'desc' : 'asc');
    } else {
      setSortBy('created_at');
      setSortOrder('desc');
    }
  }, [filterByExpiryDate, filterByDiscount, expiryDateDesc, discountDesc]);

  const handleApplyFilter = () => {
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleToggleFilterBy = (filterType: 'expiry_date' | 'discount_percent') => {
    if (filterType === 'expiry_date') {
      setFilterByExpiryDate(!filterByExpiryDate);
    } else {
      setFilterByDiscount(!filterByDiscount);
    }
  };

  const handleToggleExpiryDateDesc = () => {
    setExpiryDateDesc(!expiryDateDesc);
  };

  const handleToggleDiscountDesc = () => {
    setDiscountDesc(!discountDesc);
  };

  // Define columns for DataTable
  const columns = [
    {
      key: 'id',
      header: 'No',
      sortable: false,
      render: (_item: Voucher, index?: number) => {
        const offset = (currentPage - 1) * itemsPerPage;
        return offset + (index ?? 0) + 1;
      },
    },
    {
      key: 'voucher_code',
      header: 'Voucher Code',
      sortable: false,
      render: (item: Voucher) => (
        <span className="font-bold">{item.voucher_code}</span>
      ),
    },
    {
      key: 'discount_percent',
      header: 'Discount',
      sortable: false,
      render: (item: Voucher) => `${item.discount_percent}%`,
    },
    {
      key: 'expiry_date',
      header: 'Expiry Date',
      sortable: false,
      render: (item: Voucher) => formatDate(item.expiry_date),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (item: Voucher) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/vouchers/edit/${item.id}`)}
            className="p-2 text-info hover:bg-info-soft rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-2 text-error hover:bg-error-soft rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Voucher Management</h1>
        <p className="text-text-secondary mt-2">
          Manage and track all your vouchers in one place
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <Alert
            variant="error"
            title="Error"
            description={error}
            onClose={clearError}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          variant="primary"
          onClick={() => navigate('/vouchers/new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Voucher
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/vouchers/upload')}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV
        </Button>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={isLoading || vouchers.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Search and Filters */}
      {!isLoading && vouchers.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search by voucher code..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-2 w-full border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-soft focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                  title="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                title="Filter options"
              >
                <FunnelPlus className="w-5 h-5 text-text-secondary" />
                <span className="text-sm text-text-secondary">Filter</span>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg py-2 z-10">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary">Sort By</p>
                  </div>

                  <div className="px-4 py-2 space-y-2">
                    {/* Filter by Expiry Date */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={filterByExpiryDate}
                          onChange={() => handleToggleFilterBy('expiry_date')}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary-soft"
                        />
                        <span className="text-sm text-text-primary">Expiry Date</span>
                      </label>
                      {filterByExpiryDate && (
                        <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 pl-8 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={expiryDateDesc}
                            onChange={handleToggleExpiryDateDesc}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary-soft"
                          />
                          <span className="text-sm text-text-secondary">Descending</span>
                        </label>
                      )}
                    </div>

                    {/* Filter by Discount */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={filterByDiscount}
                          onChange={() => handleToggleFilterBy('discount_percent')}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary-soft"
                        />
                        <span className="text-sm text-text-primary">Discount Percent</span>
                      </label>
                      {filterByDiscount && (
                        <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 pl-8 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={discountDesc}
                            onChange={handleToggleDiscountDesc}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary-soft"
                          />
                          <span className="text-sm text-text-secondary">Descending</span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-2 border-t border-border">
                    <button
                      onClick={handleApplyFilter}
                      className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && vouchers.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner variant="spinner" size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && vouchers.length === 0 && (
        <EmptyState
          title="No vouchers found"
          description="Create your first voucher to get started!"
          actionLabel="Create Voucher"
          onAction={() => navigate('/vouchers/create')}
        />
      )}

      {/* Data Table */}
      {(!isLoading || vouchers.length > 0) && vouchers.length > 0 && (
        <div className="bg-surface border border-border rounded-lg shadow-card overflow-hidden">
          {/* Table Container with fixed height for 10 items */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: 'calc(3.5rem + 10 * 3.25rem)'
            }}
          >
            <DataTable
              data={vouchers}
              columns={columns}
              searchable={false}
              disablePagination={true}
            />
          </div>

          {/* Pagination and Items Per Page */}
          <div className="border-t border-border px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Pagination */}
              {meta && meta.total_pages > 1 ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.total_pages}
                  onPageChange={handlePageChange}
                  showInfo
                  totalItems={meta.total}
                  itemsPerPage={itemsPerPage}
                />
              ) : (
                <div></div>
              )}

              {/* Items Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary whitespace-nowrap">Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="w-[70px] px-3 py-2 border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-soft focus:outline-none bg-surface"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Voucher"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              className="bg-error hover:bg-error/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          Are you sure you want to delete voucher{' '}
          <span className="font-bold text-text-primary">
            "{voucherToDelete?.voucher_code}"
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <Toast
            variant={toast.variant}
            message={toast.message}
            onClose={() => setToast(null)}
            autoClose={true}
            autoCloseDuration={3000}
          />
        </div>
      )}
    </div>
  );
}

export default VoucherList;
