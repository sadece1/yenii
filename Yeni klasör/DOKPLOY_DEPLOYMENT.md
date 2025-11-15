# 🚀 Dokploy Deployment Rehberi - CampScape

## 📋 Genel Bakış

Bu rehber, CampScape backend'ini **Dokploy** platformuna deploy etmek için gereken tüm adımları içerir.

**Tahmini Süre:** 15-20 dakika  
**Gereksinimler:** Dokploy hesabı, GitHub repository

---

## ⚡ Hızlı Başlangıç (5 Adımda Deploy)

### 1️⃣ GitHub'a Push (2 dakika)

```bash
# Eğer henüz Git repository yoksa
git init
git add .
git commit -m "Initial commit - Production ready"

# GitHub'a push
git remote add origin https://github.com/yourusername/campscape.git
git push -u origin main
```

### 2️⃣ Dokploy'da Yeni Proje Oluştur (2 dakika)

1. Dokploy dashboard'a giriş yap
2. **"New Application"** butonuna tıkla
3. **Application Type:** Docker
4. **Name:** campscape-backend
5. **Repository:** GitHub'dan repo seç
6. **Branch:** main
7. **Dockerfile Path:** `server/Dockerfile`
8. **Build Context:** `server/`

### 3️⃣ MySQL Database Oluştur (3 dakika)

**Seçenek A: Dokploy MySQL (Önerilen)**

1. Dokploy'da **"Services" → "Add Service"**
2. **Type:** MySQL 8.0
3. **Name:** campscape-mysql
4. **Database Name:** campscape_marketplace
5. **Root Password:** [Güçlü şifre oluştur]
6. **Port:** 3306
7. **Create** butonuna tıkla

**Seçenek B: External Database**

PlanetScale, AWS RDS, DigitalOcean Managed MySQL kullanabilirsiniz.

### 4️⃣ Environment Variables Ekle (5 dakika)

Dokploy dashboard'da **"Environment Variables"** sekmesine git:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database (Dokploy MySQL kullanıyorsanız)
DB_HOST=campscape-mysql
DB_USER=root
DB_PASSWORD=<mysql_root_password>
DB_NAME=campscape_marketplace
DB_PORT=3306

# JWT Secrets (ÖNEMLİ: Yeni generate edin!)
JWT_SECRET=<64_character_random_string>
JWT_REFRESH_SECRET=<64_character_random_string>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL (Production domain)
FRONTEND_URL=https://campscape.yourdomain.com
ALLOWED_ORIGINS=https://campscape.yourdomain.com,https://www.campscape.yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
MAX_USER_UPLOAD_QUOTA=1073741824

# Image Processing
MAX_IMAGE_WIDTH=8192
MAX_IMAGE_HEIGHT=8192
MAX_IMAGE_PIXELS=67108864

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_UPLOADS_PER_HOUR=50

# Security (Production)
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
REQUIRE_VIRUS_SCAN=false
HTTPS_ENFORCE=true

# Request Size Limits
MAX_JSON_SIZE=1mb
MAX_URLENCODED_SIZE=1mb

# Logging
LOG_LEVEL=info

# CORS
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

**Strong Secret Generator:**
```bash
# Terminal'de çalıştır (her biri için ayrı)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5️⃣ Deploy! (3 dakika)

1. **"Deploy"** butonuna bas
2. Build loglarını izle
3. Health check bekle
4. **Success! 🎉**

---

## 📦 Volumes ve Persistent Storage

### Dokploy'da Volume Oluşturma

1. **Application Settings → Volumes**
2. Şu volume'ları ekle:

| Volume Name | Mount Path | Açıklama |
|-------------|------------|----------|
| uploads | /app/uploads | Kullanıcı yüklemeleri |
| logs | /app/logs | Application logları |

---

## 🗄️ Database Migration ve Seed

Deploy sonrası database'i hazırlamak için:

### Yöntem 1: Dokploy Console (Önerilen)

1. Dokploy'da **"Console"** sekmesine git
2. Backend container'ına bağlan
3. Migration çalıştır:

```bash
npm run db:migrate
npm run db:seed
```

### Yöntem 2: Dockerfile'a Entrypoint Ekle

Otomatik migration için `server/Dockerfile` sonuna:

```dockerfile
# Create startup script
RUN echo '#!/bin/sh\n\
npm run db:migrate\n\
node dist/server.js' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
```

**Not:** Production'da migration'ları manual çalıştırmak daha güvenlidir.

---

## 🌐 Domain ve SSL

### Domain Yapılandırması

1. **Dokploy Dashboard → Domains**
2. **"Add Domain"**
3. **Domain:** api.campscape.com (örnek)
4. **SSL:** Let's Encrypt (otomatik)
5. **Save**

### DNS Kayıtları

Domain provider'ınızda (Cloudflare, GoDaddy, vb.):

```
Type: A
Name: api (veya @)
Value: <dokploy_server_ip>
TTL: 300
```

**SSL Sertifikası:**
- Dokploy otomatik Let's Encrypt entegrasyonu var
- Kurulum ~5 dakika

---

## 🔒 Production Security Checklist

### Kritik (Deploy Öncesi)

- [ ] **Strong JWT Secrets** (64 karakter)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] **Database Password** (güçlü ve unique)
  - Min 16 karakter
  - Büyük/küçük harf + rakam + özel karakter

- [ ] **ALLOWED_ORIGINS** (production domain)
  ```env
  ALLOWED_ORIGINS=https://campscape.com,https://www.campscape.com
  ```

- [ ] **HTTPS_ENFORCE=true**
  ```env
  HTTPS_ENFORCE=true
  ```

- [ ] **ENABLE_CSRF** (opsiyonel, API için false olabilir)
  ```env
  ENABLE_CSRF=false
  ```

### Önemli (Deploy Sonrası)

- [ ] **Health Check Test**
  ```bash
  curl https://api.campscape.com/health
  # Beklenen: {"status":"OK","message":"Server is running"}
  ```

- [ ] **CORS Test**
  ```bash
  curl -H "Origin: https://campscape.com" \
       -H "Access-Control-Request-Method: POST" \
       -X OPTIONS https://api.campscape.com/api/auth/login -I
  # Access-Control-Allow-Origin header kontrol et
  ```

- [ ] **Database Connection Test**
  ```bash
  curl https://api.campscape.com/api/gear
  # Gear listesi dönmeli
  ```

- [ ] **Security Headers Test**
  ```bash
  curl -I https://api.campscape.com/
  # CSP, X-Frame-Options, vb. kontrol et
  ```

---

## 📊 Monitoring ve Logging

### Dokploy Built-in Monitoring

1. **Dashboard → Metrics**
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

2. **Dashboard → Logs**
   - Real-time logs
   - Error logs
   - Access logs

### External Monitoring (Önerilen)

#### Sentry (Error Tracking)

```bash
npm install @sentry/node
```

`server/src/app.ts` içine:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handler middleware'den önce
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

Environment variable ekle:
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

#### Uptime Monitoring

- **UptimeRobot** (ücretsiz)
- **Pingdom**
- **StatusCake**

Health check URL: `https://api.campscape.com/health`

---

## 🔧 Troubleshooting

### Sorun 1: Build Başarısız

**Hata:** `npm ci` failed

**Çözüm:**
1. `package-lock.json` dosyasının commit edildiğini kontrol et
2. Node version uyumluluğunu kontrol et (18+)
3. Build Context'in doğru olduğunu kontrol et (`server/`)

### Sorun 2: Database Connection Error

**Hata:** `ECONNREFUSED` veya `ER_ACCESS_DENIED_ERROR`

**Çözüm:**
1. MySQL servisinin çalıştığını kontrol et
2. DB_HOST environment variable'ını kontrol et (Dokploy MySQL için service name kullan)
3. Database credentials'ları doğrula
4. Database'in oluşturulduğunu kontrol et

### Sorun 3: Container Crashloop

**Hata:** Container sürekli restart oluyor

**Çözüm:**
1. Logs'u kontrol et (Dokploy console)
2. Environment variables'ların tamamlanmış olduğunu doğrula
3. Health check timeout'u artır
4. Database migration durumunu kontrol et

### Sorun 4: CORS Error

**Hata:** Frontend'den API'ye erişilemiyor

**Çözüm:**
1. `ALLOWED_ORIGINS` environment variable'ını kontrol et
2. Frontend URL'ini doğru yazdığınızdan emin olun (https://)
3. Wildcard (*) kullanmayın, spesifik domain ekleyin

### Sorun 5: File Upload Çalışmıyor

**Hata:** Dosya yükleme başarısız

**Çözüm:**
1. `/app/uploads` volume mount'unun yapılandırıldığını kontrol et
2. Directory permission'larını kontrol et
3. File size limit'i kontrol et (MAX_FILE_SIZE)

---

## 🚀 Performance Optimization

### 1. Redis Cache (İsteğe Bağlı)

Dokploy'da Redis servisi ekle:

```bash
# Dokploy: Add Service → Redis
```

Backend'de:

```bash
npm install redis
```

```typescript
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Cache middleware
export const cacheMiddleware = async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await redisClient.get(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  next();
};
```

### 2. CDN (CloudFlare)

Static assets için CDN kullan:

1. CloudFlare'e domain ekle
2. DNS'i CloudFlare'e yönlendir
3. Proxy mode aktif et
4. Cache rules yapılandır

### 3. Database Optimization

```sql
-- Index'leri kontrol et
SHOW INDEX FROM gear;
SHOW INDEX FROM users;

-- Yavaş query'leri tespit et
SELECT * FROM mysql.slow_log LIMIT 10;

-- Query cache (MySQL 8.0'da removed, Redis kullan)
```

---

## 📈 Scaling

### Horizontal Scaling

Dokploy'da **"Scaling"** sekmesinden:

```yaml
Replicas: 2-4 (traffic'e göre)
Load Balancer: Automatic
```

### Vertical Scaling

**CPU/Memory artırma:**

1. Dokploy → Resources
2. CPU: 2 cores → 4 cores
3. Memory: 2GB → 4GB

### Database Scaling

**Read Replicas:**
- MySQL master-slave replication
- Read queries → replica
- Write queries → master

---

## 🔄 CI/CD Pipeline (GitHub Actions)

`.github/workflows/deploy.yml` oluştur:

```yaml
name: Deploy to Dokploy

on:
  push:
    branches: [main]
    paths:
      - 'server/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Trigger Dokploy Deployment
        run: |
          curl -X POST https://dokploy.yourdomain.com/api/deploy \
            -H "Authorization: Bearer ${{ secrets.DOKPLOY_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"app": "campscape-backend", "branch": "main"}'
```

---

## 📋 Post-Deployment Checklist

### Immediately After Deploy

- [ ] Health check: `curl https://api.campscape.com/health`
- [ ] Database connection test
- [ ] CORS test from frontend
- [ ] Login test
- [ ] File upload test
- [ ] Security headers check
- [ ] SSL certificate verify

### Within 24 Hours

- [ ] Monitoring setup (Sentry, Uptime)
- [ ] Backup verification
- [ ] Load testing
- [ ] Performance baseline
- [ ] Error rate monitoring

### Within 1 Week

- [ ] Security audit
- [ ] Penetration testing
- [ ] Performance optimization
- [ ] Documentation update
- [ ] Team training

---

## 🎯 Production-Ready Checklist

### Infrastructure

- [ ] ✅ Dokploy account ve billing setup
- [ ] ✅ Domain name (api.campscape.com)
- [ ] ✅ SSL certificate (Let's Encrypt)
- [ ] ✅ MySQL database (Dokploy veya external)
- [ ] ✅ Volume mounts (uploads, logs)
- [ ] ✅ Backup strategy

### Configuration

- [ ] ✅ All environment variables set
- [ ] ✅ Strong secrets generated
- [ ] ✅ CORS properly configured
- [ ] ✅ HTTPS enforced
- [ ] ✅ Rate limiting active
- [ ] ✅ Logging configured

### Testing

- [ ] ✅ Health check endpoint working
- [ ] ✅ Database connection working
- [ ] ✅ Authentication working
- [ ] ✅ File upload working
- [ ] ✅ CORS working
- [ ] ✅ Security tests passing

### Monitoring

- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Alerts configured

### Documentation

- [ ] API documentation
- [ ] Deployment procedures
- [ ] Rollback procedures
- [ ] Incident response plan
- [ ] Contact information

---

## 🆘 Emergency Procedures

### Rollback

1. Dokploy → Deployments → Previous Deployment
2. Click **"Redeploy"**
3. Verify health check

### Database Restore

```bash
# Dokploy MySQL'den backup al
docker exec campscape-mysql mysqldump -u root -p campscape_marketplace > backup.sql

# Restore
docker exec -i campscape-mysql mysql -u root -p campscape_marketplace < backup.sql
```

### Emergency Contacts

```
Platform: Dokploy Support - support@dokploy.com
Database: [DBA contact]
Security: [Security team contact]
On-call: [Developer contact]
```

---

## 📞 Support Resources

### Dokploy Documentation
- Main Docs: https://docs.dokploy.com
- Docker Guide: https://docs.dokploy.com/docker
- Troubleshooting: https://docs.dokploy.com/troubleshooting

### Community
- Dokploy Discord: https://discord.gg/dokploy
- GitHub Discussions: https://github.com/dokploy/dokploy/discussions

### CampScape Backend
- GitHub Repo: [Your repo URL]
- API Documentation: [Your API docs]
- Security Contact: [Your email]

---

## 🎉 Deployment Complete!

Tebrikler! Backend başarıyla Dokploy'a deploy edildi. 🚀

### Verification URLs

```bash
# Health Check
curl https://api.campscape.com/health

# API Test
curl https://api.campscape.com/api/gear

# Login Test
curl -X POST https://api.campscape.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campscape.com","password":"Admin123!"}'
```

### Next Steps

1. ✅ Frontend'i production'a deploy et
2. ✅ Frontend'de API_URL'yi güncelle
3. ✅ End-to-end test yap
4. ✅ Monitoring'i kontrol et
5. ✅ Security scan yap (OWASP ZAP)
6. ✅ Performance test yap
7. ✅ Backup doğrula
8. ✅ Team'i bilgilendir

---

**Hazırlayan:** AI DevOps Assistant  
**Tarih:** 14 Kasım 2025  
**Versiyon:** 1.0  
**Durum:** ✅ Production Ready

**🚀 Backend Dokploy'da çalışıyor! Başarılar!** 🎉


