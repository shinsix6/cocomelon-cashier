import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, TextArea } from '../ui/Input';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const colorOptions = [
  { name: 'emerald', hex: '#10b981' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'purple', hex: '#8b5cf6' },
  { name: 'red', hex: '#ef4444' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'orange', hex: '#f97316' },
];

export default function CategoryForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const [color, setColor] = useState(defaultValues?.color || colorOptions[0].name);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { name: '', description: '', ...defaultValues },
  });

  useEffect(() => {
    reset({ name: '', description: '', ...defaultValues });
    setColor(defaultValues?.color || colorOptions[0].name);
  }, [defaultValues, reset]);

  const submitHandler = (values) => {
    onSubmit({ ...values, color });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" id="category-form">
      <Input
        label="Nama Kategori"
        required
        placeholder="cth. Dessert"
        error={errors.name?.message}
        {...register('name', { required: 'Nama kategori wajib diisi' })}
      />
      <TextArea label="Deskripsi" placeholder="Deskripsi kategori..." {...register('description')} />

      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Warna Label
        </span>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((opt) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => setColor(opt.name)}
              className={cn(
                'h-8 w-8 rounded-full transition ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
                color === opt.name && 'ring-2 ring-gray-400'
              )}
              style={{ backgroundColor: opt.hex }}
              aria-label={opt.name}
            />
          ))}
        </div>
      </div>

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
