import { useState } from 'react';
import {
  HiOutlineShoppingCart,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTrash,
  HiOutlineBanknotes,
  HiOutlineQrCode,
  HiOutlinePrinter,
} from 'react-icons/hi2';
import Button from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatCurrency } from '../../../utils/format';
import { PAYMENT_METHODS } from '../../../utils/constants';
import { cn } from '../../../utils/cn';
import useTransactions from '../../../hooks/useTransactions';

export default function CartPanel({ onCheckoutSuccess }) {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    discount,
    setDiscount,
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    subtotal,
    tax,
    grandTotal,
    change,
    checkout,
    submitting,
  } = useTransactions();

  const [customerName, setCustomerName] = useState('');

  const handleCheckout = async () => {
    const result = await checkout({ customerName });
    if (result) {
      onCheckoutSuccess?.(result);
      setCustomerName('');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <HiOutlineShoppingCart className="h-5 w-5 text-brand-600" />
        <h3 className="font-display text-base font-semibold text-gray-800 dark:text-gray-100">Keranjang</h3>
        <span className="ml-auto rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          {cart.length} item
        </span>
      </div>

      <Input
        placeholder="Nama pelanggan (opsional)"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="mb-3"
      />

      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800">
        {cart.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <EmptyState
              icon={HiOutlineShoppingCart}
              title="Keranjang kosong"
              description="Klik produk untuk menambahkan."
            />
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {cart.map((item) => (
              <li key={item.productId} className="flex items-center gap-2.5 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => decreaseQty(item.productId)}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <HiOutlineMinus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item.productId)}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <HiOutlinePlus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="shrink-0 rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Subtotal</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Diskon</span>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            className="w-28 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Pajak (10%)</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(tax)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-base">
          <span className="font-semibold text-gray-800 dark:text-gray-100">Total</span>
          <span className="font-bold text-brand-600">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => setPaymentMethod(PAYMENT_METHODS.CASH)}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition',
            paymentMethod === PAYMENT_METHODS.CASH
              ? 'border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/20'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
        >
          <HiOutlineBanknotes className="h-4 w-4" /> Tunai
        </button>
        <button
          onClick={() => setPaymentMethod(PAYMENT_METHODS.QRIS)}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition',
            paymentMethod === PAYMENT_METHODS.QRIS
              ? 'border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/20'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
        >
          <HiOutlineQrCode className="h-4 w-4" /> QRIS
        </button>
      </div>

      {paymentMethod === PAYMENT_METHODS.CASH ? (
        <div className="mt-3 space-y-2">
          <input
            type="number"
            min={0}
            placeholder="Jumlah bayar..."
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="input-base"
          />
          <div className="flex items-center justify-between rounded-xl bg-brand-50 dark:bg-brand-500/10 px-3.5 py-2.5 text-sm">
            <span className="text-brand-700 dark:text-brand-400">Kembalian</span>
            <span className="font-semibold text-brand-700 dark:text-brand-400">{formatCurrency(change)}</span>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-5 text-center">
          <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <HiOutlineQrCode className="h-14 w-14 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400">Tampilkan QRIS ini kepada pelanggan untuk dipindai</p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button variant="secondary" icon={HiOutlineTrash} onClick={clearCart} className="flex-1">
          Kosongkan
        </Button>
        <Button icon={HiOutlinePrinter} onClick={handleCheckout} loading={submitting} className="flex-[2]">
          Selesaikan Transaksi
        </Button>
      </div>
    </div>
  );
}
