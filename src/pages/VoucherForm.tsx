import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import { useVoucher } from '../contexts/VoucherContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Toast } from '../components/ui/Toast';

// Yup validation schema
const voucherSchema = yup.object({
  voucher_code: yup
    .string()
    .required('Voucher code is required')
    .matches(/^[A-Z0-9]+$/, 'Voucher code must be alphanumeric uppercase')
    .max(50, 'Voucher code must not exceed 50 characters'),
  discount_percent: yup
    .number()
    .required('Discount percentage is required')
    .min(1, 'Discount must be at least 1%')
    .max(100, 'Discount must not exceed 100%')
    .typeError('Discount must be a valid number'),
  expiry_date: yup
    .string()
    .required('Expiry date is required')
    .test('is-future', 'Expiry date must be today or in the future', (value) => {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
});

type VoucherFormData = yup.InferType<typeof voucherSchema>;

const VoucherForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    getVoucher,
    createVoucher,
    updateVoucher,
    isLoading: contextLoading,
  } = useVoucher();

  const [apiError, setApiError] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  // React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<VoucherFormData>({
    resolver: yupResolver(voucherSchema),
    mode: 'onBlur',
  });

  // Fetch voucher data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchVoucher = async () => {
        setIsLoadingData(true);
        try {
          const voucher = await getVoucher(Number(id));

          const formattedDate = voucher.expiry_date.split('T')[0];

          setValue('voucher_code', voucher.voucher_code);
          setValue('discount_percent', voucher.discount_percent);
          setValue('expiry_date', formattedDate);
        } catch (error: any) {
          setApiError(error?.message || 'Failed to load voucher');
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchVoucher();
    }
  }, [isEditMode, id, getVoucher, setValue]);

  const onSubmit = async (data: VoucherFormData) => {
    setApiError('');

    try {
      if (isEditMode && id) {
        await updateVoucher(Number(id), {
          voucher_code: data.voucher_code,
          discount_percent: data.discount_percent,
          expiry_date: data.expiry_date,
        });
        navigate('/vouchers', {
          state: { message: 'Voucher updated successfully!', variant: 'success' }
        });
      } else {
        await createVoucher({
          voucher_code: data.voucher_code,
          discount_percent: data.discount_percent,
          expiry_date: data.expiry_date,
        });
        navigate('/vouchers', {
          state: { message: 'Voucher created successfully!', variant: 'success' }
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save voucher. Please try again.';
      setApiError(errorMessage);
      setToast({
        message: errorMessage,
        variant: 'error',
      });
    }
  };

  // Show loading spinner while fetching data in edit mode
  if (isLoadingData) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner variant="spinner" size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/vouchers')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Vouchers</span>
        </button>
        <h1 className="text-3xl font-bold text-text-primary">
          {isEditMode ? 'Edit Voucher' : 'Create New Voucher'}
        </h1>
        <p className="text-text-secondary mt-2">
          {isEditMode ? 'Update voucher details' : 'Add a new voucher to the system'}
        </p>
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="mb-6">
          <Alert
            variant="error"
            title="Error"
            description={apiError}
            onClose={() => setApiError('')}
          />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="space-y-6">
            {/* Voucher Code */}
            <Input
              label="Voucher Code"
              type="text"
              placeholder="e.g. SUMMER2025"
              error={errors.voucher_code?.message}
              helperText="Alphanumeric uppercase only (e.g. SAVE20, DEAL100)"
              disabled={isEditMode}
              {...register('voucher_code', {
                setValueAs: (value) => value.toUpperCase(),
              })}
            />

            {/* Discount Percentage */}
            <Input
              label="Discount Percentage"
              type="number"
              placeholder="e.g. 15"
              error={errors.discount_percent?.message}
              helperText="Enter a value between 1 and 100"
              step="0.01"
              {...register('discount_percent', {
                valueAsNumber: true,
              })}
            />

            {/* Expiry Date */}
            <Input
              label="Expiry Date"
              type="date"
              error={errors.expiry_date?.message}
              helperText="The date when this voucher will expire"
              {...register('expiry_date')}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/vouchers')}
            disabled={isSubmitting || contextLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting || contextLoading}
            disabled={isSubmitting || contextLoading}
          >
            {isSubmitting || contextLoading
              ? 'Saving...'
              : isEditMode
              ? 'Update Voucher'
              : 'Create Voucher'}
          </Button>
        </div>
      </form>

      {/* Toast Notification - Only for errors */}
      {toast && toast.variant === 'error' && (
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
};

export default VoucherForm;
