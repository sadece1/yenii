# 🏕️ CampScape - Frontend Only Mode

**Modern Kamp ve Outdoor Ekipman Kiralama Platformu**

> ⚠️ **Bu proje tamamen FRONTEND modunda çalışmaktadır**  
> Backend sunucusu olmadan, tüm veriler localStorage kullanılarak tarayıcıda saklanır.

## 🎯 Özellikler

### ✅ Tamamen Çalışan Frontend Sistemi
- ✨ **Kullanıcı Yönetimi**: Kayıt, giriş, profil düzenleme (localStorage)
- 🏕️ **Kamp Ekipmanları**: 100+ ürün, filtreleme, arama, kategori bazlı görünüm
- 📝 **Blog Sistemi**: Yazı ekleme, düzenleme, silme, kategorizasyon
- 💬 **Yorum Sistemi**: Ürün ve kamp alanı değerlendirmeleri
- 🔖 **Referans Markalar**: Marka yönetimi ve gösterimi
- 🗂️ **Kategori Yönetimi**: Hiyerarşik kategori yapısı
- 📊 **Admin Paneli**: Tüm içerik yönetimi
- 🎨 **Modern UI**: Responsive tasarım, animasyonlar

### 💾 LocalStorage Tabanlı Veri Yönetimi
Tüm veriler tarayıcıda saklanır:
- `campscape_users` - Kullanıcı hesapları
- `camp_gear_storage` - Kamp ekipmanları
- `camp_blogs_storage` - Blog yazıları
- `camp_reviews_storage` - Yorumlar
- `camp_campsites_storage` - Kamp alanları
- `reference_brands_storage` - Referans markalar
- `camp_categories_storage` - Kategoriler
- `camp_brands_storage` - Markalar
- `camp_colors_storage` - Renkler
- ... ve daha fazlası

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcınızda otomatik olarak `http://localhost:5173` açılacaktır.

### Build

```bash
# Production build
npm run build

# Preview build
npm run preview
```

## 📁 Proje Yapısı

```
├── src/
│   ├── components/        # React bileşenleri
│   ├── pages/            # Sayfa bileşenleri
│   ├── services/         # API servisleri (localStorage tabanlı)
│   ├── stores/           # Zustand state yönetimi
│   ├── types/            # TypeScript tipleri
│   ├── utils/            # Yardımcı fonksiyonlar
│   └── App.tsx           # Ana uygulama bileşeni
├── public/               # Statik dosyalar
└── index.html           # HTML şablonu
```

## 🔐 Giriş Bilgileri

### Admin Hesabı
- **E-posta**: admin@campscape.com
- **Şifre**: Admin123!

### Test Kullanıcıları
- **E-posta**: user1@campscape.com
- **Şifre**: User123!

veya

- **E-posta**: user2@campscape.com
- **Şifre**: User123!

## 🛠️ Teknolojiler

- **React 18** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool ve dev server
- **Zustand** - State yönetimi
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar
- **GSAP** - İleri animasyonlar
- **React Hook Form** - Form yönetimi
- **Axios** - HTTP client (mock mode)

## 📦 Önemli Notlar

### Frontend-Only Mode
Bu proje **tamamen frontend modunda** çalışır:
- ❌ **Backend API yok** - Tüm API çağrıları localStorage'a yönlendirilir
- ❌ **Veritabanı yok** - Veriler tarayıcıda saklanır
- ❌ **Gerçek kimlik doğrulama yok** - Mock authentication
- ✅ **Tam özellikli demo** - Tüm özellikler çalışır durumdadır

### Veri Kalıcılığı
- Veriler tarayıcı localStorage'ında saklanır
- Tarayıcı önbelleği temizlenirse veriler kaybolur
- Her tarayıcının kendi ayrı verisi vardır
- Developer Tools > Application > Local Storage'dan veriler görülebilir

### Dosya Yüklemeleri
- Resimler **base64 data URL** olarak saklanır
- Büyük resimler localStorage limitine takılabilir (genellikle 5-10MB)
- Production'da backend ve dosya sunucusu önerilir

## 🎨 Özelleştirme

### Renk Teması
`tailwind.config.js` dosyasından renk paletini özelleştirebilirsiniz.

### Mock Veriler
İlk yüklemelerde otomatik olarak örnek veriler oluşturulur:
- 100+ kamp ekipmanı
- Çeşitli kategoriler
- Örnek blog yazıları
- Demo markalar ve renkler

## 📱 Responsive Tasarım

Tüm ekran boyutları desteklenir:
- 📱 Mobil (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔧 Geliştirme

### Yeni Özellik Ekleme

1. `src/services/` altında yeni servis oluştur
2. localStorage kullanarak veri yönetimi ekle
3. `src/components/` veya `src/pages/` altında UI bileşeni oluştur
4. Gerekirse `src/stores/` altında state yönetimi ekle

### Debug

Tarayıcı Developer Tools kullanarak:
- **Console**: Hata ve log mesajları
- **Application > Local Storage**: Saklanan veriler
- **Network**: API çağrıları (hepsi hata verecek, bu normal)

## 📄 Lisans

MIT License - İstediğiniz gibi kullanabilirsiniz!

## 🤝 Katkıda Bulunma

Bu bir demo projedir. Fork'layıp geliştirmeler yapabilirsiniz.

## 📞 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**Not**: Bu proje tamamen eğitim ve demo amaçlıdır. Production kullanımı için backend API ve veritabanı eklenmesi önerilir.
