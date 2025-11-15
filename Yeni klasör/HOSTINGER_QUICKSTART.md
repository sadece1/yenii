# ⚡ Hostinger + Dokploy - 20 Dakikada Deploy

## 🎯 Hızlı Başlangıç Rehberi

**Platform:** Hostinger VPS + Dokploy  
**Süre:** 20-30 dakika  
**Seviye:** Beginner-Friendly

---

## 📋 Gereksinimler

- ✅ Hostinger VPS (VPS 1 veya üzeri)
- ✅ Domain name
- ✅ GitHub repository

---

## 🚀 5 Basit Adım

### 1️⃣ Hostinger VPS Hazırla (5 dakika)

#### SSH ile Bağlan
```bash
ssh root@your-hostinger-vps-ip
# Hostinger email'deki şifreyi gir
```

#### Docker Kur
```bash
# Docker otomatik kurulum
curl -fsSL https://get.docker.com | sh
```

#### Dokploy Kur
```bash
# Dokploy tek komut kurulum
curl -sSL https://dokploy.com/install.sh | sh
```

#### Firewall Yapılandır
```bash
# Portları aç
ufw allow 22,80,443,3000/tcp
ufw enable
```

**✅ Dokploy Dashboard: `http://your-vps-ip:3000`**

---

### 2️⃣ DNS Ayarla (3 dakika)

**Hostinger Panel → Domains → DNS Records:**

```
Type: A
Name: api
Value: YOUR_VPS_IP
TTL: 300

Type: A
Name: @
Value: YOUR_VPS_IP
TTL: 300
```

**Test:**
```bash
nslookup api.campscape.com
# Beklenen: YOUR_VPS_IP
```

---

### 3️⃣ MySQL Oluştur (2 dakika)

**Dokploy Dashboard** → `http://your-vps-ip:3000`

1. **Services** → **Add Service** → **MySQL 8.0**
2. **Settings:**
   ```
   Name: campscape-mysql
   Database: campscape_marketplace
   Root Password: [STRONG_PASSWORD]
   ```
3. **Create**

---

### 4️⃣ Backend Deploy (5 dakika)

#### GitHub'a Push
```bash
git add .
git commit -m "Production ready"
git push origin main
```

#### Dokploy'da Application Oluştur

1. **Applications** → **New Application**
2. **Config:**
   ```
   Name: campscape-backend
   Type: Docker
   Repository: GitHub → your-repo
   Branch: main
   Dockerfile: server/Dockerfile
   Context: server/
   Port: 3000
   ```

#### Environment Variables Ekle

**Copy-paste ready değerler:**

```env
NODE_ENV=production
PORT=3000
DB_HOST=campscape-mysql
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=campscape_marketplace
DB_PORT=3306
JWT_SECRET=GENERATE_WITH_COMMAND_BELOW
JWT_REFRESH_SECRET=GENERATE_WITH_COMMAND_BELOW
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://campscape.com
ALLOWED_ORIGINS=https://campscape.com,https://api.campscape.com
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
HTTPS_ENFORCE=true
LOG_LEVEL=info
```

**Strong Secrets Oluştur:**
```bash
# JWT_SECRET için
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_REFRESH_SECRET için
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Volumes Ekle

```
Volume 1: campscape-uploads → /app/uploads
Volume 2: campscape-logs → /app/logs
```

#### Domain ve SSL

```
Domain: api.campscape.com
SSL: Let's Encrypt ✅
Force HTTPS: ✅
```

3. **Deploy** butonuna bas!

---

### 5️⃣ Migration ve Test (5 dakika)

#### Database Migration

**Dokploy Console** → Backend Container:

```bash
npm run db:migrate
npm run db:seed
```

#### Test Et

```bash
# Health check
curl https://api.campscape.com/health

# API test
curl https://api.campscape.com/api/gear

# Login test
curl -X POST https://api.campscape.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campscape.com","password":"Admin123!"}'
```

---

## ✅ Tamamlandı!

**Backend çalışıyor:** `https://api.campscape.com` 🎉

### Credentials

```
API Admin:
  Email: admin@campscape.com
  Password: Admin123!

Dokploy Dashboard:
  URL: http://your-vps-ip:3000
  Email: [sizin email'iniz]
```

---

## 🆘 Sorun mu var?

### Build Failed?
```bash
# Disk space kontrol
df -h
# Docker temizle
docker system prune -a
```

### Database Bağlanamıyor?
```bash
# MySQL çalışıyor mu?
docker ps | grep mysql
# Logs kontrol
docker logs campscape-mysql
```

### DNS Çalışmıyor?
```bash
# Propagation bekle (5-30 dakika)
nslookup api.campscape.com
# Online test: dnschecker.org
```

### SSL Hatası?
```bash
# Port 80/443 açık mı?
ufw status
# Domain DNS'i doğru mu?
nslookup api.campscape.com
```

---

## 📚 Detaylı Rehber

Daha fazla bilgi için: **HOSTINGER_DOKPLOY_DEPLOYMENT.md**

---

## 🔐 Security Checklist (Önemli!)

- [ ] Strong MySQL password kullandın mı?
- [ ] JWT secrets yeni generate ettin mi?
- [ ] Firewall aktif mi?
- [ ] SSL çalışıyor mu?
- [ ] Backup scripti kurdun mu?

**Backup script:** HOSTINGER_DOKPLOY_DEPLOYMENT.md → Bölüm 9.3

---

## 💰 Maliyet

**Hostinger VPS 2 (Önerilen):**
- 4 vCPU, 8GB RAM, 100GB SSD
- **~$18/ay**

**CloudFlare CDN (Opsiyonel):**
- Free plan yeterli
- **$0/ay**

**Toplam: ~$18/ay** 💰

---

## 🚀 Sonraki Adımlar

1. ✅ Frontend'i deploy et
2. ✅ Frontend'de `VITE_API_URL` güncelle
3. ✅ Security tests çalıştır: `node security-tests.js`
4. ✅ Monitoring kur (UptimeRobot)
5. ✅ Backup test et

---

**Hazırlayan:** AI DevOps Assistant  
**Platform:** Hostinger + Dokploy  
**Tarih:** 14 Kasım 2025

**⚡ 20 dakikada production'da! Başarılar!** 🎉

