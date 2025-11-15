# WPC İnşaat Malzemeleri Katalog ve Teklif İstek Platformu Frontend Geliştirme Promptu

## Proje Genel Bakış

WPC İnşaat Malzemeleri platformu, Türkiye'nin önde gelen WPC (Wood-Plastic Composite) ve inşaat malzemeleri katalog ve teklif isteği platformudur. Modern, profesyonel ve kullanıcı dostu bir frontend geliştirmek istiyorum. Platform, WPC döşeme, cephe kaplama, çit, pergola ve diğer inşaat malzemelerini tanıtır ve kullanıcıların teklif isteyebilmesini sağlar.

## Teknoloji Yığını ve Gereksinimler

### Core Teknolojiler
- **React 18** + **TypeScript** - Component tabanlı modern UI geliştirme
- **Vite** - Hızlı build tool ve development server
- **React Router v6** - Client-side routing ve navigasyon
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Zustand** - Hafif ve performanslı state management
- **Axios** - HTTP client için API çağrıları
- **React Hook Form** - Form yönetimi ve validasyon
- **Framer Motion** - Akıcı animasyonlar ve geçişler
- **DOMPurify** - XSS koruması için HTML sanitization
- **React Helmet Async** - SEO için meta tag yönetimi
- **GSAP** - Gelişmiş animasyonlar için
- **Swiper** - Touch-friendly slider/carousel bileşenleri

### Development Tools
- **TypeScript 5.9+** - Type safety için
- **ESLint** - Code quality ve standartları
- **PostCSS** + **Autoprefixer** - CSS işleme

## Proje Yapısı

```
src/
├── components/          # Tekrar kullanılabilir UI bileşenleri
│   ├── Navbar.tsx      # Ana navigasyon bar
│   ├── Footer.tsx      # Footer bileşeni
│   ├── Button.tsx      # Standart button bileşeni
│   ├── Input.tsx       # Form input bileşeni
│   ├── ProductCard.tsx     # Ürün kartı (WPC ve inşaat malzemeleri)
│   ├── CategoryCard.tsx    # Kategori kartı
│   ├── ImageSlider.tsx     # Görsel slider
│   ├── FilterSidebar.tsx   # Filtreleme sidebar'ı
│   ├── LoadingSpinner.tsx  # Yükleme göstergesi
│   ├── SkeletonLoader.tsx  # Skeleton loading
│   ├── ErrorBoundary.tsx   # Hata yakalama
│   ├── ProtectedRoute.tsx  # Korunan route wrapper
│   ├── SecurityProvider.tsx # Güvenlik wrapper
│   ├── ContactToolbar.tsx  # İletişim araç çubuğu
│   ├── FastNavigation.tsx  # Hızlı navigasyon
│   ├── ScrollToTop.tsx     # Scroll to top butonu
│   ├── SEO.tsx             # SEO bileşeni
│   ├── OptimizedImage.tsx  # Optimize edilmiş görsel
│   ├── ImageLightbox.tsx   # Görsel lightbox
│   ├── SearchDropdown.tsx  # Arama dropdown
│   ├── AdminLayout.tsx     # Admin layout wrapper
│   └── AdminWrapper.tsx    # Admin sayfa wrapper
│
├── pages/               # Sayfa bileşenleri
│   ├── HomePage.tsx         # Ana sayfa
│   ├── ProductsPage.tsx     # Ürünler listesi (tüm ürünler)
│   ├── ProductDetailsPage.tsx # Ürün detay sayfası
│   ├── WPCPage.tsx          # WPC ürünleri listesi
│   ├── WPCDetailsPage.tsx   # WPC ürün detay sayfası
│   ├── CategoryProductsPage.tsx # Kategoriye göre ürünler
│   ├── BlogPage.tsx         # Blog listesi
│   ├── BlogDetailsPage.tsx  # Blog detay
│   ├── CategoryPage.tsx     # Kategori sayfası
│   ├── SearchResultsPage.tsx # Arama sonuçları
│   ├── AboutPage.tsx        # Hakkımızda
│   ├── ContactPage.tsx      # İletişim
│   ├── FAQPage.tsx          # SSS
│   ├── ProjectsPage.tsx     # Projeler/Referanslar (müşteri projeleri)
│   ├── ProjectDetailsPage.tsx # Proje detay sayfası
│   ├── FavoritesPage.tsx    # Favoriler
│   ├── QuoteRequestPage.tsx # Teklif isteği sayfası
│   ├── MyQuoteRequestsPage.tsx # Kullanıcı teklif geçmişi
│   ├── LoginPage.tsx        # Giriş
│   ├── RegisterPage.tsx     # Kayıt
│   ├── ForgotPasswordPage.tsx # Şifre sıfırlama
│   └── admin/            # Admin sayfaları
│       ├── AdminDashboard.tsx
│       ├── AdminProductsPage.tsx
│       ├── AddProductPage.tsx
│       ├── EditProductPage.tsx
│       ├── AdminWPCPage.tsx
│       ├── AddWPCPage.tsx
│       ├── EditWPCPage.tsx
│       ├── AdminQuoteRequestsPage.tsx
│       ├── QuoteRequestDetailsPage.tsx
│       ├── AdminStockPage.tsx
│       ├── AdminProjectsPage.tsx
│       ├── AddProjectPage.tsx
│       ├── EditProjectPage.tsx
│       ├── AdminBlogsPage.tsx
│       ├── AddBlogPage.tsx
│       ├── EditBlogPage.tsx
│       ├── AdminMessagesPage.tsx
│       ├── AdminNewslettersPage.tsx
│       ├── AdminAppointmentsPage.tsx
│       ├── AdminCategoriesPage.tsx
│       ├── AddCategoryPage.tsx
│       ├── EditCategoryPage.tsx
│       ├── AdminBrandsPage.tsx
│       ├── AdminColorsPage.tsx
│       ├── AdminMaterialsPage.tsx
│       ├── AdminCustomersPage.tsx
│       └── AdminReportsPage.tsx
│
├── store/               # Zustand store'ları
│   ├── authStore.ts        # Kimlik doğrulama state
│   ├── themeStore.ts       # Tema state (dark/light)
│   ├── productStore.ts     # Ürünler state
│   ├── wpcStore.ts         # WPC ürünleri state
│   ├── quoteStore.ts       # Teklif isteği state
│   ├── blogStore.ts        # Blog state
│   └── filterStore.ts      # Filtre state
│
├── services/            # API servisleri
│   ├── api.ts              # Axios instance ve config
│   ├── authService.ts      # Auth API çağrıları
│   ├── productService.ts   # Ürün API çağrıları
│   ├── wpcService.ts       # WPC ürün API çağrıları
│   ├── quoteService.ts     # Teklif isteği API çağrıları
│   ├── blogService.ts      # Blog API çağrıları
│   ├── projectService.ts   # Proje/Referans API çağrıları
│   └── adminService.ts     # Admin API çağrıları
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts          # Auth hook
│   ├── useDebounce.ts      # Debounce hook
│   ├── useLocalStorage.ts  # LocalStorage hook
│   └── useMediaQuery.ts    # Media query hook
│
├── types/               # TypeScript type tanımları
│   ├── auth.ts             # Auth types
│   ├── product.ts          # Ürün types
│   ├── wpc.ts              # WPC ürün types
│   ├── quote.ts            # Teklif isteği types
│   ├── blog.ts             # Blog types
│   ├── project.ts          # Proje/Referans types
│   ├── api.ts              # API response types
│   └── common.ts           # Common types
│
├── utils/               # Yardımcı fonksiyonlar
│   ├── validation.ts       # Form validasyon
│   ├── formatting.ts       # Formatting utilities
│   ├── sanitization.ts     # HTML sanitization
│   └── constants.ts        # Sabitler
│
├── config/              # Konfigürasyon dosyaları
│   ├── index.ts            # Ana config
│   └── routes.ts           # Route tanımları
│
├── assets/              # Statik varlıklar
│   ├── images/            # Görseller
│   ├── icons/             # İkonlar
│   └── fonts/             # Fontlar
│
├── App.tsx              # Ana uygulama bileşeni
├── main.tsx             # Entry point
└── index.css            # Global CSS ve Tailwind imports
```

## Tasarım Sistemi ve Stil Rehberi

### Renk Paleti

**Primary Colors (İnşaat Mavisi - Güven ve Profesyonellik):**
- `primary-50`: #eff6ff
- `primary-100`: #dbeafe
- `primary-200`: #bfdbfe
- `primary-300`: #93c5fd
- `primary-400`: #60a5fa
- `primary-500`: #2563eb (Ana renk - İnşaat mavisi)
- `primary-600`: #1d4ed8
- `primary-700`: #1e40af
- `primary-800`: #1e3a8a
- `primary-900`: #172554
- `primary-950`: #0f172a

**Secondary Colors (Turuncu - Enerji ve Aksiyon):**
- `secondary-50`: #fff7ed
- `secondary-100`: #ffedd5
- `secondary-200`: #fed7aa
- `secondary-300`: #fdba74
- `secondary-400`: #fb923c
- `secondary-500`: #f97316 (Ana renk - Vurgu turuncusu)
- `secondary-600`: #ea580c
- `secondary-700`: #c2410c
- `secondary-800`: #9a3412
- `secondary-900`: #7c2d12
- `secondary-950`: #431407

**Accent Colors (Gri - Modern ve Minimal):**
- `accent-50`: #f9fafb
- `accent-100`: #f3f4f6
- `accent-200`: #e5e7eb
- `accent-300`: #d1d5db
- `accent-400`: #9ca3af
- `accent-500`: #6b7280 (Ana renk - Nötr gri)
- `accent-600`: #4b5563
- `accent-700`: #374151
- `accent-800`: #1f2937
- `accent-900`: #111827
- `accent-950`: #030712

### Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Font Sizes**: Tailwind defaults (text-xs, sm, base, lg, xl, 2xl, 3xl, etc.)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Responsive Breakpoints

- **Mobile**: 320px - 768px (mobil öncelikli tasarım)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Dark Mode

- Class-based dark mode (`dark:` prefix)
- Kullanıcı tercihine göre otomatik geçiş
- Sistem tercihini algılama desteği
- Manuel toggle butonu

### Animasyonlar

- **Fade In**: `fade-in` (0.5s ease-in-out)
- **Slide Up**: `slide-up` (0.5s ease-out)
- **Slide Down**: `slide-down` (0.5s ease-out)
- **Framer Motion**: Sayfa geçişleri ve interaktif animasyonlar
- **GSAP**: Özel animasyonlar için

## Fonksiyonel Gereksinimler

### Ana Özellikler

1. **Ürünler (İnşaat Malzemeleri)**
   - Liste görünümü (grid/list toggle)
   - Detay sayfası (görseller, teknik özellikler, fiyat, stok durumu)
   - Gelişmiş filtreleme (kategori, fiyat, marka, renk, boyut, kalınlık)
   - Arama fonksiyonu
   - Favorilere ekleme
   - Teklif isteği formu (ürün detay sayfasından)
   - Ürün karşılaştırma özelliği

2. **WPC Ürünleri (Ahşap-Plastik Kompozit)**
   - WPC özel kategori sayfası
   - Katalog görünümü (grid/list toggle)
   - Detay sayfası (görseller, teknik özellikler, fiyat/metrekare veya /metre)
   - Kategori bazlı filtreleme (döşeme, cephe, çit, pergola, vb.)
   - Renk ve desen filtreleri
   - Kalınlık ve boyut filtreleri
   - Stok durumu kontrolü
   - Metrekare/metre hesaplama aracı
   - Fiyat hesaplama (metrekareye göre)

3. **Blog**
   - Blog listesi (kart görünümü)
   - Blog detay sayfası (okuma süresi, görüntülenme sayısı)
   - Kategori ve etiket filtreleme (WPC, İnşaat, Dekorasyon, vb.)
   - İlgili blog önerileri
   - İnşaat ve WPC konulu içerikler

4. **Projeler/Referanslar**
   - Müşteri projeleri galerisi
   - Proje detay sayfası (görseller, açıklama, kullanılan ürünler)
   - Kategori bazlı filtreleme (konut, ticari, endüstriyel)
   - Proje lokasyonu haritası
   - Proje öncesi/sonrası görselleri

5. **Teklif İstek Sistemi**
   - Ürün detay sayfasından teklif isteği
   - Çoklu ürün için teklif isteği (sepet benzeri liste)
   - Teklif isteği formu (ürün bilgileri, miktar, iletişim bilgileri, mesaj)
   - Teklif isteği geçmişi (kullanıcı için)
   - Teklif durumu takibi (beklemede, inceleniyor, gönderildi)
   - Metrekare/metre hesaplama aracı ile fiyat tahmini
   - Toplu teklif isteği (birden fazla ürün için)

6. **Kullanıcı Yönetimi**
   - Kayıt olma (e-posta, şifre validasyonu, şirket bilgileri)
   - Giriş yapma (hatırla beni)
   - Şifre sıfırlama
   - Profil yönetimi (kişisel bilgiler, şirket bilgileri, iletişim bilgileri)
   - Favoriler listesi
   - Teklif isteği geçmişi

7. **Admin Paneli**
   - Dashboard (istatistikler, grafikler, teklif isteği raporları)
   - Ürünler CRUD (genel ürünler)
   - WPC ürünleri CRUD
   - Teklif istekleri yönetimi (liste, detay görüntüleme, durum güncelleme, teklif gönderme)
   - Stok yönetimi (stok takibi, uyarılar)
   - Blog yönetimi
   - Proje/Referans yönetimi
   - Müşteri yönetimi
   - Mesajlar yönetimi
   - Newsletter yönetimi
   - Kategori yönetimi
   - Marka ve renk yönetimi
   - Malzeme özellikleri yönetimi
   - Raporlar ve analitikler (teklif isteği istatistikleri)

8. **Arama ve Filtreleme**
   - Global arama (dropdown ile öneriler)
   - Gelişmiş filtreleme sidebar'ı
   - URL parametreleri ile filtreleme
   - Filtre sonuçlarını kaydetme
   - Ürün karşılaştırma özelliği
   - Fiyat aralığı filtreleme
   - Stok durumu filtreleme (stokta var/yok)

7. **SEO ve Performans**
   - Meta tag yönetimi (her sayfa için)
   - Structured data (Schema.org)
   - Open Graph tags
   - Twitter Card tags
   - Lazy loading (sayfa ve görsel)
   - Image optimization
   - Code splitting

### Kullanıcı Deneyimi Özellikleri

1. **Navigasyon**
   - Responsive navbar (mobil hamburger menü)
   - Breadcrumb navigasyon
   - Hızlı navigasyon butonu (scroll to top)
   - Fast navigation component (sabit butonlar)

2. **Görsel Deneyim**
   - Image slider/carousel
   - Lightbox görüntüleme
   - Optimize edilmiş görsel yükleme
   - Lazy loading görseller
   - Skeleton loading states

3. **Form Yönetimi**
   - React Hook Form ile form yönetimi
   - Real-time validasyon
   - Hata mesajları (Türkçe)
   - Loading states
   - Success/error feedback

4. **State Management**
   - Zustand ile global state
   - Local component state (useState)
   - Server state (API calls)
   - Optimistic updates

5. **Güvenlik**
   - XSS koruması (DOMPurify)
   - CSRF koruması
   - Input sanitization
   - Protected routes
   - Role-based access control

## UI/UX Gereksinimleri

### Genel Tasarım Prensipleri

1. **Mobil Öncelikli**: Tüm tasarım mobil cihazlar için optimize edilmiş olmalı
2. **Tutarlılık**: Tüm sayfalarda tutarlı tasarım dili
3. **Erişilebilirlik**: WCAG 2.1 AA standartlarına uygun
4. **Performans**: Hızlı yükleme ve akıcı animasyonlar
5. **Kullanılabilirlik**: Sezgisel navigasyon ve etkileşimler

### Bileşen Standartları

**Button Bileşeni:**
- Primary, secondary, outline, ghost varyantları
- Small, medium, large boyutları
- Loading state
- Disabled state
- Icon desteği

**Input Bileşeni:**
- Label ve placeholder desteği
- Error state ve mesajları
- Success state
- Icon desteği (prefix/suffix)
- Type variants (text, email, password, number, etc.)

**Card Bileşenleri:**
- ProductCard: Görsel, başlık, kategori, fiyat, stok durumu, favori butonu, teklif iste butonu
- CategoryCard: Kategori görseli, başlık, ürün sayısı
- ProjectCard: Proje görseli, başlık, lokasyon, kategori, öncesi/sonrası toggle
- QuoteRequestCard: Teklif isteği kartı (ürün bilgileri, miktar, tarih, durum)
- Tutarlı hover efektleri
- Responsive grid layout
- Ürün kartlarında hızlı görüntüleme (quick view) özelliği

**Loading States:**
- LoadingSpinner: Yükleme göstergesi
- SkeletonLoader: İçerik yüklenirken placeholder

### Sayfa Yapısı

**Genel Layout:**
```
<Navbar />
<main>
  <PageContent />
</main>
<Footer />
<ContactToolbar />
<FastNavigation />
```

**Admin Layout:**
```
<AdminLayout>
  <AdminSidebar />
  <AdminContent />
</AdminLayout>
```

## API Entegrasyonu

### API Base URL
- Development: `http://localhost:8000/api`
- Production: Environment variable'dan alınır

### API Servis Yapısı

```typescript
// Örnek API çağrısı yapısı
services/
  ├── api.ts           // Axios instance, interceptors
  ├── authService.ts   // POST /auth/login, POST /auth/register
  ├── productService.ts // GET /products, GET /products/:id
  ├── wpcService.ts    // GET /wpc-products, GET /wpc-products/:id
  ├── quoteService.ts  // POST /quote-requests, GET /quote-requests, GET /quote-requests/:id
  ├── blogService.ts   // GET /blogs, GET /blogs/:id
  ├── projectService.ts // GET /projects, GET /projects/:id
  └── adminService.ts  // Admin API çağrıları
```

### Error Handling

- Tüm API çağrıları try-catch ile sarmalanmalı
- Kullanıcı dostu hata mesajları (Türkçe)
- Network error handling
- Unauthorized error handling (logout)
- Error boundary ile yakalanmayan hatalar

## Performans Optimizasyonları

1. **Code Splitting**
   - Lazy loading ile sayfa yükleme
   - Route-based code splitting

2. **Görsel Optimizasyonu**
   - WebP format desteği
   - Lazy loading görseller
   - Responsive image sizes
   - Image compression

3. **State Optimizasyonu**
   - Memoization (useMemo, useCallback)
   - Zustand selector optimizasyonu

4. **Bundle Optimizasyonu**
   - Tree shaking
   - Minification
   - Gzip compression

## Güvenlik Gereksinimleri

1. **XSS Koruması**
   - DOMPurify ile HTML sanitization
   - React'in built-in XSS koruması

2. **CSRF Koruması**
   - Token-based authentication
   - Secure cookie settings

3. **Input Validasyonu**
   - Client-side validasyon
   - Server-side validasyon (API'dan gelen hatalar)

4. **Authentication**
   - JWT token storage (secure)
   - Token refresh mekanizması
   - Auto logout on token expiry

## SEO Gereksinimleri

1. **Meta Tags**
   - Her sayfa için unique title
   - Meta description
   - Keywords (gerekirse)
   - Open Graph tags
   - Twitter Card tags

2. **Structured Data**
   - Organization schema
   - Website schema
   - WebPage schema
   - Product schema (tüm ürünler için)
   - Offer schema (fiyatlandırma için)
   - AggregateRating schema (ürün değerlendirmeleri için)
   - LocalBusiness schema (şirket bilgileri için)
   - BlogPosting schema (blog yazıları için)
   - BreadcrumbList schema (breadcrumb navigasyon için)

3. **URL Structure**
   - SEO-friendly URLs
   - Breadcrumb navigation
   - Canonical URLs

## Geliştirme Standartları

### Code Style

- **TypeScript**: Strict mode aktif
- **ESLint**: Proje ESLint kurallarına uygun
- **Naming**: PascalCase (components), camelCase (functions/variables)
- **File Structure**: Her component kendi dosyasında
- **Import Order**: External → Internal → Relative

### Component Best Practices

1. **Functional Components**: Class component kullanmayın
2. **Hooks**: Custom hooks ile logic'i ayırın
3. **Props**: TypeScript interface ile type tanımlayın
4. **State**: Local state için useState, global için Zustand
5. **Effects**: useEffect ile side effects yönetin

### Git Commit Messages

- Conventional commits formatı kullanın
- Örnek: `feat: add campsite detail page`, `fix: resolve image loading issue`

## Test Gereksinimleri (Opsiyonel - Gelecekte)

- Component tests (React Testing Library)
- Integration tests
- E2E tests (Playwright/Cypress)

## Deployment

- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Static Hosting**: Nginx veya benzeri
- **Environment Variables**: `.env` dosyasından okunur

## Örnek Kullanım Senaryoları

### Senaryo 1: Kullanıcı WPC Döşeme Ürünü İçin Teklif İstiyor
1. Ana sayfada "WPC döşeme" araması yapar
2. Dropdown'da öneriler görünür
3. Enter'a basınca arama sonuçları sayfasına yönlendirilir
4. Filtre sidebar'ından renk seçer (kahverengi tonları)
5. Kalınlık filtresinden "20mm" seçer
6. Sonuçlardan bir ürüne tıklar
7. Detay sayfasında görselleri görüntüler (lightbox)
8. Teknik özellikleri inceler (boyut, kalınlık, renk seçenekleri)
9. Metrekare hesaplama aracıyla 50 m² için fiyat tahmini görür
10. "Teklif İste" butonuna tıklar
11. Teklif isteği formu açılır, ürün bilgileri otomatik doldurulur
12. Miktar girer: 50 m²
13. Renk seçeneğini seçer (kahverengi)
14. İletişim bilgilerini girer (eğer giriş yapmamışsa)
15. Mesaj ekler: "Proje için acil teslimat gerekiyor"
16. Formu gönderir
17. Onay mesajı görünür
18. Teklif isteği geçmişinden durumu takip edebilir

### Senaryo 2: Admin Yeni WPC Ürünü Ekliyor
1. Admin paneline giriş yapar
2. WPC Ürünleri menüsüne gider
3. "Yeni Ekle" butonuna tıklar
4. Formu doldurur:
   - Ürün adı: "WPC Döşeme Plank Premium"
   - Kategori: Döşeme
   - Görseller yükler (çoklu görsel)
   - Teknik özellikler: 140x20mm, 4m uzunluk
   - Renk seçenekleri: Kahverengi, Gri, Koyu Gri
   - Fiyat: 450 TL/m²
   - Stok miktarı: 500 m²
   - Detaylı açıklama
5. Form validasyonu çalışır
6. Kaydet butonuna tıklar
7. Loading state gösterilir
8. Başarılı mesajı görünür ve liste sayfasına yönlendirilir

### Senaryo 3: Kullanıcı Toplu Alım İçin Teklif İstiyor
1. Ürün detay sayfasında "Teklif İste" butonuna tıklar
2. Teklif isteği formu açılır
3. Ürün bilgileri otomatik doldurulur
4. Miktar girer: 200 m²
5. İletişim bilgilerini girer
6. Mesaj ekler: "Proje için acil teslimat gerekiyor"
7. Formu gönderir
8. Onay mesajı görünür
9. Admin panelinde teklif isteği görünür

## Notlar ve Özel Gereksinimler

1. **Dil**: Tüm metinler Türkçe olmalı
2. **Tarih Formatı**: Türkçe tarih formatı (DD.MM.YYYY)
3. **Para Birimi**: TL (₺) gösterimi
4. **Birim Gösterimleri**: 
   - Metrekare: m²
   - Metre: m
   - Metreküp: m³
   - Kilogram: kg
   - Adet: adet
5. **Resim Boyutları**: 
   - Ürün görselleri için en az 1200x1200px (kare format)
   - Proje görselleri için en az 1920x1080px (landscape)
   - Banner görselleri için en az 1920x600px
6. **Fiyatlandırma Formatları**:
   - Metrekare bazlı: "450 ₺/m²"
   - Metre bazlı: "125 ₺/m"
   - Adet bazlı: "85 ₺/adet"
7. **Ürün Özellikleri**:
   - Boyut (uzunluk x genişlik x kalınlık)
   - Renk seçenekleri (görsel ile)
   - Malzeme kompozisyonu
   - Teknik özellikler (UV koruma, su geçirmezlik, vb.)
   - Kullanım alanları
   - Montaj bilgileri
8. **Stok Yönetimi**:
   - Stok durumu göstergesi (stokta var/yok/sınırlı)
   - Stok uyarıları (az stokta)
   - Toplu alımlar için özel fiyatlandırma bilgisi (teklif isteğinde belirtilir)
9. **Teklif İstek Sistemi**:
    - Ürün detay sayfasından teklif isteği
    - Çoklu ürün için teklif isteği (sepet benzeri liste)
    - Teklif formu (ürün, miktar, renk/boyut seçenekleri, iletişim bilgileri)
    - Teklif durumu takibi (beklemede, inceleniyor, teklif gönderildi)
    - Teklif geçmişi (kullanıcı için)
    - Admin panelinde teklif yönetimi ve teklif gönderme
11. **Loading States**: Tüm async işlemlerde loading göstergesi
12. **Error Handling**: Kullanıcı dostu hata mesajları
13. **Accessibility**: Keyboard navigation desteği
14. **Browser Support**: Modern tarayıcılar (Chrome, Firefox, Safari, Edge)
15. **Özel Özellikler**:
    - Ürün karşılaştırma tablosu
    - Favoriler listesi
    - Son görüntülenen ürünler
    - Benzer ürünler önerisi
    - Metrekare/metre hesaplama aracı
    - Fiyat tahmini widget'ı (teklif için)
    - Çoklu ürün teklif isteği (sepet benzeri liste)

## Beklenen Çıktı

Bu prompt ile geliştirilen frontend:
- ✅ Modern ve profesyonel görünümlü
- ✅ Tam responsive (mobil öncelikli)
- ✅ Hızlı ve optimize edilmiş
- ✅ SEO dostu
- ✅ Güvenli (XSS, CSRF korumalı)
- ✅ Erişilebilir
- ✅ Kullanıcı dostu
- ✅ Type-safe (TypeScript)
- ✅ Production-ready

---

## WPC Ürün Kategorileri Örnekleri

1. **WPC Döşeme**
   - Döşeme plakları
   - Teras döşemeleri
   - Bahçe döşemeleri
   - Havuz kenarı döşemeleri

2. **WPC Cephe Kaplama**
   - Cephe panelleri
   - Kompozit cephe kaplama
   - Dekoratif cephe panelleri

3. **WPC Çit ve Paravan**
   - Çit panelleri
   - Bahçe paravanları
   - Dekoratif çitler

4. **WPC Pergola ve Gölgelik**
   - Pergola kirişleri
   - Gölgelik sistemleri
   - Dekoratif pergola elemanları

5. **WPC Zemin Kaplama**
   - Deck döşemeleri
   - Yürüme yolu döşemeleri
   - Zemin kaplama plakları

## İnşaat Malzemeleri Kategorileri

1. **Yapı Malzemeleri**
   - Beton ve çimento ürünleri
   - Tuğla ve kiremit
   - Yalıtım malzemeleri

2. **Ahşap Ürünler**
   - Ahşap döşeme
   - Ahşap cephe kaplama
   - Ahşap çit ve paravan

3. **Metal Ürünler**
   - Çelik yapı malzemeleri
   - Alüminyum profiller
   - Metal çit ve paravan

4. **Dekoratif Malzemeler**
   - Dış cephe kaplamaları
   - Dekoratif paneller
   - Bahçe dekorasyon ürünleri

---

**Not**: Bu prompt, WPC İnşaat Malzemeleri Katalog ve Teklif İstek Platformu'nun frontend geliştirmesi için kapsamlı bir rehberdir. Platform, e-ticaret değil, katalog ve teklif isteği sistemi üzerine kuruludur. Tüm gereksinimler ve best practice'ler bu dokümanda belirtilmiştir. Geliştirme sırasında bu dokümana referans verilmelidir.

