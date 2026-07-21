import { useEffect, useMemo, useState } from 'react';
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineTag } from 'react-icons/hi2';
import useCategories from '../../hooks/useCategories';
import useDebounce from '../../hooks/useDebounce';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/modal/Modal';
import ConfirmDialog from '../../components/modal/ConfirmDialog';
import CategoryForm from '../../components/forms/CategoryForm';
import Pagination from '../../components/tables/Pagination';
import { SkeletonTableRow } from '../../components/loading/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { formatNumber } from '../../utils/format';

const colorHex = {
  emerald: '#10b981',
  blue: '#3b82f6',
  amber: '#f59e0b',
  pink: '#ec4899',
  purple: '#8b5cf6',
  red: '#ef4444',
  teal: '#14b8a6',
  orange: '#f97316',
};

export default function Categories() {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useCategories();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const limit = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories({ search: debouncedSearch });
  }, [fetchCategories, debouncedSearch]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return categories;
    return categories.filter((c) => c.name?.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [categories, debouncedSearch]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page]);

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const id = editingCategory?._id ?? editingCategory?.id;
      if (id) {
        await updateCategory(id, values);
      } else {
        await createCategory(values);
      }
      setModalOpen(false);
      fetchCategories({ search: debouncedSearch });
    } catch {
      // Toast error sudah ditangani di context
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget._id ?? deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Kategori"
        description="Kelola pengelompokan produk toko Anda"
        actions={
          <Button icon={HiOutlinePlus} onClick={openAddModal}>
            Tambah Kategori
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800 p-4">
          <div className="relative max-w-sm">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari kategori..."
              className="input-base pl-9"
            />
          </div>
        </div>

        {error ? (
          <div className="p-4">
            <ErrorState onRetry={() => fetchCategories({ search: debouncedSearch })} />
          </div>
        ) : !loading && paginated.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={HiOutlineTag}
              title="Belum ada kategori"
              description="Tambahkan kategori untuk mengelompokkan produk Anda."
              actionLabel="Tambah Kategori"
              onAction={openAddModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3">Jumlah Produk</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} columns={4} />)
                  : paginated.map((category) => {
                      const id = category._id ?? category.id;
                      return (
                        <tr key={id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: colorHex[category.color] || colorHex.emerald }}
                              />
                              <span className="font-medium text-gray-800 dark:text-gray-100">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{category.description || '-'}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                              {formatNumber(category.productCount ?? 0)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditModal(category)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800"
                                title="Edit"
                              >
                                <HiOutlinePencilSquare className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(category)}
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

        {!loading && !error && filtered.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination
              page={page}
              totalPages={Math.max(1, Math.ceil(filtered.length / limit))}
              total={filtered.length}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <CategoryForm
          defaultValues={editingCategory}
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
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
