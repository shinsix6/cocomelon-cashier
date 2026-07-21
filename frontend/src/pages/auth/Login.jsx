import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const user = await login(values);
      toast.success(`Selamat datang kembali, ${user?.name || 'Pengguna'}!`);

      const redirectTo =
        location.state?.from?.pathname || (user?.role === 'kasir' ? '/cashier' : '/dashboard');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Email atau password salah');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <HiOutlineEnvelope className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="email@contoh.com"
            className="input-base pl-10"
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
            })}
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 8 karakter"
            className="input-base pl-10 pr-10"
            {...register('password', {
              required: 'Password wajib diisi',
              minLength: { value: 8, message: 'Password minimal 8 karakter' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <HiOutlineEyeSlash className="h-4.5 w-4.5" /> : <HiOutlineEye className="h-4.5 w-4.5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500/40"
            {...register('rememberMe')}
          />
          Ingat Saya
        </label>
        <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Lupa password?
        </a>
      </div>

      <Button type="submit" loading={submitting} className="w-full" size="lg">
        Login
      </Button>

      <p className="text-center text-xs text-gray-400">
        Gunakan akun Admin atau Kasir yang telah didaftarkan oleh toko Anda.
      </p>
    </form>
  );
}
