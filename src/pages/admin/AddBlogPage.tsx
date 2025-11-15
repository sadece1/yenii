import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { SEO } from '@/components/SEO';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { RichTextEditor } from '@/components/RichTextEditor';
import { routes } from '@/config';
import { useBlogStore } from '@/store/blogStore';
import { blogService } from '@/services/blogService';
import { uploadService } from '@/services/uploadService';
import { BlogPost } from '@/types';

interface ContentSection {
  id: string;
  type: 'text' | 'image';
  content: string;
  uploading?: boolean;
}

export const AddBlogPage = () => {
  const navigate = useNavigate();
  const { addBlog, isLoading } = useBlogStore();
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [selectedRecommendedPosts, setSelectedRecommendedPosts] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>();

  // Load all blogs for recommended posts selection
  useEffect(() => {
    const loadAllBlogs = async () => {
      try {
        const response = await blogService.getBlogs({}, 1); // Get all blogs (default page size should be enough)
        // Get all pages if needed
        let allData = [...response.data];
        if (response.totalPages > 1) {
          for (let page = 2; page <= response.totalPages; page++) {
            const pageResponse = await blogService.getBlogs({}, page);
            allData = [...allData, ...pageResponse.data];
          }
        }
        setAllBlogs(allData);
      } catch (error) {
        console.error('Failed to load blogs for recommendations:', error);
      }
    };
    loadAllBlogs();
  }, []);

  const onSubmit = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      let finalImageUrl = imageUrl;

      // Upload image if a file is selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadedFile = await uploadService.uploadImage(imageFile);
          finalImageUrl = uploadService.getFileUrl(uploadedFile.path);
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert('Resim yüklenirken hata oluştu. Lütfen tekrar deneyin.');
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      if (!finalImageUrl || finalImageUrl.trim() === '') {
        alert('Lütfen bir kapak resmi ekleyin!');
        return;
      }

      // Combine content sections into HTML
      let finalContent = data.content || '';
      
      // Add content sections after the main content
      if (contentSections.length > 0) {
        const sectionsHtml = contentSections.map(section => {
          if (section.type === 'image') {
            return `<img src="${section.content}" alt="Blog içerik görseli" />`;
          } else {
            return section.content;
          }
        }).join('\n\n');
        
        finalContent = finalContent + '\n\n' + sectionsHtml;
      }

      await addBlog({
        ...data,
        content: finalContent,
        image: finalImageUrl,
        publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
        readTime: data.readTime || 5,
        views: 0,
        recommendedPosts: selectedRecommendedPosts.length > 0 ? selectedRecommendedPosts : undefined,
      });
      navigate(routes.adminBlogs);
    } catch (error) {
      alert('Blog eklenemedi');
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addTextSection = () => {
    const newSection: ContentSection = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
    };
    setContentSections([...contentSections, newSection]);
  };

  const addImageSection = async (file: File) => {
    const tempId = Date.now().toString();
    
    // Add temporary section with uploading state
    const tempSection: ContentSection = {
      id: tempId,
      type: 'image',
      content: '',
      uploading: true,
    };
    setContentSections([...contentSections, tempSection]);
    
    try {
      const uploadedFile = await uploadService.uploadImage(file);
      const url = uploadService.getFileUrl(uploadedFile.path);
      
      // Update section with uploaded URL
      setContentSections(prev => prev.map(section => 
        section.id === tempId 
          ? { ...section, content: url, uploading: false }
          : section
      ));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Resim yüklenirken hata oluştu.');
      // Remove failed section
      setContentSections(prev => prev.filter(section => section.id !== tempId));
    }
  };

  const updateSectionContent = (id: string, content: string) => {
    setContentSections(prev => prev.map(section => 
      section.id === id ? { ...section, content } : section
    ));
  };

  const removeSection = (id: string) => {
    setContentSections(contentSections.filter(section => section.id !== id));
  };

  const moveSectionUp = (id: string) => {
    const index = contentSections.findIndex(s => s.id === id);
    if (index > 0) {
      const newSections = [...contentSections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      setContentSections(newSections);
    }
  };

  const moveSectionDown = (id: string) => {
    const index = contentSections.findIndex(s => s.id === id);
    if (index < contentSections.length - 1) {
      const newSections = [...contentSections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setContentSections(newSections);
    }
  };

  return (
    <>
      <SEO title="Yeni Blog Yazısı Ekle" description="Yeni blog yazısı ekleyin" />
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Yeni Blog Yazısı Ekle
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Input
              label="Başlık"
              {...register('title', { required: 'Başlık gereklidir' })}
              error={errors.title?.message}
            />

            <Input
              label="Özet"
              {...register('excerpt', { required: 'Özet gereklidir' })}
              error={errors.excerpt?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İçerik
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                📝 Word gibi yazın! Resimler için aşağıdaki "İçerik Resimleri" bölümünden yükleyip kodu kopyalayın.
              </p>
              <Controller
                name="content"
                control={control}
                rules={{ required: 'İçerik gereklidir' }}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Blog içeriğinizi buraya yazın... Başlıklar, listeler ve formatlamalar için üstteki araç çubuğunu kullanın."
                    error={errors.content?.message}
                  />
                )}
              />
            </div>

            {/* Alternating Layout Sections */}
            <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg p-6 bg-primary-50 dark:bg-primary-900/10">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                📸 Alternating Layout (Sağ-Sol Yerleşim)
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Yazı ve resimlerinizi sırayla ekleyin. Blog detayında otomatik sağ-sol layout ile gösterilecek.
              </p>

              {/* Add Section Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={addTextSection}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  📝 Yazı Ekle
                </button>
                <label className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  🖼️ Resim Ekle
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        addImageSection(e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>

              {/* Sections List */}
              {contentSections.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Eklenen Bölümler ({contentSections.length}):
                  </p>
                  {contentSections.map((section, index) => (
                    <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-medium">
                            #{index + 1}
                          </span>
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                            {section.type === 'text' ? '📝 Yazı' : '🖼️ Resim'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveSectionUp(section.id)}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                            title="Yukarı Taşı"
                          >
                            ⬆️
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSectionDown(section.id)}
                            disabled={index === contentSections.length - 1}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                            title="Aşağı Taşı"
                          >
                            ⬇️
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Sil"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {section.type === 'text' ? (
                        <RichTextEditor
                          value={section.content}
                          onChange={(value) => updateSectionContent(section.id, value)}
                          placeholder="Metin içeriği yazın..."
                        />
                      ) : (
                        <div>
                          {section.uploading ? (
                            <div className="flex items-center justify-center h-40 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                            </div>
                          ) : (
                            <img 
                              src={section.content} 
                              alt={`Bölüm ${index + 1}`}
                              className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 Nasıl Kullanılır:</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  1. "📝 Yazı Ekle" ile metin bölümü ekleyin<br/>
                  2. "🖼️ Resim Ekle" ile resim yükleyin<br/>
                  3. Sıralamayı ok tuşları ile değiştirin<br/>
                  4. Blog detayında otomatik olarak sağ-sol alternating layout ile görünecek!
                </p>
              </div>
            </div>

            <Input
              label="Yazar"
              {...register('author', { required: 'Yazar gereklidir' })}
              error={errors.author?.message}
            />

            <Input
              label="Kategori"
              {...register('category', { required: 'Kategori gereklidir' })}
              error={errors.category?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resim
              </label>
              
              {/* Dosya Yükleme */}
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                />
                {imageFile && (
                  <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Seçilen: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                )}
              </div>

              {/* URL Ekleme (İsteğe Bağlı) */}
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Veya URL ile ekle (İsteğe Bağlı)
                </summary>
                <div className="mt-2">
                  <Input
                    label="Resim URL"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </details>

              {(!imageFile && !imageUrl) && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Lütfen bir resim yükleyin veya URL ekleyin
                </p>
              )}
            </div>

            <Input
              label="Okuma Süresi (dakika)"
              type="number"
              {...register('readTime', { required: 'Okuma süresi gereklidir', valueAsNumber: true })}
              error={errors.readTime?.message}
            />

            <Input
              label="Yayın Tarihi"
              type="date"
              {...register('publishedAt', { 
                required: 'Yayın tarihi gereklidir',
                valueAsDate: false
              })}
              error={errors.publishedAt?.message}
              defaultValue={new Date().toISOString().split('T')[0]}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('featured')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Öne Çıkar
              </label>
            </div>

            {/* Recommended Posts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Önerilen Blog Yazıları (En fazla 4 blog seçebilirsiniz)
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700">
                {allBlogs.length > 0 ? (
                  allBlogs.map((blog) => (
                    <div key={blog.id} className="flex items-center space-x-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRecommendedPosts.includes(blog.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedRecommendedPosts.length < 4) {
                              setSelectedRecommendedPosts([...selectedRecommendedPosts, blog.id]);
                            } else {
                              alert('En fazla 4 blog seçebilirsiniz!');
                            }
                          } else {
                            setSelectedRecommendedPosts(selectedRecommendedPosts.filter(id => id !== blog.id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        disabled={!selectedRecommendedPosts.includes(blog.id) && selectedRecommendedPosts.length >= 4}
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                        {blog.title}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Henüz başka blog yazısı bulunmuyor</p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Seçilen: {selectedRecommendedPosts.length} / 4 blog
              </p>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="primary" isLoading={isLoading || uploadingImage}>
                {uploadingImage ? 'Resim Yükleniyor...' : 'Kaydet'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(routes.adminBlogs)}
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

