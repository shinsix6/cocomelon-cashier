import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineArrowRightOnRectangle,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');
}

const tabs = [
  { key: 'info', label: 'Data User', icon: HiOutlineUser },
  { key: 'edit', label: 'Edit Profil', icon: HiOutlineUser },
  { key: 'password', label: 'Ganti Password', icon: HiOutlineLockClosed },
];

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div>
      <PageHeader title="Profil" description="Kelola informasi akun dan keamanan Anda" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
            {getInitials(user?.name) || <HiOutlineUser className="h-8 w-8" />}
          </div>
          <p className="mt-3 font-display text-base font-semibold text-gray-900 dark:text-white">
            {user?.name || 'Pengguna'}
          </p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <Badge tone="success" className="mt-2 capitalize">
            {user?.role}
          </Badge>

          <div className="mt-5 w-full space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
                  activeTab === tab.key
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                )}
              >
                <tab.icon className="h-4.5 w-4.5" />
                {tab.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <HiOutlineArrowRightOnRectangle className="h-4.5 w-4.5" />
              Keluar
            </button>
          </div>
        </Card>

        <Card>
          {activeTab === 'info' && <InfoPanel user={user} />}
          {activeTab === 'edit' && <EditProfilePanel user={user} updateUser={updateUser} />}
          {activeTab === 'password' && <ChangePasswordPanel />}
        </Card>
      </div>
    </div>
  );
}

function InfoPanel({ user }) {
  const fields = [
    { label: 'Nama Lengkap', value: user?.name },
    { label: 'Email', value: user?.email },
    { label: 'Role', value: user?.role, className: 'capitalize' },
    { label: 'Nomor Telepon', value: user?.phone || '-' },
  ];
  return (
    <div>
      <h3 className="mb-4 font-display text-base font-semibold text-gray-800 dark:text-gray-100">Data User</h3>
      <dl className="divide-y divide-gray-100 dark:divide-gray-800">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between py-3 text-sm">
            <dt className="text-gray-400">{field.label}</dt>
            <dd className={cn('font-medium text-gray-800 dark:text-gray-100', field.className)}>
              {field.value || '-'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function EditProfilePanel({ user, updateUser }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const response = await authService.updateProfile(values);
      updateUser(response.data?.user || values);
      toast.success('Profil berhasil diperbarui');
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui profil');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="mb-4 font-display text-base font-semibold text-gray-800 dark:text-gray-100">Edit Profil</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <Input
          label="Nama Lengkap"
          required
          error={errors.name?.message}
          {...register('name', { required: 'Nama wajib diisi' })}
        />
        <Input
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email wajib diisi',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
          })}
        />
        <Input label="Nomor Telepon" placeholder="08xxxxxxxxxx" {...register('phone')} />
        <Button type="submit" loading={submitting}>
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
}

function ChangePasswordPanel() {
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await authService.changePassword(values);
      toast.success('Password berhasil diubah');
      reset();
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah password');
    } finally {
      setSubmitting(false);
    }
  };

  const eyeButton = (key) => (
    <button
      type="button"
      tabIndex={-1}
      onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
      className="absolute right-3.5 top-[38px] text-gray-400 hover:text-gray-600"
    >
      {show[key] ? <HiOutlineEyeSlash className="h-4.5 w-4.5" /> : <HiOutlineEye className="h-4.5 w-4.5" />}
    </button>
  );

  return (
    <div>
      <h3 className="mb-4 font-display text-base font-semibold text-gray-800 dark:text-gray-100">Ganti Password</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div className="relative">
          <Input
            label="Password Saat Ini"
            type={show.current ? 'text' : 'password'}
            required
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'Password saat ini wajib diisi' })}
          />
          {eyeButton('current')}
        </div>
        <div className="relative">
          <Input
            label="Password Baru"
            type={show.next ? 'text' : 'password'}
            required
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'Password baru wajib diisi',
              minLength: { value: 8, message: 'Password minimal 8 karakter' },
            })}
          />
          {eyeButton('next')}
        </div>
        <div className="relative">
          <Input
            label="Konfirmasi Password Baru"
            type={show.confirm ? 'text' : 'password'}
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Konfirmasi password wajib diisi',
              validate: (value) => value === newPassword || 'Konfirmasi password tidak cocok',
            })}
          />
          {eyeButton('confirm')}
        </div>
        <Button type="submit" loading={submitting}>
          Ubah Password
        </Button>
      </form>
    </div>
  );
}
