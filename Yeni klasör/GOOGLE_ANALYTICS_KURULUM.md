# Google Analytics 4 Kurulum Rehberi

## 📊 Analytics Özelliği Hakkında

WeCamp projesine Google Analytics 4 entegrasyonu eklendi. Bu özellik ile:

- **Gerçek zamanlı ziyaretçi takibi**
- **Sayfa görüntüleme istatistikleri**
- **Kullanıcı davranış analizleri**
- **Trafik kaynaklarının analizi**
- **Cihaz dağılımı istatistikleri**
- **Özel event tracking**

gibi özelliklere erişebilirsiniz.

## 🚀 Kurulum Adımları

### 1. Google Analytics Hesabı Oluşturma

1. [Google Analytics](https://analytics.google.com/) sayfasına gidin
2. Google hesabınızla giriş yapın
3. "Ölçüm'e Başlayın" butonuna tıklayın
4. Hesap adını belirleyin (örn: "WeCamp")
5. Özellik ayarlarını yapılandırın:
   - Özellik adı: "WeCamp Website"
   - Raporlama saat dilimi: Turkey
   - Para birimi: Turkish Lira (TRY)

### 2. Ölçüm ID'sini Alma

1. Google Analytics Dashboard'da **Admin** (⚙️) bölümüne gidin
2. **Özellik** sütununda **Veri Akışları**'na tıklayın
3. **Web** veri akışını seçin veya oluşturun
4. **Ölçüm ID**'nizi (G-XXXXXXXXXX formatında) kopyalayın

### 3. Projeye Entegrasyon

#### .env Dosyası Oluşturma

1. Proje kök dizininde `.env` dosyası oluşturun (eğer yoksa):

```bash
cp env.example.txt .env
```

2. `.env` dosyasını açın ve Google Analytics ID'nizi ekleyin:

```env
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**ÖNEMLİ:** `G-XXXXXXXXXX` yerine kendi Ölçüm ID'nizi yazın.

#### Development Ortamı

```bash
# Bağımlılıklar zaten yüklü (react-ga4)
npm install

# Development server'ı başlatın
npm run dev
```

#### Production Ortamı

Production build için:

```bash
# Build
npm run build

# Preview
npm run preview
```

**Docker ile çalıştırıyorsanız:**

1. `docker-compose.yml` dosyasında environment değişkenlerini ekleyin:

```yaml
frontend:
  environment:
    - VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Docker container'ları yeniden başlatın:

```bash
docker-compose down
docker-compose up --build
```

## 📈 Analytics Sayfasına Erişim

Analytics sayfasına erişmek için:

1. **Admin paneline** giriş yapın
2. Sol menüde **Analytics** 📈 bölümüne tıklayın
3. Veya doğrudan `/admin/analytics` URL'sine gidin

**Not:** Analytics sayfası sadece admin kullanıcılarına açıktır.

Analytics sayfasında şu bilgileri görebilirsiniz:

- **Toplam Görüntüleme**: Site genelindeki sayfa görüntülemeleri
- **Benzersiz Kullanıcı**: Siteniziyi ziyaret eden benzersiz kullanıcı sayısı
- **Ortalama Oturum Süresi**: Kullanıcıların sitede geçirdiği ortalama süre
- **Hemen Çıkma Oranı**: Tek sayfa görüntüleyerek ayrılan ziyaretçi oranı
- **En Çok Ziyaret Edilen Sayfalar**: Hangi sayfaların daha popüler olduğu
- **Cihaz Dağılımı**: Mobil, masaüstü ve tablet kullanım oranları
- **Trafik Kaynakları**: Ziyaretçilerin nereden geldiği

## 🔍 Takip Edilen Event'ler

Proje şu event'leri otomatik olarak takip eder:

### Sayfa Event'leri
- `page_view` - Sayfa görüntülemeleri
- `view_analytics` - Analytics sayfası görüntüleme

### E-ticaret Event'leri
- `view_item` - Ürün detay sayfası görüntüleme
- `add_to_cart` - Sepete ekleme
- `purchase` - Satın alma

### Kullanıcı Event'leri
- `sign_up` - Kayıt olma
- `login` - Giriş yapma
- `review_submit` - Yorum gönderme

### Etkileşim Event'leri
- `search` - Arama yapma
- `share` - Paylaşım
- `newsletter_signup` - Bültene kayıt
- `contact_form_submit` - İletişim formu gönderme

### Rezervasyon Event'leri
- `begin_checkout` - Rezervasyon başlatma

## 📊 Google Analytics Dashboard'a Erişim

Daha detaylı analiz için Google Analytics kontrol panelini kullanın:

1. Analytics sayfasındaki **"Google Analytics Dashboard'a Git"** butonuna tıklayın
2. Veya doğrudan [analytics.google.com](https://analytics.google.com) adresine gidin

Dashboard'da şunları yapabilirsiniz:

- **Gerçek Zamanlı Raporlar**: Şu anda sitede kaç kişinin olduğunu görün
- **Demografik Bilgiler**: Ziyaretçilerin yaş, cinsiyet ve ilgi alanlarını görün
- **Coğrafi Bilgiler**: Ziyaretçilerin hangi ülke/şehirlerden geldiğini görün
- **Davranış Akışı**: Kullanıcıların sitede nasıl gezindiğini görün
- **Dönüşüm Hunisi**: Kullanıcıların satın alma sürecinde nerede ayrıldığını görün
- **Özel Raporlar**: Kendi özel raporlarınızı oluşturun

## 🔧 Gelişmiş Yapılandırma

### Özel Event Ekleme

Yeni bir event eklemek için `src/utils/analytics.ts` dosyasını kullanın:

```typescript
import { trackEvent } from '@/utils/analytics';

// Örnek: Özel event
trackEvent({
  action: 'button_click',
  category: 'Engagement',
  label: 'Subscribe Button',
  value: 1,
});
```

### User Properties Ayarlama

Kullanıcı özelliklerini ayarlamak için:

```typescript
import { setUserProperties } from '@/utils/analytics';

setUserProperties({
  user_type: 'premium',
  preferred_category: 'camping_gear',
});
```

### E-ticaret Tracking

Ürün görüntüleme:

```typescript
import { trackViewItem } from '@/utils/analytics';

trackViewItem({
  id: 'GEAR123',
  name: 'Kamp Çadırı',
  price: 2500,
  category: 'Çadır',
});
```

Sepete ekleme:

```typescript
import { trackAddToCart } from '@/utils/analytics';

trackAddToCart({
  id: 'GEAR123',
  name: 'Kamp Çadırı',
  price: 2500,
  category: 'Çadır',
  quantity: 1,
});
```

## 🎯 En İyi Pratikler

1. **Event İsimlendirme**: Event isimlerini anlamlı ve tutarlı tutun
2. **Veri Gizliliği**: Kişisel bilgileri (email, telefon vb.) asla tracking'e eklemeyin
3. **Event Limiti**: Google Analytics'in günlük event limitine dikkat edin
4. **Test Ortamı**: Development ortamında ayrı bir Analytics ID kullanın
5. **Bot Filtreleme**: Google Analytics'te bot filtrelemeyi aktif edin
6. **Veri Saklama**: Veri saklama sürelerini gözden geçirin ve ayarlayın

## 🔒 Gizlilik ve GDPR

Google Analytics kullanırken gizlilik yasalarına uyum sağlayın:

1. **Cookie Bildirimi**: Kullanıcıları cookie kullanımı hakkında bilgilendirin
2. **Opt-out Seçeneği**: Kullanıcılara tracking'i reddetme seçeneği sunun
3. **Veri İşleme Anlaşması**: Google ile veri işleme anlaşması yapın
4. **IP Anonimleştirme**: IP adreslerini anonimleştirin (GA4'te varsayılan)

## 📝 Notlar

- Analytics sayfasındaki veriler demo verileridir
- Gerçek veriler için Google Analytics Dashboard'u kullanın
- Verilerin görünmesi 24-48 saat sürebilir
- Realtime raporlar için Google Analytics Dashboard'u kullanın

## 🆘 Sorun Giderme

### Analytics Çalışmıyor

1. `.env` dosyasında `VITE_GA_MEASUREMENT_ID` doğru mu?
2. Development server'ı yeniden başlattınız mı?
3. Browser console'da hata var mı?
4. Ad blocker devre dışı mı?

### Veriler Görünmüyor

1. 24-48 saat bekleyin (ilk veriler için)
2. Google Analytics Dashboard'da Realtime bölümünü kontrol edin
3. Test modunda mı çalışıyorsunuz?
4. Ölçüm ID'si doğru mu?

### Event'ler Kaydedilmiyor

1. Browser console'da "GA Event:" loglarını kontrol edin
2. Google Analytics Debug View'i aktif edin
3. Network sekmesinde analytics isteklerini kontrol edin

## 📚 Kaynaklar

- [Google Analytics 4 Dokümantasyonu](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [React GA4 NPM Package](https://www.npmjs.com/package/react-ga4)

## 🎉 Tebrikler!

Google Analytics entegrasyonu başarıyla tamamlandı! Artık site performansınızı ve kullanıcı davranışlarını takip edebilirsiniz.

---

**Geliştirici:** WeCamp Team  
**Versiyon:** 1.0.0  
**Tarih:** 2025

