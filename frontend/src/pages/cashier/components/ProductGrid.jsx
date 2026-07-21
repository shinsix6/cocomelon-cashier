import { HiOutlineMagnifyingGlass, HiOutlineCube } from 'react-icons/hi2';
import { formatCurrency } from '../../../utils/format';
import { cn } from '../../../utils/cn';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SkeletonGrid } from '../../../components/loading/Skeleton';

export default function ProductGrid({
  products,
  categories,
  loading,
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onProductClick,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-3">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari produk atau scan barcode..."
          className="input-base pl-9"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onCategoryChange('')}
          className={cn(
            'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition',
            activeCategory === ''
              ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
        >
          Semua
        </button>
        {categories.map((cat) => {
          const id = cat._id ?? cat.id;
          return (
            <button
              key={id}
              onClick={() => onCategoryChange(id)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition',
                activeCategory === id
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {loading ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <EmptyState icon={HiOutlineCube} title="Produk tidak ditemukan" description="Coba kata kunci atau kategori lain." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const id = product._id ?? product.id;
              const outOfStock = product.stock != null && product.stock <= 0;
              return (
                <button
                  key={id}
                  disabled={outOfStock}
                  onClick={() => onProductClick(product)}
                  className={cn(
                    'card card-hover group relative flex flex-col overflow-hidden p-2.5 text-left transition',
                    outOfStock ? 'cursor-not-allowed opacity-50' : 'active:scale-[0.97]'
                  )}
                >
                  <div className="mb-2 aspect-square w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <HiOutlineCube className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{product.name}</p>
                  <p className="text-sm font-semibold text-brand-600">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-gray-400">
                    {outOfStock ? 'Stok Habis' : `Stok: ${product.stock ?? '-'}`}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
