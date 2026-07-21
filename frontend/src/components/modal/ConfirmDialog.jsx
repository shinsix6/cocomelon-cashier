import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import Modal from './Modal';
import Button from '../ui/Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus',
  description = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmLabel = 'Hapus',
  loading = false,
  tone = 'danger',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div
          className={
            tone === 'danger'
              ? 'flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10'
              : 'flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10'
          }
        >
          <HiOutlineExclamationTriangle
            className={tone === 'danger' ? 'h-6 w-6 text-red-500' : 'h-6 w-6 text-amber-500'}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Batal
        </Button>
        <Button
          variant={tone === 'danger' ? 'dangerSolid' : 'primary'}
          onClick={onConfirm}
          loading={loading}
          className="flex-1"
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
