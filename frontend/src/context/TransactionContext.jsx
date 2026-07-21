import { createContext, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import transactionService from '../services/transactionService';
import { PAYMENT_METHODS, TAX_RATE } from '../utils/constants';

export const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [cashReceived, setCashReceived] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = useCallback((product) => {
    const id = product._id ?? product.id;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === id);
      if (existing) {
        if (product.stock != null && existing.qty >= product.stock) {
          toast.error('Stok tidak mencukupi');
          return prev;
        }
        return prev.map((item) =>
          item.productId === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          qty: 1,
        },
      ];
    });
  }, []);

  const increaseQty = useCallback((productId) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        if (item.stock != null && item.qty >= item.stock) {
          toast.error('Stok tidak mencukupi');
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      })
    );
  }, []);

  const decreaseQty = useCallback((productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
    setCashReceived('');
    setPaymentMethod(PAYMENT_METHODS.CASH);
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const tax = useMemo(() => Math.round((subtotal - discount) * TAX_RATE), [subtotal, discount]);
  const grandTotal = useMemo(
    () => Math.max(subtotal - discount + tax, 0),
    [subtotal, discount, tax]
  );
  const change = useMemo(() => {
    const paid = Number(cashReceived) || 0;
    return Math.max(paid - grandTotal, 0);
  }, [cashReceived, grandTotal]);

  const checkout = useCallback(
    async ({ customerName } = {}) => {
      if (cart.length === 0) {
        toast.error('Keranjang masih kosong');
        return null;
      }
      if (paymentMethod === PAYMENT_METHODS.CASH && Number(cashReceived) < grandTotal) {
        toast.error('Nominal tunai kurang dari total belanja');
        return null;
      }

      setSubmitting(true);
      try {
        const payload = {
          items: cart.map((item) => ({
            product: item.productId,
            name: item.name,
            price: item.price,
            qty: item.qty,
          })),
          subtotal,
          discount,
          tax,
          total: grandTotal,
          paymentMethod,
          cashReceived: paymentMethod === PAYMENT_METHODS.CASH ? Number(cashReceived) : undefined,
          change: paymentMethod === PAYMENT_METHODS.CASH ? change : 0,
          customerName: customerName || 'Pelanggan Umum',
        };
        const response = await transactionService.create(payload);
        toast.success('Transaksi berhasil diselesaikan');
        clearCart();
        return response.data;
      } catch (err) {
        toast.error(err.message || 'Transaksi gagal diproses');
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [cart, subtotal, discount, tax, grandTotal, paymentMethod, cashReceived, change, clearCart]
  );

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionService.getAll(params);
      const data = response.data;
      setTransactions(data.items ?? data.data ?? data ?? []);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
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
      transactions,
      loading,
      error,
      fetchTransactions,
    }),
    [
      cart,
      addToCart,
      increaseQty,
      decreaseQty,
      removeFromCart,
      clearCart,
      discount,
      paymentMethod,
      cashReceived,
      subtotal,
      tax,
      grandTotal,
      change,
      checkout,
      submitting,
      transactions,
      loading,
      error,
      fetchTransactions,
    ]
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}
