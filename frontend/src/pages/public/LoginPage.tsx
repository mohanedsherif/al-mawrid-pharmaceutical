import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login as loginApi, getCurrentUser } from '../../api/authApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCredentials } from '../../store/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { extractRoleFromToken } from '../../utils/jwt';
import { firebaseAuthService } from '../../services/firebaseAuthService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoginError(null);
    
    try {
      const res = await loginApi(data);
      
      // Try to get role from token first, then from /me endpoint
      let role = extractRoleFromToken(res.accessToken);
      if (!role) {
        const userInfo = await getCurrentUser();
        role = userInfo?.role || 'USER';
      }
      
      dispatch(setCredentials({ 
        accessToken: res.accessToken, 
        refreshToken: res.refreshToken, 
        email: data.email,
        role: role
      }));

      // Authenticate with Firebase for Firestore access
      // This enables Firestore read/write operations
      try {
        await firebaseAuthService.signIn(data.email, data.password);
        console.log('Firebase authentication successful');
      } catch (firebaseError: any) {
        // Log but don't block login if Firebase auth fails
        // Firestore operations may still work if rules allow
        console.warn('Firebase authentication failed (non-critical):', firebaseError.message);
      }

      // Show success animation
      setIsSuccess(true);
      
      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Small delay for success animation
      setTimeout(() => {
        // Redirect admin to dashboard, others to intended page
        if (role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle connection errors (backend not running)
      const isConnectionError = error?.code === 'ERR_NETWORK' || 
                                error?.message === 'Network Error' ||
                                error?.message?.includes('ERR_CONNECTION_REFUSED');
      
      if (isConnectionError) {
        setLoginError('Cannot connect to server. Please make sure the backend server is running on port 8081.');
        return;
      }
      
      // Handle other errors
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 403) {
          errorMessage = data?.error || data?.message || 'Access denied. Your account may be disabled.';
        } else if (status === 401) {
          errorMessage = data?.error || data?.message || 'Invalid email or password.';
        } else if (status === 400) {
          errorMessage = data?.error || data?.message || 'Invalid request. Please check your credentials.';
        } else if (data?.error || data?.message) {
          errorMessage = data.error || data.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
      setError('root', { message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0F1E2E] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 animate-flow-gradient bg-[length:400%_400%]"></div>
      <div className="relative w-full max-w-md z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3 mb-6 group">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="AL-MAWRID Logo" 
                className="h-12 md:h-16 w-auto transition-opacity group-hover:opacity-80"
                onError={() => setLogoError(true)}
              />
            ) : null}
            <span className="text-2xl md:text-3xl font-heading font-bold text-primary-600 dark:text-primary-400 group-hover:text-cta-500 dark:group-hover:text-cta-400 transition-colors">
              AL-MAWRID
            </span>
          </Link>
        </div>

        <Card className="p-8 md:p-10 shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-[#16283D]/95">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-sm md:text-base">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">{loginError}</p>
                </div>
                <button
                  onClick={() => setLoginError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">Login successful! Redirecting...</p>
              </div>
            </div>
          )}
        
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  className="pl-12"
                  {...register('email')}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  className="pl-12 pr-12"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer transition-all"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          
            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isSubmitting}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? 'Signing in...' : isSuccess ? 'Success!' : 'Sign In'}
            </Button>
          </form>
        
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                New to LiftLab?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors group"
            >
              Create an account
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Card>

        {/* Additional Info */}
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

