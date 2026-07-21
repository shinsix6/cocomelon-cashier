import { useEffect, useMemo, useState } from 'react';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineCube,
  HiOutlineChevronUpDown,
} from 'react-icons/hi2';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useDebounce from '../../hooks/useDebounce';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import Modal from '../../components/modal/Modal';
import ConfirmDialog from '../../components/modal/ConfirmDialog';
import ProductForm from '../../components/forms/ProductForm';
import Pagination from '../../components/tables/Pagination';
import { SkeletonTableRow } from '../../components/loading/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { formatCurrency, formatNumber } from '../../utils/format';

export default function Products() {
  const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } =
    useProducts();
  const { categories, fetchCategories } = useCategories();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts({ search: debouncedSearch, category: categoryFilter, page, limit });
  }, [fetchProducts, debouncedSearch, categoryFilter, page]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    list.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return list;
  }, [products, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const id = editingProduct?._id ?? editingProduct?.id;
      if (id) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      setModalOpen(false);
      fetchProducts({ search: debouncedSearch, category: categoryFilter, page, limit });
    } catch {
      // Toast error sudah ditangani di context/interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id ?? deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil((products.length ? page * limit : 0) / limit) || 1;

  return (
    <div>
      <PageHeader
        title="Manajemen Produk"
        description="Kelola daftar produk, harga, stok, dan kategori toko Anda"
        actions={
          <Button icon={HiOutlinePlus} onClick={openAddModal}>
            Tambah Produk
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-100 dark:border-gray-800 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari produk atau barcode..."
              className="input-base pl-9"
            />
          </div>
          <Select
            className="sm:w-52"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat._id ?? cat.id} value={cat._id ?? cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        {error ? (
          <div className="p-4">
            <ErrorState onRetry={() => fetchProducts({ search: debouncedSearch, category: categoryFilter, page, limit })} />
          </div>
        ) : !loading && sortedProducts.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={HiOutlineCube}
              title="Belum ada produk"
              description="Tambahkan produk pertama Anda untuk mulai berjualan."
              actionLabel="Tambah Produk"
              onAction={openAddModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wide text-gray-400">
                  <th className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort('name')}>
                    <span className="inline-flex items-center gap-1">
                      Produk <HiOutlineChevronUpDown className="h-3.5 w-3.5" />
                    </span>
                  </th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Barcode</th>
                  <th className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort('price')}>
                    <span className="inline-flex items-center gap-1">
                      Harga <HiOutlineChevronUpDown className="h-3.5 w-3.5" />
                    </span>
                  </th>
                  <th className="cursor-pointer select-none px-4 py-3" onClick={() => toggleSort('stock')}>
                    <span className="inline-flex items-center gap-1">
                      Stok <HiOutlineChevronUpDown className="h-3.5 w-3.5" />
                    </span>
                  </th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} columns={7} />)
                  : sortedProducts.map((product) => {
                      const id = product._id ?? product.id;
                      const lowStock = Number(product.stock) <= 5;
                      return (
                        <tr key={id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                                    <HiOutlineCube className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-gray-800 dark:text-gray-100">
                                  {product.name}
                                </p>
                                {product.description && (
                                  <p className="truncate text-xs text-gray-400 max-w-[200px]">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone="info">{product.categoryName || product.category?.name || '-'}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{product.barcode || '-'}</td>
                          <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
                            {formatCurrency(product.price)}
                          </td>
                          <td className={lowStock ? 'px-4 py-3 font-semibold text-amber-500' : 'px-4 py-3 text-gray-600 dark:text-gray-300'}>
                            {formatNumber(product.stock)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone={product.isActive ? 'success' : 'danger'} dot>
                              {product.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                                title="Lihat"
                              >
                                <HiOutlineEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(product)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800"
                                title="Edit"
                              >
                                <HiOutlinePencilSquare className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(product)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                                title="Hapus"
                              >
                                <HiOutlineTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && sortedProducts.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} total={products.length} limit={limit} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk'}
        size="lg"
      >
        <ProductForm
          defaultValues={editingProduct}
          categories={categories}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Produk"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
