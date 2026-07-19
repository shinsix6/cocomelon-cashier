import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlinePhoto } from 'react-icons/hi2';
import { Input, Select, TextArea } from '../ui/Input';
import Button from '../ui/Button';

export default function ProductForm({ defaultValues, categories = [], onSubmit, onCancel, submitting }) {
  const [preview, setPreview] = useState(defaultValues?.image || null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      barcode: '',
      price: '',
      stock: '',
      description: '',
      isActive: true,
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      name: '',
      category: '',
      barcode: '',
      price: '',
      stock: '',
      description: '',
      isActive: true,
      ...defaultValues,
    });
    setPreview(defaultValues?.image || null);
  }, [defaultValues, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const submitHandler = (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append('image', imageFile);
    onSubmit(formData, values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" id="product-form">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <HiOutlinePhoto className="h-8 w-8 text-gray-300" />
          )}
        </div>
        <div>
          <label className="inline-flex cursor-pointer items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Unggah Foto
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          <p className="mt-1.5 text-xs text-gray-400">PNG atau JPG, maks 2MB</p>
        </div>
      </div>

      <Input
        label="Nama Produk"
        required
        placeholder="cth. Nasi Goreng Spesial"
        error={errors.name?.message}
        {...register('name', { required: 'Nama produk wajib diisi' })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Kategori"
          required
          error={errors.category?.message}
          {...register('category', { required: 'Kategori wajib dipilih' })}
        >
          <option value="">Pilih kategori</option>
          {categories.map((cat) => (
            <option key={cat._id ?? cat.id} value={cat._id ?? cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
        <Input label="Barcode" placeholder="899123400000" {...register('barcode')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Harga (Rp)"
          type="number"
          required
          placeholder="0"
          error={errors.price?.message}
          {...register('price', {
            required: 'Harga wajib diisi',
            min: { value: 0, message: 'Harga tidak boleh negatif' },
          })}
        />
        <Input
          label="Stok"
          type="number"
          required
          placeholder="0"
          error={errors.stock?.message}
          {...register('stock', {
            required: 'Stok wajib diisi',
            min: { value: 0, message: 'Stok tidak boleh negatif' },
          })}
        />
      </div>

      <TextArea label="Deskripsi" placeholder="Deskripsi produk..." {...register('description')} />

      <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500/40"
          {...register('isActive')}
        />
        Status Aktif
      </label>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" loading={submitting}>
          Simpan
        </Button>
      </div>
    </form>
  );
}
