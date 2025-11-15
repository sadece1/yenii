import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { referenceBrandService, ReferenceBrand, CreateReferenceBrandData, UpdateReferenceBrandData } from '@/services/referenceBrandService';

export const AdminReferenceBrandsPage = () => {
  const [brands, setBrands] = useState<ReferenceBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    display_order: 0,
    is_active: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await referenceBrandService.getAllBrands();
      setBrands(data);
    } catch (error) {
      console.error('Failed to load brands, using empty data:', error);
      // Backend yok, boş liste kullan
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website_url: '',
      display_order: 0,
      is_active: true,
    });
    setLogoFile(null);
    setPreviewUrl(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      alert('Lütfen marka adı girin');
      return;
    }

    if (!logoFile) {
      alert('Lütfen logo seçin');
      return;
    }

    try {
      const createData: CreateReferenceBrandData = {
        name: formData.name,
        description: formData.description,
        website_url: formData.website_url,
        display_order: formData.display_order,
        is_active: formData.is_active,
        logo: logoFile,
      };

      await referenceBrandService.createBrand(createData);
      alert('Marka başarıyla eklendi');
      resetForm();
      loadBrands();
    } catch (error: any) {
      console.error('Failed to create brand:', error);
      alert(error.response?.data?.message || 'Marka eklenemedi');
    }
  };

  const handleEdit = (brand: ReferenceBrand) => {
    setEditingId(brand.id);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website_url: brand.website_url || '',
      display_order: brand.display_order,
      is_active: brand.is_active,
    });
    setPreviewUrl(`${import.meta.env.VITE_API_URL}${brand.logo_url}`);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    if (!formData.name.trim()) {
      alert('Lütfen marka adı girin');
      return;
    }

    try {
      const updateData: UpdateReferenceBrandData = {
        name: formData.name,
        description: formData.description,
        website_url: formData.website_url,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (logoFile) {
        updateData.logo = logoFile;
      }

      await referenceBrandService.updateBrand(editingId, updateData);
      alert('Marka başarıyla güncellendi');
      resetForm();
      loadBrands();
    } catch (error: any) {
      console.error('Failed to update brand:', error);
      alert(error.response?.data?.message || 'Marka güncellenemedi');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu markayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await referenceBrandService.deleteBrand(id);
      alert('Marka başarıyla silindi');
      loadBrands();
    } catch (error: any) {
      console.error('Failed to delete brand:', error);
      alert(error.response?.data?.message || 'Marka silinemedi');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await referenceBrandService.toggleBrandStatus(id);
      alert('Marka durumu güncellendi');
      loadBrands();
    } catch (error: any) {
      console.error('Failed to toggle status:', error);
      alert(error.response?.data?.message || 'Durum güncellenemedi');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEO title="Referans Marka Yönetimi" description="Referans marka logolarını yönetin" />
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-5xl">🏷️</span>
              Referans Marka Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Partner ve referans marka logolarını yönetin
            </p>
          </div>
          {!isAdding && !editingId && (
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              + Yeni Marka Ekle
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {(isAdding || editingId) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {editingId ? 'Marka Düzenle' : 'Yeni Marka Ekle'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Marka Adı *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Coleman, MSR..."
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Marka hakkında kısa açıklama..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <Input
                    label="Website URL"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://example.com"
                    type="url"
                  />

                  <Input
                    label="Sıralama"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    type="number"
                    min="0"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Aktif
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo {!editingId && '*'}
                  </label>
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-contain mx-auto rounded-lg bg-gray-50 dark:bg-gray-700"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLogoFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          Logoyu Kaldır
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer inline-flex flex-col items-center"
                        >
                          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tıklayarak logo seçin
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            PNG, JPG, WEBP (Max 5MB)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="primary"
                  onClick={editingId ? handleUpdate : handleAdd}
                >
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  İptal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brands List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {brands.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Marka
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sıra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {brands.map((brand) => (
                    <motion.tr
                      key={brand.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${brand.logo_url}`}
                          alt={brand.name}
                          className="w-16 h-16 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {brand.name}
                          </div>
                          {brand.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {brand.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {brand.website_url ? (
                          <a
                            href={brand.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            Website →
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {brand.display_order}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(brand.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            brand.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {brand.is_active ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(brand)}
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(brand.id)}
                          >
                            Sil
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Henüz referans marka eklenmemiş
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

