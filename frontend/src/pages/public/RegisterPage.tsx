import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerApi, getCurrentUser } from '../../api/authApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCredentials } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { extractRoleFromToken } from '../../utils/jwt';
import { firebaseAuthService } from '../../services/firebaseAuthService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const res = await registerApi(data);
    
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

    // Create Firebase user account for Firestore access
    // This will create the user if they don't exist, or sign in if they do
    try {
      await firebaseAuthService.signIn(data.email, data.password);
      console.log('Firebase user created/authenticated successfully');
    } catch (firebaseError: any) {
      // Log but don't block registration if Firebase auth fails
      console.warn('Firebase authentication failed (non-critical):', firebaseError.message);
    }

    navigate('/');
  };

  return (
    <div className="container-narrow py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Create Account</h1>
          <p className="text-slate-600 dark:text-slate-400">Join LiftLab and start your fitness journey</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              error={errors.password?.message}
              helperText="Must be at least 8 characters"
              {...register('password')}
            />
            <label className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Show password</span>
            </label>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;

