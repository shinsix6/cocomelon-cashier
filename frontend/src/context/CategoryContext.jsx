import { createContext, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import categoryService from '../services/categoryService';

export const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAll(params);
      const data = response.data;
      setCategories(data.items ?? data.data ?? data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (payload) => {
    const response = await categoryService.create(payload);
    toast.success('Kategori berhasil disimpan');
    return response.data;
  }, []);

  const updateCategory = useCallback(async (id, payload) => {
    const response = await categoryService.update(id, payload);
    toast.success('Kategori berhasil diperbarui');
    return response.data;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await categoryService.remove(id);
    setCategories((prev) => prev.filter((c) => (c._id ?? c.id) !== id));
    toast.success('Kategori berhasil dihapus');
  }, []);

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory]
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}
