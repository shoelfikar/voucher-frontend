import apiClient from '../lib/axios';

export interface Voucher {
  id: number;
  voucher_code: string;
  discount_percent: number;
  expiry_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface VoucherListResponse {
  status: string;
  data: {
    vouchers: Voucher[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface VoucherResponse {
  status: string;
  data: Voucher;
}

export interface CreateVoucherRequest {
  voucher_code: string;
  discount_percent: number;
  expiry_date: string;
}

export interface UpdateVoucherRequest {
  voucher_code?: string;
  discount_percent?: number;
  expiry_date?: string;
}

export interface VoucherQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ImportResult {
  total_rows: number;
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}

export interface BatchImportResult {
  total_received: number;
  inserted: number;
  duplicates: number;
  duplicate_codes: string[];
  errors: string[];
}

export interface ImportResponse {
  status: string;
  message: string;
  data: ImportResult;
}

class VoucherService {
  // Get all vouchers with pagination and filters
  async getAll(params?: VoucherQueryParams): Promise<VoucherListResponse> {
    const response = await apiClient.get<VoucherListResponse>('/vouchers', { params });
    return response.data;
  }

  // Get single voucher by ID
  async getById(id: number): Promise<Voucher> {
    const response = await apiClient.get<VoucherResponse>(`/vouchers/${id}`);
    return response.data.data;
  }

  // Create new voucher
  async create(data: CreateVoucherRequest): Promise<Voucher> {
    const response = await apiClient.post<VoucherResponse>('/vouchers', data);
    return response.data.data;
  }

  // Update existing voucher
  async update(id: number, data: UpdateVoucherRequest): Promise<Voucher> {
    const response = await apiClient.put<VoucherResponse>(`/vouchers/${id}`, data);
    return response.data.data;
  }

  // Delete voucher (soft delete)
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/vouchers/${id}`);
  }

  // Import vouchers from CSV
  async importCSV(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ImportResponse>('/vouchers/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Upload batch of vouchers
  async uploadBatch(vouchers: CreateVoucherRequest[]): Promise<BatchImportResult> {
    const response = await apiClient.post<{ status: string; data: BatchImportResult }>(
      '/vouchers/upload-batch',
      { vouchers }
    );
    return response.data.data;
  }

  // Export vouchers to CSV
  async exportCSV(): Promise<Blob> {
    const response = await apiClient.get('/vouchers/export', {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new VoucherService();
