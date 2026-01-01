// Application constants
export const ROUTES = {
  LOGIN: '/login',
  VOUCHERS: '/vouchers',
  VOUCHER_CREATE: '/vouchers/create',
  VOUCHER_EDIT: '/vouchers/edit',
  CSV_UPLOAD: '/vouchers/upload',
} as const;

export const PAGE_SIZES = [10, 25, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;
