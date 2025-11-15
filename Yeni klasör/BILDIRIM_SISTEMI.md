# 🔔 Admin Panel Bildirim Sistemi

Admin panelinde yeni hareketlilikleri takip etmek için bildirim sistemi eklendi!

## ✨ Özellikler

### 1. **Dashboard'da Bildirim Badge'i**
- Dashboard menü linkinde kırmızı bir badge gösterilir
- Okunmamış bildirim sayısını gösterir (örn: `1`, `5`, `12`)
- Gerçek zamanlı olarak güncellenir

### 2. **Header'da Bildirim İkonu**
- Admin panelinin sağ üst köşesinde 🔔 ikonu
- Kırmızı badge ile okunmamış bildirim sayısı
- Tıklandığında bildirim dropdown'ı açılır

### 3. **Bildirim Dropdown'ı**
- Son 50 bildirimi gösterir
- Her bildirim için:
  - İkon (mesaj, randevu, sipariş, kullanıcı, vb.)
  - Başlık ve açıklama
  - Tarih/saat bilgisi
  - Okunmamış bildirimlerde mavi nokta işareti
- "Tümünü Okundu İşaretle" butonu
- Bildirimlere tıklandığında ilgili sayfaya yönlendirilir

## 📢 Bildirim Türleri

Sistem şu aktiviteler için otomatik bildirim oluşturur:

### 🎯 Otomatik Bildirimler

| Aktivite | İkon | Açıklama |
|----------|------|----------|
| Yeni Mesaj | 💬 | İletişim formundan yeni mesaj geldiğinde |
| Yeni Randevu | 📅 | Yeni randevu talebi oluşturulduğunda |
| Yeni Kullanıcı | 👤 | Admin panelinden yeni kullanıcı eklendiğinde |
| Yeni Abone | 📧 | Bültene yeni abonelik yapıldığında |
| Yeni Sipariş | 📦 | Yeni sipariş oluşturulduğunda |
| Yeni Yorum | ⭐ | Ürün/kamp alanı için yeni yorum yazıldığında |

## 🚀 Nasıl Çalışır?

### 1. **Otomatik İzleme**
Dashboard sayfası açıldığında sistem:
- Mesajları, randevuları, abonelikleri izler
- Önceki sayılar ile karşılaştırır
- Yeni aktivite tespit edildiğinde bildirim oluşturur

### 2. **Manuel Bildirim Ekleme**
Kod içinde bildirim eklemek için:

```typescript
import { useNotificationStore } from '@/store/notificationStore';

const { addNotification } = useNotificationStore();

addNotification({
  type: 'message',  // 'message' | 'appointment' | 'order' | 'review' | 'user' | 'newsletter'
  title: 'Yeni Mesaj',
  description: 'Ali Yılmaz: Ürün hakkında soru',
  link: routes.adminMessages,  // Tıklandığında gidilecek sayfa
});
```

### 3. **Veri Saklama**
- Bildirimler `localStorage`'da saklanır
- Sayfa yenilense bile bildirimler korunur
- En son 50 bildirim tutulur

## 🎨 Kullanıcı Deneyimi

### Badge Renkleri
- **Kırmızı Badge**: Sayı içeren bildirimler (1, 2, 3, ...)
- **Yeşil Badge**: Metin içeren özellikler ("Yeni", "Beta", ...)

### Okunma Durumu
- **Okunmamış**: Açık mavi arka plan + mavi nokta işareti
- **Okunmuş**: Normal arka plan
- Bildirimlere tıklandığında otomatik okundu işaretlenir

### Dropdown Davranışı
- Bildirim ikonuna tıklandığında açılır/kapanır
- Dropdown dışına tıklandığında otomatik kapanır
- Bildirimlere tıklandığında ilgili sayfaya yönlendirir ve dropdown kapanır

## 🧪 Test Etme

### Development Modunda Test Butonu
Admin Dashboard'da (sadece geliştirme ortamında) bir test butonu bulunur:
- **"🔔 Test Bildirimi Ekle"** butonu
- Tıklandığında demo bildirim oluşturur
- Production'da görünmez

### Manuel Test
1. Admin panelinden yeni kullanıcı oluşturun
2. Header'daki 🔔 ikonunda badge belirecek
3. Dashboard menüsünde kırmızı badge göreceksiniz
4. Bildirim ikonuna tıklayarak bildirimi görüntüleyin

## 📱 Responsive Tasarım

- Mobil cihazlarda dropdown daha dar görünür
- Bildirim içerikleri uzunsa otomatik kısaltılır
- Liste kaydırılabilir (max-height: 96)

## 🔒 Güvenlik

- Bildirimler kullanıcı bazında tutulur
- Farklı admin kullanıcıları kendi bildirimlerini görür
- XSS koruması için içerikler sanitize edilir

## 🎯 Kullanım Örnekleri

### Yeni Kullanıcı Bildirimi
```typescript
addNotification({
  type: 'user',
  title: 'Yeni Kullanıcı Oluşturuldu',
  description: 'Ahmet Yılmaz (ahmet@example.com) adlı kullanıcı başarıyla oluşturuldu.',
  link: routes.adminUsers,
});
```

### Yeni Mesaj Bildirimi
```typescript
addNotification({
  type: 'message',
  title: '3 Yeni Mesaj',
  description: 'Mehmet Demir: Ürün stok durumu hakkında',
  link: routes.adminMessages,
});
```

### Yeni Randevu Bildirimi
```typescript
addNotification({
  type: 'appointment',
  title: 'Yeni Randevu Talebi',
  description: 'Ayşe Kaya - 15.12.2024 14:00',
  link: routes.adminAppointments,
});
```

## 🛠️ Teknik Detaylar

### Store Yapısı
- **Zustand** ile state yönetimi
- **localStorage** ile kalıcılık
- Otomatik persist middleware

### Componentler
- `AdminLayout`: Header'da bildirim ikonu ve dropdown
- `notificationStore`: Bildirim state yönetimi
- Her admin sayfası: İlgili aktivite için bildirim ekleme

### Performans
- Lazy loading: Dropdown sadece açıldığında render edilir
- Optimistic updates: Bildirimler hemen eklenir
- Debounce: Çoklu bildirimler birleştirilir

## 🎉 Sonuç

Admin paneli artık tüm önemli aktivitelerden sizi haberdar ediyor! 
Hiçbir yeni mesaj, randevu veya kullanıcı gözünüzden kaçmayacak.

---

**Not**: Bu sistem frontend-only modda çalışır. Backend entegrasyonu yapıldığında 
real-time WebSocket bildirimleri eklenebilir.


