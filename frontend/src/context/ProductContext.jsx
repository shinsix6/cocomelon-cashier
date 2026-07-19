import { createContext, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import productService from '../services/productService';

export const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0 });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAll(params);
      const data = response.data;
      setProducts(data.items ?? data.data ?? data ?? []);
      setPagination((prev) => ({
        ...prev,
        page: data.page ?? params.page ?? prev.page,
        total: data.total ?? (Array.isArray(data) ? data.length : prev.total),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload) => {
    const response = await productService.create(payload);
    toast.success('Produk berhasil disimpan');
    return response.data;
  }, []);

  const updateProduct = useCallback(async (id, payload) => {
    const response = await productService.update(id, payload);
    toast.success('Produk berhasil diperbarui');
    return response.data;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await productService.remove(id);
    setProducts((prev) => prev.filter((p) => (p._id ?? p.id) !== id));
    toast.success('Produk berhasil dihapus');
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      pagination,
      setPagination,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, loading, error, pagination, fetchProducts, createProduct, updateProduct, deleteProduct]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
