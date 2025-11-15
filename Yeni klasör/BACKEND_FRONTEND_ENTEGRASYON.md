# 🔗 Backend-Frontend Entegrasyon Rehberi

## 📋 Genel Bakış

Bu rehber, CampScape uygulamasının frontend'ini localStorage tabanlı moddan **gerçek backend API**'ye geçirmek için gereken tüm adımları içerir.

---

## 🎯 Entegrasyon Adımları

### 1. Backend'i Hazırlama ve Başlatma

#### Adım 1.1: MySQL Veritabanı Kurulumu

```bash
# MySQL'e bağlan
mysql -u root -p

# Veritabanı ve kullanıcı oluştur
CREATE DATABASE campscape_marketplace;
CREATE USER 'campscape_user'@'localhost' IDENTIFIED BY 'CampScape2024!SecurePass';
GRANT ALL PRIVILEGES ON campscape_marketplace.* TO 'campscape_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Adım 1.2: .env Dosyası Oluşturma

`server/.env` dosyası oluşturun:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=campscape_user
DB_PASSWORD=CampScape2024!SecurePass
DB_NAME=campscape_marketplace
DB_PORT=3306

# JWT Configuration
JWT_SECRET=f8d4a6e2c9b1d7f3a5e8c9d4a6f2b7e3c8d9a4f6e7c2b8d3a5f9e7c6d4a8b2f
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=a3f7d9e2c5b8d1f4a6e9c2d7a4f8b5e1c9d3a7f2e8c6b4d1a9f5e3c8d6b2a4f
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=./uploads
MAX_USER_UPLOAD_QUOTA=1073741824

# Security Settings
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
HTTPS_ENFORCE=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

#### Adım 1.3: Backend Dependencies ve Migration

```bash
cd server

# Dependencies'i yükle
npm install

# Migration çalıştır (tabloları oluştur)
npm run db:migrate

# Seed çalıştır (örnek veriler ekle)
npm run db:seed

# Backend'i başlat
npm run dev
```

Backend şimdi `http://localhost:3000` adresinde çalışıyor olmalı.

**Test:**
```bash
curl http://localhost:3000/health
# Beklenen: {"status":"OK","message":"Server is running"}
```

---

### 2. Frontend API Konfigürasyonu Güncelleme

#### Adım 2.1: API Base URL Güncellemesi

`src/services/api.ts` dosyasını güncelleyin:

```typescript
import axios from 'axios';

// Backend API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// Request interceptor - Token ekleme
api.interceptors.request.use(
  (config) => {
    // Zustand store'dan token al
    const authStore = localStorage.getItem('auth-storage');
    if (authStore) {
      try {
        const { state } = JSON.parse(authStore);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Token parsing error:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Token yenileme ve hata yönetimi
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token ile yeni access token al
        const authStore = localStorage.getItem('auth-storage');
        if (authStore) {
          const { state } = JSON.parse(authStore);
          if (state?.refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
              refreshToken: state.refreshToken
            });

            const { token: newToken } = response.data;

            // Yeni token'ı store'a kaydet
            const updatedState = {
              ...JSON.parse(authStore),
              state: {
                ...state,
                token: newToken
              }
            };
            localStorage.setItem('auth-storage', JSON.stringify(updatedState));

            // Original request'i yeni token ile tekrar gönder
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh token da geçersizse, logout yap
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Diğer hatalar
    return Promise.reject(error);
  }
);

export default api;
```

#### Adım 2.2: Environment Variables (.env)

Proje root'unda `.env` dosyası oluşturun:

```env
VITE_API_URL=http://localhost:3000
```

---

### 3. Service Dosyalarını Güncelleme

#### Adım 3.1: Auth Service Güncelleme

`src/services/authService.ts` dosyasını güncelleyin:

```typescript
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken?: string;
}

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  // Get profile
  async getProfile(): Promise<any> {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Update profile
  async updateProfile(data: any): Promise<any> {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },
};
```

#### Adım 3.2: Gear Service Güncelleme

`src/services/gearService.ts` dosyasını güncelleyin:

```typescript
import api from './api';

export const gearService = {
  // Tüm ekipmanları getir
  async getAll(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    const response = await api.get('/api/gear', { params });
    return response.data;
  },

  // Tekil ekipman getir
  async getById(id: number) {
    const response = await api.get(`/api/gear/${id}`);
    return response.data;
  },

  // Yeni ekipman oluştur (Admin)
  async create(data: any) {
    const response = await api.post('/api/gear', data);
    return response.data;
  },

  // Ekipman güncelle (Admin)
  async update(id: number, data: any) {
    const response = await api.put(`/api/gear/${id}`, data);
    return response.data;
  },

  // Ekipman sil (Admin)
  async delete(id: number) {
    await api.delete(`/api/gear/${id}`);
  },

  // Featured ekipmanlar
  async getFeatured() {
    const response = await api.get('/api/gear/featured');
    return response.data;
  },
};
```

#### Adım 3.3: Blog Service Güncelleme

`src/services/blogService.ts` dosyasını güncelleyin:

```typescript
import api from './api';

export const blogService = {
  // Tüm blog yazılarını getir
  async getAll(params?: { category?: string; search?: string; page?: number; limit?: number }) {
    const response = await api.get('/api/blogs', { params });
    return response.data;
  },

  // Tekil blog getir
  async getById(id: number) {
    const response = await api.get(`/api/blogs/${id}`);
    return response.data;
  },

  // Blog slug ile getir
  async getBySlug(slug: string) {
    const response = await api.get(`/api/blogs/slug/${slug}`);
    return response.data;
  },

  // Yeni blog oluştur (Admin)
  async create(data: any) {
    const response = await api.post('/api/blogs', data);
    return response.data;
  },

  // Blog güncelle (Admin)
  async update(id: number, data: any) {
    const response = await api.put(`/api/blogs/${id}`, data);
    return response.data;
  },

  // Blog sil (Admin)
  async delete(id: number) {
    await api.delete(`/api/blogs/${id}`);
  },
};
```

#### Adım 3.4: Upload Service Güncelleme

`src/services/uploadService.ts` dosyasını güncelleyin:

```typescript
import api from './api';

export const uploadService = {
  // Dosya yükleme
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      url: response.data.url,
      filename: response.data.filename,
    };
  },

  // Çoklu dosya yükleme
  async uploadMultiple(files: File[]): Promise<Array<{ url: string; filename: string }>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.files;
  },

  // Dosya silme (Admin)
  async deleteFile(filename: string): Promise<void> {
    await api.delete(`/api/upload/${filename}`);
  },
};
```

#### Adım 3.5: Review Service Güncelleme

`src/services/reviewService.ts` dosyasını güncelleyin:

```typescript
import api from './api';

export const reviewService = {
  // Yorumları getir (gear veya campsite için)
  async getReviews(type: 'gear' | 'campsite', itemId: number) {
    const response = await api.get(`/api/reviews/${type}/${itemId}`);
    return response.data;
  },

  // Yorum oluştur
  async createReview(data: {
    type: 'gear' | 'campsite';
    itemId: number;
    rating: number;
    comment: string;
  }) {
    const response = await api.post('/api/reviews', data);
    return response.data;
  },

  // Yorum güncelle
  async updateReview(id: number, data: { rating?: number; comment?: string }) {
    const response = await api.put(`/api/reviews/${id}`, data);
    return response.data;
  },

  // Yorum sil
  async deleteReview(id: number) {
    await api.delete(`/api/reviews/${id}`);
  },
};
```

---

### 4. Zustand Store Güncellemesi

#### Adım 4.1: Auth Store Güncelleme

`src/stores/authStore.ts` dosyasını güncelleyin:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authService.refreshToken(refreshToken);
          set({ token: response.token });
        } catch (error) {
          // Refresh token da geçersizse logout
          get().logout();
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

### 5. Component Güncellemeleri

#### Adım 5.1: Login Component

`src/components/LoginForm.tsx` örneği:

```typescript
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

---

### 6. localStorage Temizleme

Backend'e geçiş yaparken eski localStorage verilerini temizleyin:

```typescript
// src/utils/migrateToBackend.ts
export const migrateToBackend = () => {
  // Eski localStorage key'lerini temizle
  const keysToRemove = [
    'camp_gear_storage',
    'camp_blogs_storage',
    'camp_reviews_storage',
    'camp_campsites_storage',
    'reference_brands_storage',
    'camp_categories_storage',
    'camp_brands_storage',
    'camp_colors_storage',
    'camp_messages_storage',
    'camp_appointments_storage',
    'camp_newsletters_storage',
    'camp_user_orders_storage',
    'campscape_users',
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  console.log('LocalStorage cleaned. Migration to backend complete.');
};

// App.tsx içinde bir kere çağır
// import { migrateToBackend } from './utils/migrateToBackend';
// useEffect(() => {
//   migrateToBackend();
// }, []);
```

---

### 7. Error Handling ve Loading States

#### Adım 7.1: Error Boundary Component

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Adım 7.2: Loading Component

```typescript
// src/components/Loading.tsx
export const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};
```

---

### 8. Test ve Doğrulama

#### Adım 8.1: Backend Sağlık Kontrolü

```bash
# Backend çalışıyor mu?
curl http://localhost:3000/health

# Login test
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campscape.com","password":"Admin123!"}'

# Token ile korumalı endpoint
TOKEN="YOUR_TOKEN_HERE"
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### Adım 8.2: Frontend Test

1. **Login testi:**
   - Login sayfasını aç
   - `admin@campscape.com` / `Admin123!` ile giriş yap
   - Dashboard'a yönlendirilmeli

2. **Data fetching testi:**
   - Gear listesini aç
   - Ürünler backend'den gelmeli
   - Network tab'da API isteklerini kontrol et

3. **File upload testi:**
   - Admin panelinden yeni ürün ekle
   - Resim yükle
   - Resim `server/uploads` klasörüne kaydedilmeli

4. **Error handling testi:**
   - Backend'i durdur
   - Frontend'de bir işlem yap
   - Error mesajı gösterilmeli

---

### 9. Production Deployment

#### Adım 9.1: Environment Variables (Production)

```env
# Frontend (.env.production)
VITE_API_URL=https://api.yourdomain.com

# Backend (.env)
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
HTTPS_ENFORCE=true
ENABLE_CSRF=true
```

#### Adım 9.2: Build

```bash
# Frontend build
npm run build

# Backend build
cd server
npm run build
```

#### Adım 9.3: PM2 ile Backend Başlatma

```bash
cd server
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🚨 Yaygın Sorunlar ve Çözümleri

### Sorun 1: CORS Hatası

**Hata:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Çözüm:**
- Backend'de `ALLOWED_ORIGINS` environment variable'ını kontrol edin
- Frontend URL'ini ekleyin: `http://localhost:5173`

### Sorun 2: 401 Unauthorized

**Hata:** Tüm isteklerde 401 dönüyor

**Çözüm:**
- Token'ın localStorage'da doğru kaydedildiğini kontrol edin
- axios interceptor'ın token'ı header'a eklediğini doğrulayın
- Backend'de JWT_SECRET'in doğru olduğunu kontrol edin

### Sorun 3: File Upload Çalışmıyor

**Hata:** Dosya yükleme başarısız

**Çözüm:**
- `server/uploads` klasörünün yazma iznine sahip olduğunu kontrol edin
- `MAX_FILE_SIZE` limitini kontrol edin
- MIME type'ın `ALLOWED_FILE_TYPES`'da olduğunu doğrulayın

### Sorun 4: Database Connection Error

**Hata:** `ER_ACCESS_DENIED_ERROR` veya `ECONNREFUSED`

**Çözüm:**
- MySQL'in çalıştığını kontrol edin: `sudo systemctl status mysql`
- Database credentials'ları doğrulayın (.env dosyası)
- Database ve user'ın oluşturulduğunu kontrol edin

---

## ✅ Checklist: Backend'e Geçiş Tamamlandı mı?

- [ ] MySQL kurulu ve çalışıyor
- [ ] Database ve user oluşturuldu
- [ ] Backend `.env` dosyası yapılandırıldı
- [ ] Backend dependencies yüklendi (`npm install`)
- [ ] Database migration çalıştırıldı
- [ ] Seed data eklendi
- [ ] Backend başlatıldı (`npm run dev`)
- [ ] Frontend `.env` dosyası oluşturuldu
- [ ] `src/services/api.ts` güncellendi
- [ ] Auth service güncellendi
- [ ] Diğer service'ler güncellendi
- [ ] Zustand store'lar güncellendi
- [ ] localStorage migration yapıldı
- [ ] Login testi başarılı
- [ ] Data fetching testi başarılı
- [ ] File upload testi başarılı
- [ ] Error handling çalışıyor

---

## 📞 Yardım ve Destek

**Backend API Documentation:**
- Swagger UI: `http://localhost:3000/api-docs` (eğer eklediyseniz)
- API Endpoints: `server/API_DOCUMENTATION.md`

**Backend Logs:**
```bash
tail -f server/logs/combined.log
tail -f server/logs/error.log
```

**Database Kontrol:**
```bash
mysql -u campscape_user -p campscape_marketplace
SHOW TABLES;
SELECT COUNT(*) FROM gear;
```

---

**Son Güncelleme:** 14 Kasım 2025  
**Versiyon:** 1.0


