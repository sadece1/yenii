import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { referenceImageService, ReferenceImage, CreateReferenceImageData, UpdateReferenceImageData } from '@/services/referenceImageService';

export const AdminReferenceImagesPage = () => {
  const [images, setImages] = useState<ReferenceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    year: '',
    display_order: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await referenceImageService.getAllImagesAdmin();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images, using empty data:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      year: '',
      display_order: 0,
      is_active: true,
    });
    setImageFile(null);
    setPreviewUrl(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.title.trim()) {
      alert('Lütfen başlık girin');
      return;
    }

    if (!imageFile) {
      alert('Lütfen resim seçin');
      return;
    }

    try {
      const createData: CreateReferenceImageData = {
        title: formData.title,
        location: formData.location,
        year: formData.year,
        display_order: formData.display_order,
        is_active: formData.is_active,
        image: imageFile,
      };

      await referenceImageService.createImage(createData);
      alert('Referans resmi başarıyla eklendi');
      resetForm();
      loadImages();
    } catch (error: any) {
      console.error('Failed to create image:', error);
      alert(error.message || 'Resim eklenemedi');
    }
  };

  const handleEdit = (image: ReferenceImage) => {
    setEditingId(image.id);
    setFormData({
      title: image.title,
      location: image.location || '',
      year: image.year || '',
      display_order: image.display_order,
      is_active: image.is_active,
    });
    setPreviewUrl(image.image_url);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    if (!formData.title.trim()) {
      alert('Lütfen başlık girin');
      return;
    }

    try {
      const updateData: UpdateReferenceImageData = {
        title: formData.title,
        location: formData.location,
        year: formData.year,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (imageFile) {
        updateData.image = imageFile;
      }

      await referenceImageService.updateImage(editingId, updateData);
      alert('Referans resmi başarıyla güncellendi');
      resetForm();
      loadImages();
    } catch (error: any) {
      console.error('Failed to update image:', error);
      alert(error.message || 'Resim güncellenemedi');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu referans resmini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await referenceImageService.deleteImage(id);
      alert('Referans resmi başarıyla silindi');
      loadImages();
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      alert(error.message || 'Resim silinemedi');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await referenceImageService.toggleImageStatus(id);
      alert('Resim durumu güncellendi');
      loadImages();
    } catch (error: any) {
      console.error('Failed to toggle status:', error);
      alert(error.message || 'Durum güncellenemedi');
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
      <SEO title="Referans Resim Yönetimi" description="Referans resimlerini yönetin" />
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-5xl">🖼️</span>
              Referans Resim Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              "Hizmet Verdiğimiz Yerler" bölümü için referans resimlerini yönetin
            </p>
          </div>
          {!isAdding && !editingId && (
            <Button variant="primary" onClick={() => setIsAdding(true)}>
              + Yeni Resim Ekle
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
                {editingId ? 'Resim Düzenle' : 'Yeni Resim Ekle'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Başlık *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: 2024 İstanbul"
                  />

                  <Input
                    label="Konum"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Örn: İstanbul, Türkiye"
                  />

                  <Input
                    label="Yıl"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="Örn: 2024"
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
                    Resim {!editingId && '*'}
                  </label>
                  
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-cover mx-auto rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImageFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          Resmi Kaldır
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex flex-col items-center"
                        >
                          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tıklayarak resim seçin
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

        {/* Images Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleStatus(image.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          image.is_active
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {image.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </div>

                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                      {image.location && (
                        <p className="text-sm text-gray-200">{image.location}</p>
                      )}
                      {image.year && (
                        <p className="text-xs text-gray-300 mt-1">{image.year}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Sıra: {image.display_order}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(image)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Henüz referans resim eklenmemiş
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};



