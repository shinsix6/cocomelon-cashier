import { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories harus digunakan di dalam <CategoryProvider>');
  }
  return context;
}

export default useCategories;
