# ⚡ Dokploy Quick Start - 10 Dakikada Deploy

## 🎯 Hızlı Başlangıç

### ✅ Ön Gereksinimler

- [ ] Dokploy hesabı (https://dokploy.com)
- [ ] GitHub repository'de kod
- [ ] 10 dakika boş zamanınız

---

## 🚀 5 Adımda Deploy

### 1️⃣ Environment Variables Hazırla (3 dakika)

**Strong secrets oluştur:**

```bash
# Terminal'de çalıştır
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex')")"
echo "JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex')")"
echo "DB_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(24).toString('base64')")"
```

Çıktıları kopyala ve bir yere not et.

### 2️⃣ Dokploy'da MySQL Oluştur (2 dakika)

1. Dokploy Dashboard → **"Services"**
2. **"Add Service"** → MySQL 8.0
3. Settings:
   ```
   Name: campscape-mysql
   Database: campscape_marketplace
   Root Password: [yukarıda oluşturduğun DB_PASSWORD]
   ```
4. **"Create"**

### 3️⃣ Backend Application Oluştur (2 dakika)

1. Dokploy Dashboard → **"New Application"**
2. Settings:
   ```
   Name: campscape-backend
   Type: Docker
   Repository: [GitHub repo URL]
   Branch: main
   Dockerfile Path: server/Dockerfile
   Build Context: server/
   ```
3. **"Create"**

### 4️⃣ Environment Variables Ekle (2 dakika)

Application → **"Environment Variables"** → Şunları ekle:

```env
NODE_ENV=production
PORT=3000

# Database (Dokploy MySQL)
DB_HOST=campscape-mysql
DB_USER=root
DB_PASSWORD=[yukarıdaki DB_PASSWORD]
DB_NAME=campscape_marketplace
DB_PORT=3306

# JWT (yukarıda oluşturduklarını kullan)
JWT_SECRET=[yukarıdaki JWT_SECRET]
JWT_REFRESH_SECRET=[yukarıdaki JWT_REFRESH_SECRET]
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Frontend (sonra değiştireceksin)
FRONTEND_URL=https://campscape.com
ALLOWED_ORIGINS=https://campscape.com

# Diğerleri (default değerler)
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
HTTPS_ENFORCE=true
LOG_LEVEL=info
```

### 5️⃣ Deploy! (1 dakika)

1. **"Deploy"** butonuna bas
2. Build loglarını izle (2-3 dakika)
3. ✅ **Success!**

---

## 🔧 Volumes Ekle (1 dakika)

Application → **"Volumes"**:

```
Volume 1:
  Name: campscape-uploads
  Mount Path: /app/uploads

Volume 2:
  Name: campscape-logs
  Mount Path: /app/logs
```

**"Save"** → **"Redeploy"**

---

## 🗄️ Database Migration (2 dakika)

Dokploy Console → Backend Container:

```bash
npm run db:migrate
npm run db:seed
```

---

## ✅ Test Et (1 dakika)

```bash
# Health Check
curl https://your-app.dokploy.app/health
# Beklenen: {"status":"OK","message":"Server is running"}

# Gear List
curl https://your-app.dokploy.app/api/gear
# Beklenen: JSON array with gear items

# Login Test
curl -X POST https://your-app.dokploy.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campscape.com","password":"Admin123!"}'
# Beklenen: JSON with token
```

---

## 🌐 Domain Ekle (İsteğe Bağlı)

Application → **"Domains"**:

```
Domain: api.campscape.com
SSL: Let's Encrypt (automatic)
```

DNS Provider'da:
```
Type: A
Name: api
Value: [Dokploy IP]
```

---

## 🎉 Tamamlandı!

Backend şimdi çalışıyor! 🚀

**API URL:** `https://your-app.dokploy.app`

### Sonraki Adımlar:

1. Frontend'i deploy et
2. Frontend'de `VITE_API_URL` güncelle
3. Security testlerini çalıştır
4. Monitoring kur (Sentry)

---

## 🆘 Sorun mu var?

### Build Failed?
- `package-lock.json` commit edilmiş mi kontrol et
- Dockerfile path doğru mu? (`server/Dockerfile`)

### Database Connection Error?
- MySQL servisi çalışıyor mu?
- `DB_HOST=campscape-mysql` (service name)

### CORS Error?
- `ALLOWED_ORIGINS` frontend domain'inle aynı mı?

**Detaylı troubleshooting:** `DOKPLOY_DEPLOYMENT.md`

---

**Hazırlayan:** AI DevOps Assistant  
**Tarih:** 14 Kasım 2025

**⚡ 10 dakikada deploy! Başarılar!** 🎉


