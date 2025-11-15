# 🔧 Hata Çözümü - Backend 500 Error

## 🚨 **Sorun:**
- Backend API 500 hatası veriyor
- Yorumlar gönderilemiyor
- Mock data kullanılıyor

## ✅ **ÇÖZÜM ADIMLARI**

### **1. Backend'i Başlatın**

Yeni bir terminal açın:

```bash
cd server
npm run dev
```

**Beklenen çıktı:**
```
Server running on port 8000
Database connected successfully
```

**❌ Hata alırsanız:** Adım 2'ye geçin

---

### **2. Database Migration Çalıştırın**

MySQL'e bağlanın ve migration'ı çalıştırın:

```bash
# MySQL'e bağlan
mysql -u root -p

# Veritabanını seç
USE campscape_marketplace;

# Migration'ı çalıştır
SOURCE server/src/migrations/reviews.sql;

# Kontrol et
SHOW TABLES;
```

**Görmemiz gerekenler:**
- ✅ `campsite_reviews`
- ✅ `gear_reviews`
- ✅ `review_photos`
- ✅ `review_helpful_votes`
- ✅ `review_reports`

---

### **3. Backend Loglarını Kontrol Edin**

Terminal'de backend'i çalıştırdığınızda şu hatalardan biri görülebilir:

#### **A. Database Bağlantı Hatası:**
```
Error: connect ECONNREFUSED
ER_ACCESS_DENIED_ERROR
```

**Çözüm:**
`server/.env` dosyasını kontrol edin:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password  # ← Burası doğru mu?
DB_NAME=campscape_marketplace
```

#### **B. Tablo Bulunamadı:**
```
Table 'campscape_marketplace.campsite_reviews' doesn't exist
```

**Çözüm:** Migration çalıştırın (Adım 2)

#### **C. Port Hatası:**
```
Error: listen EADDRINUSE :::8000
```

**Çözüm:** Port zaten kullanımda, başka bir process'i kapatın:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8000
kill -9 <PID>
```

---

### **4. Frontend API URL'ini Kontrol Edin**

`.env` dosyası (root dizinde):
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### **5. Test Edin**

#### **Backend Health Check:**
```bash
curl http://localhost:8000/health
```

**Beklenen:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "Server is running"
}
```

#### **Review API Test:**
```bash
curl http://localhost:8000/api/reviews-new/gear/1
```

---

## 🎯 **HIZLI ÇÖZÜM**

Eğer hala çalışmıyorsa, sıfırdan başlatın:

```bash
# 1. Backend'i durdurun (Ctrl+C)

# 2. Migration'ı çalıştırın
mysql -u root -p campscape_marketplace < server/src/migrations/reviews.sql

# 3. Backend'i tekrar başlatın
cd server
npm run dev

# 4. Başka terminalde frontend'i başlatın
npm run dev
```

---

## 📋 **KONTROL LİSTESİ**

- [ ] MySQL çalışıyor mu? (`mysql -u root -p`)
- [ ] Database var mı? (`SHOW DATABASES;`)
- [ ] Migration çalıştı mı? (`SHOW TABLES;`)
- [ ] Backend çalışıyor mu? (`http://localhost:8000/health`)
- [ ] `.env` dosyası doğru mu?
- [ ] Port 8000 boş mu?

---

## 🐛 **YAYGIN HATALAR**

### **1. "ER_BAD_DB_ERROR"**
```
Error: Unknown database 'campscape_marketplace'
```

**Çözüm:**
```sql
CREATE DATABASE campscape_marketplace;
USE campscape_marketplace;
SOURCE server/src/migrations/schema.sql;
SOURCE server/src/migrations/reviews.sql;
```

### **2. "Authentication plugin error"**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### **3. "CORS Error"**
Backend `.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 📞 **Hala Çalışmıyor mu?**

Backend terminal çıktısını paylaşın, size yardımcı olayım!

**Kontrol edilecekler:**
1. Backend terminal çıktısı
2. Browser console (F12) hataları
3. MySQL bağlantı durumu
4. `.env` dosya içeriği (şifreler hariç)




