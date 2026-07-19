import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions harus digunakan di dalam <TransactionProvider>');
  }
  return context;
}

export default useTransactions;
