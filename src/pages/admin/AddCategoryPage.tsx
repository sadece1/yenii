import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SEO } from '@/components/SEO';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { routes } from '@/config';
import { Category } from '@/types';
import { categoryManagementService } from '@/services/categoryManagementService';

export const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>();

  useEffect(() => {
    const loadCategories = () => {
      setCategories(categoryManagementService.getAllCategories());
    };

    loadCategories();

    // Listen for category updates
    const handleCategoryUpdate = () => {
      loadCategories();
    };

    window.addEventListener('categoriesUpdated', handleCategoryUpdate);
    window.addEventListener('storage', handleCategoryUpdate);

    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoryUpdate);
      window.removeEventListener('storage', handleCategoryUpdate);
    };
  }, []);

  const onSubmit = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Normalize parentId: empty string should be null
      const normalizedData = {
        ...data,
        parentId: data.parentId && data.parentId.trim() !== '' ? data.parentId : null,
      };
      await categoryManagementService.createCategory(normalizedData);
      navigate(routes.adminCategories);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Kategori eklenemedi');
    }
  };

  const rootCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  return (
    <>
      <SEO title="Yeni Kategori Ekle" description="Yeni kategori ekleyin" />
      <AdminLayout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Yeni Kategori Ekle
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Input
              label="Kategori Adı"
              {...register('name', { required: 'Kategori adı gereklidir' })}
              error={errors.name?.message}
            />

            <Input
              label="Slug"
              {...register('slug', { required: 'Slug gereklidir' })}
              error={errors.slug?.message}
              placeholder="kategori-adi"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Açıklama
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Üst Kategori (İsteğe Bağlı)
              </label>
              <select
                {...register('parentId')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Ana Kategori</option>
                {rootCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="İkon (emoji)"
              {...register('icon')}
              placeholder="🏕️"
            />

            <Input
              label="Sıra"
              type="number"
              {...register('order', { valueAsNumber: true })}
              placeholder="0"
            />

            <div className="flex space-x-4">
              <Button type="submit" variant="primary">
                Kaydet
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(routes.adminCategories)}
              >
                İptal
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};

