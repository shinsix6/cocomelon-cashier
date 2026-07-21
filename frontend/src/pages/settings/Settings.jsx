import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HiOutlineBuildingStorefront,
  HiOutlineUsers,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2';
import authService from '../../services/authService';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Modal from '../../components/modal/Modal';
import ConfirmDialog from '../../components/modal/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/loading/Skeleton';

export default function Settings() {
  return (
    <div className="space-y-5">
      <PageHeader title="Pengaturan" description="Kelola preferensi toko dan akun kasir" />
      <StoreSettingsCard />
      <CashierAccountsCard />
    </div>
  );
}

function StoreSettingsCard() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      storeName: 'Cocomelon WEB',
      address: '',
      taxRate: 10,
      receiptFooter: 'Terima Kasih Atas Kunjungan Anda!',
    },
  });

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      // Endpoint pengaturan toko dapat disesuaikan dengan backend, cth: PUT /settings
      toast.success('Pengaturan toko berhasil disimpan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <HiOutlineBuildingStorefront className="h-5 w-5 text-brand-600" />
        <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
          Informasi Toko
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nama Toko" required error={errors.storeName?.message} {...register('storeName', { required: 'Wajib diisi' })} />
        <Input label="Pajak Default (%)" type="number" {...register('taxRate')} />
        <Input label="Alamat Toko" className="sm:col-span-2" {...register('address')} />
        <Input label="Catatan Kaki Struk" className="sm:col-span-2" {...register('receiptFooter')} />
        <div className="sm:col-span-2">
          <Button type="submit" loading={submitting}>
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </Card>
  );
}

function CashierAccountsCard() {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCashiers = async () => {
    setLoading(true);
    try {
      const response = await authService.getCashiers();
      const data = response.data;
      setCashiers(data.items ?? data.data ?? data ?? []);
    } catch {
      setCashiers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashiers();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await authService.deleteCashier(deleteTarget._id ?? deleteTarget.id);
      toast.success('Akun kasir berhasil dihapus');
      setDeleteTarget(null);
      loadCashiers();
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus akun kasir');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center gap-2">
          <HiOutlineUsers className="h-5 w-5 text-brand-600" />
          <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">
            Manajemen Akun Kasir
          </h3>
        </div>
        <Button
          size="sm"
          icon={HiOutlinePlus}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Tambah Kasir
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : cashiers.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={HiOutlineUsers}
            title="Belum ada akun kasir"
            description="Tambahkan akun kasir agar mereka dapat login dan memproses transaksi."
            actionLabel="Tambah Kasir"
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {cashiers.map((cashier) => (
            <li key={cashier._id ?? cashier.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{cashier.name}</p>
                <p className="text-xs text-gray-400">{cashier.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={cashier.isActive ? 'success' : 'danger'} dot>
                  {cashier.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
                <button
                  onClick={() => {
                    setEditing(cashier);
                    setModalOpen(true);
                  }}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800"
                >
                  <HiOutlinePencilSquare className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(cashier)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CashierFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        submitting={submitting}
        setSubmitting={setSubmitting}
        onSaved={loadCashiers}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Akun Kasir"
        description={`Hapus akun kasir "${deleteTarget?.name}"? Kasir tidak akan bisa login lagi.`}
      />
    </Card>
  );
}

function CashierFormModal({ open, onClose, editing, submitting, setSubmitting, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', password: '' } });

  useEffect(() => {
    reset({ name: editing?.name || '', email: editing?.email || '', password: '' });
  }, [editing, reset, open]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await authService.updateCashier(editing._id ?? editing.id, values);
        toast.success('Akun kasir berhasil diperbarui');
      } else {
        await authService.createCashier({ ...values, role: 'kasir' });
        toast.success('Akun kasir berhasil ditambahkan');
      }
      onClose();
      onSaved();
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan akun kasir');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Akun Kasir' : 'Tambah Akun Kasir'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Input
          label={editing ? 'Password Baru (opsional)' : 'Password'}
          type="password"
          required={!editing}
          error={errors.password?.message}
          {...register('password', editing ? {} : { required: 'Password wajib diisi', minLength: { value: 8, message: 'Minimal 8 karakter' } })}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={submitting}>
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
