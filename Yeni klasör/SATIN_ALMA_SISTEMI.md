# Satın Alma Sistemi Kurulum ve Kullanım Kılavuzu

## 🎉 Yeni Özellik: Kullanıcı Satın Alma Sistemi

Kayıtlı kullanıcılar artık ürünleri satın alabilir ve siparişlerini takip edebilir!

## 📋 Özellikler

### Kullanıcılar İçin:
- ✅ Ürün detay sayfasından tek tıkla satın alma
- ✅ Sipariş geçmişini görüntüleme (Profil > Siparişlerim)
- ✅ Sipariş durumu takibi (Bekleniyor, Ürün Geldi, Yola Çıktı)
- ✅ Sipariş notlarını görüntüleme
- ✅ Kargo takip bilgileri

### Admin İçin:
- ✅ Tüm siparişleri görüntüleme ve yönetme
- ✅ Sipariş durumlarını güncelleme
- ✅ Kullanıcıya gösterilecek ve özel notlar ekleme
- ✅ Kargo tarihi ve saati kaydetme
- ✅ Sipariş filtreleme ve arama

## 🚀 Kurulum Adımları

### 1. Veritabanı Migration'ını Çalıştırın

Backend dizininde SQL migration dosyasını çalıştırın:

```bash
cd server
```

MySQL'e bağlanın ve migration'ı çalıştırın:

```sql
-- MySQL'e bağlan
mysql -u root -p

-- Veritabanını seç
USE campscape_marketplace;

-- Migration dosyasını çalıştır
SOURCE src/migrations/user_orders.sql;
```

Veya direkt olarak:

```bash
mysql -u root -p campscape_marketplace < src/migrations/user_orders.sql
```

### 2. Backend'i Yeniden Başlatın

```bash
cd server
npm run dev
```

### 3. Frontend'i Yeniden Başlatın

```bash
cd ..
npm run dev
```

## 📱 Kullanım

### Kullanıcı Olarak Satın Alma:

1. **Giriş Yapın**: Önce sisteme giriş yapmanız gerekiyor
2. **Ürün Seçin**: Gear (Malzemeler) sayfasından bir ürün seçin
3. **Satın Al**: Ürün detay sayfasında sağ taraftaki "🛒 Satın Al" butonuna tıklayın
4. **Onaylayın**: Açılan modalda bilgileri kontrol edip "Satın Al" butonuna tıklayın
5. **Takip Edin**: Profilinizden "Siparişlerim" sekmesine giderek siparişinizi takip edin

### Admin Olarak Sipariş Yönetimi:

1. **Admin Paneline Gidin**: `/admin/user-orders` sayfasına gidin
2. **Siparişleri Görün**: Tüm kullanıcı siparişlerini listede görürsünüz
3. **Sipariş Düzenle**: Bir siparişin yanındaki "Düzenle" butonuna tıklayın
4. **Durumu Güncelleyin**:
   - **Bekleniyor (⏳)**: Sipariş alındı, hazırlanıyor
   - **Ürün Geldi (📦)**: Ürün depoya/mağazaya geldi
   - **Yola Çıktı (🚚)**: Ürün kargoya verildi (tarih ve saat girin)
5. **Not Ekleyin**:
   - **Kullanıcıya Gösterilecek Not**: Kullanıcı bu notu görebilir
   - **Özel Not**: Sadece admin görebilir

## 🔑 API Endpoints

### Kullanıcı Endpoints:
- `POST /api/user-orders` - Yeni sipariş oluştur (authenticated)
- `GET /api/user-orders` - Kendi siparişlerini getir (authenticated)
- `GET /api/user-orders/:id` - Sipariş detayını getir (authenticated, owner)

### Admin Endpoints:
- `GET /api/user-orders?userId=xxx` - Belirli kullanıcının siparişlerini getir (admin)
- `GET /api/user-orders?status=waiting` - Duruma göre filtrele (admin)
- `PUT /api/user-orders/:id` - Sipariş güncelle (admin only)
- `DELETE /api/user-orders/:id` - Sipariş sil (admin only)

## 📊 Veritabanı Yapısı

```sql
user_orders
├── id (VARCHAR(36), PRIMARY KEY)
├── user_id (VARCHAR(36), FOREIGN KEY -> users.id)
├── gear_id (VARCHAR(36), FOREIGN KEY -> gear.id)
├── status (ENUM: 'waiting', 'arrived', 'shipped')
├── price (DECIMAL(10,2))
├── public_note (TEXT)
├── private_note (TEXT)
├── shipped_date (DATE)
├── shipped_time (TIME)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🎨 Görsel Akış

### Kullanıcı Akışı:
```
Ürün Detay → Satın Al Butonu → Onay Modalı → Sipariş Oluştur 
   ↓
Profil > Siparişlerim → Sipariş Durumu Görüntüle
```

### Admin Akışı:
```
Admin Panel → Sipariş Yönetimi → Sipariş Listesi
   ↓
Sipariş Düzenle → Durum Güncelle → Not Ekle → Kaydet
```

## 🔒 Güvenlik

- ✅ Tüm API'ler authentication gerektiriyor
- ✅ Kullanıcılar sadece kendi siparişlerini görebilir
- ✅ Sadece adminler sipariş ekleyebilir/güncelleyebilir/silebilir
- ✅ Private notlar sadece adminlere görünür
- ✅ SQL injection koruması (parametreli sorgular)
- ✅ Input validation

## 📝 Notlar

- Sipariş oluşturulduğunda otomatik olarak "Bekleniyor" durumunda başlar
- "Yola Çıktı" durumuna geçerken tarih ve saat zorunludur
- Kullanıcılar localStorage'da da yedeklenir (offline fallback)
- Admin panelinde tüm siparişler tarihe göre sıralanır (en yeni önce)

## 🐛 Sorun Giderme

### Migration Hatası:
```bash
# Tabloyu sıfırlayın (SADECE DEVELOPMENT'ta!)
DROP TABLE IF EXISTS user_orders;

# Migration'ı tekrar çalıştırın
SOURCE src/migrations/user_orders.sql;
```

### API Bağlantı Hatası:
1. Backend'in çalıştığından emin olun: `http://localhost:8000/health`
2. `.env` dosyasını kontrol edin
3. CORS ayarlarını kontrol edin

### Sipariş Görünmüyor:
1. Veritabanını kontrol edin: `SELECT * FROM user_orders;`
2. Browser console'u kontrol edin
3. Network tab'inde API isteklerini kontrol edin

## 🎯 Gelecek Geliştirmeler

- [ ] Email bildirimleri (sipariş durumu değiştiğinde)
- [ ] SMS bildirimleri
- [ ] Sipariş iptal etme
- [ ] Toplu sipariş işlemleri (admin)
- [ ] Sipariş istatistikleri ve raporlar
- [ ] PDF fatura oluşturma
- [ ] Ödeme entegrasyonu

## 📞 Destek

Herhangi bir sorun yaşarsanız lütfen issue açın veya bizimle iletişime geçin.

---

**Son Güncelleme**: 2025-01-11
**Versiyon**: 1.0.0




