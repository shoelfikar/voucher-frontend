import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Ticket, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { InputIcon } from '../components/ui/InputIcon';
import { Alert } from '../components/ui/Alert';

// Yup validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  // React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');

    try {
      await login(data.email, data.password);
      navigate('/vouchers');
    } catch (error: any) {
      const errorMessage = error?.message || 'Invalid email or password. Please try again.';
      setApiError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface shadow-card rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-soft rounded-full mb-4">
              <Ticket className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Voucher Management System
            </h1>
            <p className="text-text-secondary text-sm">
              Sign in to access your account
            </p>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div className="mb-6">
              <Alert
                variant="error"
                title="Login Failed"
                description={apiError}
                onClose={() => setApiError('')}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputIcon
              label="Email"
              type="email"
              error={errors.email?.message}
              placeholder="admin@example.com"
              autoComplete="email"
              leftIcon={<Mail className="w-5 h-5" />}
              {...register('email')}
            />

            <InputIcon
              label="Password"
              type={showPassword ? "text" : "password"}
              error={errors.password?.message}
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="medium"
              isLoading={isSubmitting}
              className="w-full mt-6"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
