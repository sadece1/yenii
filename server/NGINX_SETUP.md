# NGINX Reverse Proxy Setup

Backend artık **NGINX + Node.js (Express)** yapılandırması ile çalışıyor.

## 🏗️ Mimari

```
Internet → NGINX (Port 80) → Node.js Backend (Port 3000)
```

## 📁 Yeni Dosyalar

- `nginx.conf` - NGINX reverse proxy konfigürasyonu
- `start.sh` - NGINX ve Node.js'i birlikte başlatan script
- `Dockerfile` - NGINX içeren multi-stage build

## ✨ Özellikler

### 1. Reverse Proxy
- Tüm istekler NGINX üzerinden geçiyor
- Node.js backend'e proxy yapılıyor
- Load balancing hazır (ileride birden fazla Node.js instance için)

### 2. Rate Limiting (NGINX Katmanı)
- **API Endpoints**: 7 req/min (burst: 20)
- **Auth Endpoints**: 1 req/3min (burst: 2)
- **Upload Endpoints**: 1 req/min (burst: 5)

> Not: Express'teki rate limiting de aktif (çift katmanlı koruma)

### 3. Static File Serving
- `/uploads` klasöründeki dosyalar NGINX tarafından direkt servis ediliyor
- Cache: 30 gün
- Sadece image dosyalarına izin veriliyor

### 4. Gzip Compression
- JSON, HTML, CSS, JS dosyaları otomatik sıkıştırılıyor
- Bandwidth tasarrufu

### 5. Security Headers
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- X-Real-IP, X-Forwarded-For (proxy headers)

### 6. Upload Handling
- Max file size: 10MB
- Timeout: 300s (5 dakika)
- Buffer'lar kapalı (streaming)

## 🔧 Konfigürasyon

### Port Mapping
- **Container Port**: 80 (NGINX)
- **Node.js Internal**: 3000
- **Public Port**: 80

### Health Check
- Endpoint: `/health`
- NGINX üzerinden proxy ediliyor
- Rate limiting'den muaf

## 🚀 Deployment

Dokploy üzerinden deploy edildiğinde:
1. Docker image build edilir (NGINX + Node.js)
2. Container'da hem NGINX hem Node.js çalışır
3. NGINX port 80'de dinler
4. Node.js port 3000'de çalışır (internal)

## 📊 Avantajlar

1. **Performance**: NGINX static dosyaları daha hızlı servis eder
2. **Security**: Çift katmanlı rate limiting
3. **Scalability**: İleride load balancing eklenebilir
4. **Caching**: NGINX cache layer eklenebilir
5. **SSL Termination**: NGINX'te SSL yönetimi (Dokploy zaten yapıyor)

## 🔍 Monitoring

NGINX logları:
- Access log: `/var/log/nginx/access.log`
- Error log: `/var/log/nginx/error.log`

## ⚠️ Notlar

- Node.js hala port 3000'de çalışıyor (internal)
- NGINX sadece reverse proxy, SSL Dokploy tarafından yönetiliyor
- Rate limiting hem NGINX hem Express'te aktif (çift koruma)

