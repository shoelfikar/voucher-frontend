import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import voucherService, {
  type Voucher,
  type CreateVoucherRequest,
  type UpdateVoucherRequest,
  type VoucherQueryParams,
  type ImportResult,
  type BatchImportResult,
} from '../services/voucherService';

interface VoucherMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface VoucherContextType {
  vouchers: Voucher[];
  meta: VoucherMeta | null;
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  fetchVouchers: (params?: VoucherQueryParams) => Promise<void>;
  getVoucher: (id: number) => Promise<Voucher>;
  createVoucher: (data: CreateVoucherRequest) => Promise<Voucher>;
  updateVoucher: (id: number, data: UpdateVoucherRequest) => Promise<Voucher>;
  deleteVoucher: (id: number) => Promise<void>;

  // CSV operations
  importCSV: (file: File) => Promise<ImportResult>;
  importBatch: (vouchers: CreateVoucherRequest[]) => Promise<BatchImportResult>;
  exportCSV: () => Promise<void>;

  // Utility
  clearError: () => void;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export function VoucherProvider({ children }: { children: ReactNode }) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [meta, setMeta] = useState<VoucherMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all vouchers with pagination and filters
  const fetchVouchers = useCallback(async (params?: VoucherQueryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await voucherService.getAll(params);
      setVouchers(response.data.vouchers);
      setMeta(response.data.pagination);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch vouchers';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get single voucher by ID
  const getVoucher = useCallback(async (id: number): Promise<Voucher> => {
    setIsLoading(true);
    setError(null);

    try {
      const voucher = await voucherService.getById(id);
      return voucher;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch voucher';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new voucher
  const createVoucher = useCallback(async (data: CreateVoucherRequest): Promise<Voucher> => {
    setIsLoading(true);
    setError(null);

    try {
      const newVoucher = await voucherService.create(data);

      // Optionally refresh the list after creation
      // await fetchVouchers();

      return newVoucher;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create voucher';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update existing voucher
  const updateVoucher = useCallback(async (id: number, data: UpdateVoucherRequest): Promise<Voucher> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedVoucher = await voucherService.update(id, data);

      // Update voucher in local state
      setVouchers(prev =>
        prev.map(v => v.id === id ? updatedVoucher : v)
      );

      return updatedVoucher;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update voucher';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete voucher
  const deleteVoucher = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await voucherService.delete(id);

      // Remove voucher from local state
      setVouchers(prev => prev.filter(v => v.id !== id));

      // Update meta count
      if (meta) {
        setMeta({
          ...meta,
          total: meta.total - 1,
        });
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete voucher';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [meta]);

  // Import vouchers from CSV
  const importCSV = useCallback(async (file: File): Promise<ImportResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await voucherService.importCSV(file);

      // Refresh vouchers list after import
      await fetchVouchers();

      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to import CSV';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchVouchers]);

  // Import batch of vouchers
  const importBatch = useCallback(async (vouchers: CreateVoucherRequest[]): Promise<BatchImportResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await voucherService.uploadBatch(vouchers);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to import batch';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Export vouchers to CSV
  const exportCSV = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await voucherService.exportCSV();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vouchers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to export CSV';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    vouchers,
    meta,
    isLoading,
    error,
    fetchVouchers,
    getVoucher,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    importCSV,
    importBatch,
    exportCSV,
    clearError,
  };

  return <VoucherContext.Provider value={value}>{children}</VoucherContext.Provider>;
}

export function useVoucher() {
  const context = useContext(VoucherContext);
  if (context === undefined) {
    throw new Error('useVoucher must be used within a VoucherProvider');
  }
  return context;
}
