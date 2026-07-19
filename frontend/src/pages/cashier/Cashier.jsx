import { useEffect, useState } from 'react';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useDebounce from '../../hooks/useDebounce';
import useAuth from '../../hooks/useAuth';
import useTransactions from '../../hooks/useTransactions';
import Card from '../../components/ui/Card';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import ReceiptModal from './components/ReceiptModal';

export default function Cashier() {
  const { products, loading, fetchProducts } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const { addToCart } = useTransactions();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [activeCategory, setActiveCategory] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts({ search: debouncedSearch, category: activeCategory, isActive: true });
  }, [fetchProducts, debouncedSearch, activeCategory]);

  const handleCheckoutSuccess = (transaction) => {
    setLastTransaction(transaction);
    setReceiptOpen(true);
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:h-[calc(100vh-160px)] lg:grid-cols-[1fr_380px]">
      <Card className="min-h-[420px] lg:overflow-hidden">
        <ProductGrid
          products={products}
          categories={categories}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onProductClick={addToCart}
        />
      </Card>

      <Card className="lg:overflow-hidden">
        <CartPanel onCheckoutSuccess={handleCheckoutSuccess} />
      </Card>

      <ReceiptModal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        transaction={lastTransaction}
        cashierName={user?.name}
      />
    </div>
  );
}
