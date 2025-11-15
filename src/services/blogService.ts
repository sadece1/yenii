import api from './api';
import { BlogPost, BlogFilters, PaginatedResponse } from '@/types';

const STORAGE_KEY = 'camp_blogs_storage';

// Initial mock blog data
const initialMockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Kamp Yaparken Dikkat Edilmesi Gerekenler: Güvenlik Rehberi',
    excerpt: 'Doğada güvenli ve keyifli bir kamp deneyimi için bilmeniz gereken her şey.',
    content: `
      <h2>Doğayla Başbaşa: Kamp Deneyiminin Sihri</h2>
      <p>Kamp yapmak, modern hayatın stresinden uzaklaşıp doğayla bütünleşmenin en güzel yollarından biridir. Yıldızların altında uyumak, kuş sesleriyle uyanmak ve doğanın huzurunu hissetmek paha biçilmez bir deneyimdir.</p>
      <p>Bu rehberde, güvenli ve unutulmaz bir kamp deneyimi için bilmeniz gereken tüm detayları paylaşacağız. İster deneyimli bir kampçı olun, ister ilk kez çadır kuruyor olun, bu ipuçları sizin için hazırlandı.</p>
      
      <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80" alt="Dağ manzaralı kamp alanı" />
      
      <h2>Ekipman Seçimi: Doğru Malzemeler Hayat Kurtarır</h2>
      <p>Kamp ekipmanı seçimi, deneyiminizin kalitesini doğrudan etkiler. Kaliteli bir çadır, rahat bir uyku tulumu ve güvenilir bir ocak, kamp deneyiminizin vazgeçilmezleridir.</p>
      <h3>Temel Ekipman Listesi:</h3>
      <ul>
        <li><strong>Çadır:</strong> Mevsime uygun, su geçirmez ve havalandırması iyi bir model tercih edin.</li>
        <li><strong>Uyku Tulumu:</strong> Bölgenin sıcaklık koşullarına göre uygun comfort rating'e sahip olmalı.</li>
        <li><strong>Mat veya Şişme Yatak:</strong> Zeminden gelen soğuğu ve sertliği engellemek için şarttır.</li>
        <li><strong>Kamp Ocağı:</strong> Güvenli pişirme için taşınabilir bir ocak yanınızda olsun.</li>
        <li><strong>El Feneri ve Far:</strong> Gece aydınlatması için mutlaka bulundurun.</li>
      </ul>
      <p>Ayrıca, çok katlı giyim prensibi ile hazırlanmak önemlidir. Hava koşulları dağlarda çok hızlı değişebilir!</p>
      
      <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&q=80" alt="Kamp ekipmanları" />
      
      <h2>Kamp Yeri Seçimi: Güvenlik ve Konfor Dengesi</h2>
      <p>Doğru kamp yeri seçimi, güvenli ve konforlu bir deneyimin temelidir. Yeri seçerken dikkat edilmesi gereken birkaç önemli nokta vardır.</p>
      <p><strong>Düz ve kuru bir alan arayın:</strong> Çadırınızı kurabilmek için yeterince düz, sert ve kuru bir zemin bulmanız şarttır. Eğimli alanlar uyku konforunu olumsuz etkiler ve yağmur sularının birikmesine neden olabilir.</p>
      <p><strong>Su kaynaklarına yakınlık:</strong> Temiz bir su kaynağına yakın olmak önemlidir, ancak çok yakın kurmaktan kaçının. Sel riski olabilir ve ayrıca vahşi hayvanlar da su kaynaklarına gelir.</p>
      
      <img src="https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=1200&q=80" alt="Göl kenarında kamp" />
      
      <h2>Güvenlik Önlemleri: Her Zaman Hazırlıklı Olun</h2>
      <p>Kamp yaparken güvenliğiniz her şeyden önemlidir. İlk yardım çantası, acil durum iletişim araçları ve temel güvenlik bilgisi mutlaka yanınızda olmalıdır.</p>
      <h3>Güvenlik Kontrol Listesi:</h3>
      <ol>
        <li>İlk yardım çantası ve temel ilaçlar</li>
        <li>Acil durum iletişim numaraları (112, 155 Orman Yangın)</li>
        <li>Harita, pusula veya GPS cihazı</li>
        <li>Yeterli miktarda su ve su arıtma tabletleri</li>
        <li>Ekstra pil ve powerbank</li>
        <li>Çakı veya multi-tool</li>
        <li>Yangın söndürme ekipmanı veya bilgisi</li>
      </ol>
      <p>Ayrıca, kamp alanının kurallarını ve bölgesel tehlikeleri (yılan, ayı, böcek türleri) önceden araştırın. Bilgi, en iyi korumadır!</p>
      
      <img src="https://images.unsplash.com/photo-1537565732299-e5f867704ac5?w=1200&q=80" alt="Kamp ateşi" />
      
      <h2>Doğayı Korumak: İz Bırakmadan Kamp</h2>
      <p>Leave No Trace (İz Bırakmama) prensibi, doğal alanların gelecek nesiller için korunmasını sağlar. Çöplerinizi toplayın, ateşinizi güvenli şekilde söndürün ve doğal yaşamı rahatsız etmeyin.</p>
      <p>Biyolojik çöpler bile doğaya zarar verebilir. Tüm çöplerinizi yanınızda götürün, sabun ve deterjan kullanmaktan kaçının, yaban hayatına yiyecek vermeyin.</p>
      <p><strong>Sonuç olarak,</strong> planlama ve hazırlık ile kamp deneyiminiz unutulmaz olacaktır. Doğanın tadını çıkarırken, onu koruma sorumluluğunu da unutmayın. Mutlu kamplar!</p>
    `,
    author: 'Ahmet Yılmaz',
    publishedAt: '2024-01-15',
    category: 'İpuçları',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80',
    readTime: 12,
    tags: ['Güvenlik', 'Yeni Başlayanlar', 'Ekipman', 'Doğa Koruma'],
    featured: true,
    views: 1250,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Kış Kampı: Karlı Dağlarda Macera',
    excerpt: 'Kış mevsiminde kamp yapmanın incelikleri ve hazırlık süreçleri.',
    content: `
      <h2>Kış Kampının Büyülü Dünyası</h2>
      <p>Kış kampı, doğaseverlerin en cesur ve unutulmaz macerasıdır. Karlı manzaralar, buz gibi temiz hava ve saf sessizlik... Ancak kış şartlarında kamp yapmak, özel hazırlık ve ekipman gerektirir.</p>
      
      <img src="https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&q=80" alt="Karlı dağlarda kamp" />
      
      <h2>Kış Ekipmanları</h2>
      <p>4 mevsim çadır, -15 derece comfort rating'li uyku tulumu ve izolasyonlu mat kış kampının olmazsa olmazlarıdır. Ayrıca ısı tutan katmanlı giysiler ve su geçirmez dış giyim şarttır.</p>
      <p>Kış kampında vücut ısınızı korumak hayati önem taşır. Terlemekten kaçının, çünkü ıslak giysiler donma riskini artırır.</p>
    `,
    author: 'Zeynep Kaya',
    publishedAt: '2024-01-20',
    category: 'Macera',
    image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&q=80',
    readTime: 10,
    tags: ['Kış Kampı', 'Kar', 'Macera'],
    featured: true,
    views: 890,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
];

// Load from localStorage or use initial data
const loadBlogsFromStorage = (): BlogPost[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const storedBlogs: BlogPost[] = JSON.parse(stored);
        
        // If stored data is empty array, use initial data
        if (Array.isArray(storedBlogs) && storedBlogs.length === 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockBlogPosts));
          return initialMockBlogPosts;
        }
        
        // Fix any blogs with missing publishedAt field
        const fixedBlogs = storedBlogs.map(blog => {
          if (!blog.publishedAt || isNaN(new Date(blog.publishedAt).getTime())) {
            const fallbackDate = blog.createdAt 
              ? new Date(blog.createdAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0];
            return {
              ...blog,
              publishedAt: fallbackDate,
            };
          }
          return blog;
        });
        
        // Merge stored blogs with initial mock blogs to ensure initial data is included
        const storedIds = new Set(fixedBlogs.map(b => b.id));
        const newBlogs = initialMockBlogPosts.filter(b => !storedIds.has(b.id));
        const mergedBlogs = [...fixedBlogs, ...newBlogs];
        
        // If we fixed or added new blogs, save to localStorage
        if (newBlogs.length > 0 || fixedBlogs.length !== storedBlogs.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedBlogs));
        }
        
        return mergedBlogs;
      }
      // First time - save initial data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockBlogPosts));
      return initialMockBlogPosts;
    }
  } catch (error) {
    console.error('Failed to load blogs from storage:', error);
    // On error, ensure we have initial data
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockBlogPosts));
      }
    } catch (saveError) {
      console.error('Failed to save initial blogs to storage:', saveError);
    }
  }
  return initialMockBlogPosts;
};

// Save to localStorage
const saveBlogsToStorage = (blogs: BlogPost[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    }
  } catch (error) {
    console.error('Failed to save blogs to storage:', error);
  }
};

// Mock blog data - loaded from localStorage
// Initialize on module load to ensure data is available
let initialLoad = loadBlogsFromStorage();
if (!initialLoad || initialLoad.length === 0) {
  console.log('Initial blog load was empty, resetting...');
  initialLoad = [...initialMockBlogPosts];
  saveBlogsToStorage(initialLoad);
}
export let mockBlogPosts: BlogPost[] = initialLoad;

export const blogService = {
  async getBlogs(filters?: BlogFilters, page = 1): Promise<PaginatedResponse<BlogPost>> {
    try {
      const response = await api.get<PaginatedResponse<BlogPost>>('/blogs', {
        params: { ...filters, page },
      });
      return response.data;
    } catch (error) {
      // Fallback to mock data when API fails
      console.log('API failed, using mock data:', error);
      
      // Always reload from storage to get latest data
      mockBlogPosts = loadBlogsFromStorage();
      
      // CRITICAL: Ensure we always have at least the initial blog
      if (!mockBlogPosts || mockBlogPosts.length === 0) {
        console.log('No blogs in storage, initializing with default blog');
        mockBlogPosts = [...initialMockBlogPosts];
        saveBlogsToStorage(mockBlogPosts);
      }
      
      console.log('Loaded blogs from storage:', mockBlogPosts.length);
      
      let filtered = [...mockBlogPosts];
      
      if (filters?.search) {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      
      if (filters?.category) {
        filtered = filtered.filter((post) => post.category === filters.category);
      }
      
      if (filters?.featured !== undefined) {
        filtered = filtered.filter((post) => post.featured === filters.featured);
      }

      // Pagination
      const limit = 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }
  },

  async getBlogById(id: string): Promise<BlogPost> {
    try {
      const response = await api.get<BlogPost>(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      mockBlogPosts = loadBlogsFromStorage();
      const post = mockBlogPosts.find((p) => p.id === id);
      if (!post) throw new Error('Blog bulunamadı');
      return post;
    }
  },

  async createBlog(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    try {
      const response = await api.post<BlogPost>('/blogs', blog);
      const newBlog = response.data;
      mockBlogPosts = loadBlogsFromStorage();
      mockBlogPosts.unshift(newBlog);
      saveBlogsToStorage(mockBlogPosts);
      return newBlog;
    } catch (error) {
      mockBlogPosts = loadBlogsFromStorage();
      const now = new Date();
      const newBlog: BlogPost = {
        ...blog,
        id: `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        publishedAt: blog.publishedAt || now.toISOString().split('T')[0], // Ensure valid date format
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        views: 0,
      };
      mockBlogPosts.unshift(newBlog);
      saveBlogsToStorage(mockBlogPosts);
      return newBlog;
    }
  },

  async updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const response = await api.put<BlogPost>(`/blogs/${id}`, updates);
      const updated = response.data;
      mockBlogPosts = loadBlogsFromStorage();
      const index = mockBlogPosts.findIndex((p) => p.id === id);
      if (index !== -1) {
        mockBlogPosts[index] = updated;
        saveBlogsToStorage(mockBlogPosts);
      }
      return updated;
    } catch (error) {
      mockBlogPosts = loadBlogsFromStorage();
      const index = mockBlogPosts.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Blog bulunamadı');
      
      mockBlogPosts[index] = {
        ...mockBlogPosts[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveBlogsToStorage(mockBlogPosts);
      return mockBlogPosts[index];
    }
  },

  async deleteBlog(id: string): Promise<void> {
    try {
      await api.delete(`/blogs/${id}`);
    } catch (error) {
      // Continue with mock deletion
    }
    mockBlogPosts = loadBlogsFromStorage();
    const index = mockBlogPosts.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockBlogPosts.splice(index, 1);
      saveBlogsToStorage(mockBlogPosts);
    }
  },
};

