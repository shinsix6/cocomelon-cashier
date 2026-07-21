import { HiOutlinePrinter } from 'react-icons/hi2';
import Modal from '../../../components/modal/Modal';
import Button from '../../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../../utils/format';

export default function ReceiptModal({ open, onClose, transaction, cashierName }) {
  if (!transaction) return null;

  const handlePrint = () => window.print();

  return (
    <Modal open={open} onClose={onClose} title="Detail Struk Transaksi" size="sm">
      <div id="receipt-print" className="font-mono text-sm text-gray-700 dark:text-gray-200">
        <div className="text-center">
          <p className="font-display text-base font-bold text-gray-900 dark:text-white">Cocomelon WEB</p>
          <p className="text-xs text-gray-400">Sistem Aplikasi Point of Sale (POS)</p>
          <p className="mt-1 text-xs text-gray-400">
            Nomor: {transaction.invoiceNumber || `TR-${(transaction._id ?? '').toString().slice(-8)}`}
          </p>
          <p className="text-xs text-gray-400">Tanggal: {formatDateTime(transaction.createdAt || new Date())}</p>
        </div>

        <div className="my-3 border-t border-dashed border-gray-300 dark:border-gray-700" />

        <div className="space-y-0.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Kasir</span>
            <span>{cashierName || 'Kasir'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pelanggan</span>
            <span>{transaction.customerName || 'Pelanggan Umum'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Metode Pembayaran</span>
            <span className="uppercase">{transaction.paymentMethod}</span>
          </div>
        </div>

        <div className="my-3 border-t border-dashed border-gray-300 dark:border-gray-700" />

        <p className="mb-1.5 text-xs font-semibold uppercase text-gray-400">Daftar Barang</p>
        <div className="space-y-1.5">
          {transaction.items?.map((item, i) => (
            <div key={i} className="text-xs">
              <div className="flex justify-between">
                <span>{item.name}</span>
                <span>{formatCurrency(item.price * item.qty)}</span>
              </div>
              <p className="text-gray-400">
                {item.qty} x {formatCurrency(item.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="my-3 border-t border-dashed border-gray-300 dark:border-gray-700" />

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Subtotal</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pajak</span>
            <span>{formatCurrency(transaction.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Diskon</span>
            <span>-{formatCurrency(transaction.discount)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white">
            <span>Total Bayar</span>
            <span>{formatCurrency(transaction.total)}</span>
          </div>
          {transaction.paymentMethod === 'cash' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Jumlah Bayar</span>
                <span>{formatCurrency(transaction.cashReceived)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-400">Kembalian</span>
                <span>{formatCurrency(transaction.change)}</span>
              </div>
            </>
          )}
        </div>

        <div className="my-3 border-t border-dashed border-gray-300 dark:border-gray-700" />
        <p className="text-center text-xs text-gray-400">Terima Kasih Atas Kunjungan Anda!</p>
      </div>

      <div className="mt-5 flex gap-2 print:hidden">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Tutup
        </Button>
        <Button icon={HiOutlinePrinter} onClick={handlePrint} className="flex-1">
          Cetak Struk
        </Button>
      </div>
    </Modal>
  );
}
