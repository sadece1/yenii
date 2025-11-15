# 🚀 Hostinger VPS + Dokploy Deployment Rehberi

## 📋 Genel Bakış

Bu rehber, **CampScape backend'ini Hostinger VPS** üzerinde **Dokploy** kullanarak deploy etmek için hazırlanmıştır.

**Platform:** Hostinger VPS + Dokploy  
**Tahmini Süre:** 20-30 dakika  
**Seviye:** Intermediate

---

## ✅ Gereksinimler

### Hostinger VPS Planı

| Plan | CPU | RAM | Disk | Önerilen Kullanım | Maliyet |
|------|-----|-----|------|-------------------|---------|
| VPS 1 | 2 vCPU | 4GB | 50GB SSD | Test/Development | ~$5-10/ay |
| VPS 2 | 4 vCPU | 8GB | 100GB SSD | **Production (Önerilen)** | ~$15-25/ay |
| VPS 4 | 8 vCPU | 16GB | 200GB SSD | High Traffic | ~$40-60/ay |

**Minimum:** VPS 1  
**Önerilen Production:** VPS 2

### Domain
- Domain name (örn: campscape.com)
- DNS yönetim erişimi (Hostinger domain veya external)

### Diğer
- GitHub repository
- SSH client

---

## 🖥️ BÖLÜM 1: Hostinger VPS Kurulumu

### Adım 1.1: VPS Siparişi ve Kurulum

1. **Hostinger'a giriş yap** → https://hostinger.com
2. **VPS** sekmesine git
3. Plan seç (VPS 2 önerilir)
4. **Operating System:** Ubuntu 22.04 LTS seç
5. **Location:** Size en yakın datacenter (Europe/Amsterdam önerilir)
6. Sipariş tamamla

**VPS hazır olduğunda (5-10 dakika):**
- Email ile SSH bilgileri gelecek
- IP adresi, root password

### Adım 1.2: İlk Giriş ve Güncelleme

```bash
# SSH ile bağlan (Hostinger email'deki bilgilerle)
ssh root@your-vps-ip

# İlk giriş sonrası şifreyi değiştir
passwd

# Sistem güncelle
apt update && apt upgrade -y

# Reboot gerekirse
reboot
```

### Adım 1.3: Temel Paketler

```bash
# Tekrar bağlan
ssh root@your-vps-ip

# Gerekli paketler
apt install -y curl wget git nano vim ufw fail2ban
```

---

## 🐳 BÖLÜM 2: Docker ve Dokploy Kurulumu

### Adım 2.1: Docker Kurulumu

```bash
# Docker otomatik kurulum
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose plugin
apt install -y docker-compose-plugin

# Docker'ı başlat ve enable et
systemctl enable docker
systemctl start docker

# Kurulum doğrulama
docker --version
# Beklenen: Docker version 24.x.x

docker compose version
# Beklenen: Docker Compose version v2.x.x
```

### Adım 2.2: Dokploy Kurulumu

```bash
# Dokploy tek komut kurulum
curl -sSL https://dokploy.com/install.sh | sh

# Kurulum 2-3 dakika sürer
# Tamamlandığında göreceksiniz:
# ✅ Dokploy installed successfully!
# ✅ Access Dashboard: http://YOUR_IP:3000
```

**Kurulum tamamlandıktan sonra:**
```
Dokploy Dashboard: http://your-vps-ip:3000
Traefik Dashboard: http://your-vps-ip:8080 (opsiyonel)
```

### Adım 2.3: Firewall Yapılandırması

```bash
# UFW firewall kuralları
ufw allow 22/tcp       # SSH
ufw allow 80/tcp       # HTTP
ufw allow 443/tcp      # HTTPS
ufw allow 3000/tcp     # Dokploy Dashboard

# Firewall'ı aktif et
ufw --force enable

# Durumu kontrol et
ufw status verbose
```

**Çıktı şöyle olmalı:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
3000/tcp                   ALLOW       Anywhere
```

---

## 🌐 BÖLÜM 3: Domain ve DNS Yapılandırması

### Adım 3.1: Hostinger Domain DNS Ayarları

**Hostinger Panel → Domains → Manage → DNS / Name Servers**

#### A Records Ekle:

```
Type: A
Name: @
Value: YOUR_VPS_IP
TTL: 300 (Auto)

Type: A
Name: api
Value: YOUR_VPS_IP
TTL: 300

Type: A
Name: www
Value: YOUR_VPS_IP
TTL: 300
```

#### CNAME Record (opsiyonel):

```
Type: CNAME
Name: admin
Value: api.campscape.com
TTL: 300
```

### Adım 3.2: DNS Propagation Test

```bash
# VPS'te test et
nslookup api.campscape.com
# Beklenen: YOUR_VPS_IP

nslookup campscape.com
# Beklenen: YOUR_VPS_IP

# Dig ile detaylı test
dig api.campscape.com +short
# Beklenen: YOUR_VPS_IP
```

**DNS propagation 5-30 dakika sürebilir.**

Online test: https://dnschecker.org

---

## 🔐 BÖLÜM 4: Dokploy Dashboard İlk Kurulum

### Adım 4.1: Dashboard'a Giriş

```
URL: http://your-vps-ip:3000
```

**İlk açılışta:**
1. **Create Admin Account** ekranı gelecek
2. Email gir (admin@campscape.com)
3. Strong password belirle
4. **Create Account**
5. Dashboard'a giriş yap

### Adım 4.2: GitHub Entegrasyonu

1. Dashboard → **Settings** → **Git Providers**
2. **Connect GitHub**
3. GitHub'da authorize et
4. Repository'yi seç (campscape)
5. **Connect**

---

## 🗄️ BÖLÜM 5: MySQL Database Kurulumu

### Adım 5.1: MySQL Servisi Oluştur

Dokploy Dashboard:

1. **Services** sekmesine git
2. **Add Service** butonuna tıkla
3. **MySQL** seç (version 8.0)

**Configuration:**
```
Name: campscape-mysql
Version: 8.0
Database Name: campscape_marketplace
Root Password: [STRONG_PASSWORD - kaydet!]
Port: 3306 (internal only)
Memory Limit: 1GB (VPS 2 için)
```

4. **Volumes:**
```
Volume Name: mysql-data
Mount Path: /var/lib/mysql
Size: 10GB
```

5. **Environment Variables:**
```
MYSQL_ROOT_PASSWORD: [your-strong-password]
MYSQL_DATABASE: campscape_marketplace
MYSQL_CHARACTER_SET_SERVER: utf8mb4
MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
```

6. **Health Check:**
```
Command: mysqladmin ping -h localhost
Interval: 10s
Timeout: 5s
Retries: 5
```

7. **Create Service**

### Adım 5.2: MySQL Test ve Doğrulama

**Dokploy Console üzerinden:**

1. Services → campscape-mysql → **Console**
2. Terminal açılacak

```bash
# MySQL'e bağlan
mysql -u root -p
# Root password'u gir

# Test
SHOW DATABASES;
# campscape_marketplace görünmeli

USE campscape_marketplace;
SHOW TABLES;
# Şu an boş olmalı (migration sonrası dolacak)

EXIT;
```

**Alternatif: Docker exec ile:**

```bash
# VPS SSH'den
docker exec -it campscape-mysql mysql -u root -p
```

---

## 📦 BÖLÜM 6: Backend Application Deploy

### Adım 6.1: Application Oluştur

Dokploy Dashboard:

1. **Applications** → **New Application**
2. **Type:** Docker
3. **Configuration:**

```
Name: campscape-backend
Description: CampScape Marketplace Backend API

Source:
  Type: GitHub
  Repository: your-username/campscape
  Branch: main
  
Build:
  Dockerfile Path: server/Dockerfile
  Build Context: server/
  Build Args: (empty)
  
Deployment:
  Port: 3000
  Restart Policy: unless-stopped
  Replicas: 1
```

4. **Create**

### Adım 6.2: Environment Variables Ekle

**Application → Environment → Add Variables**

**🔴 Kritik Variables (mutlaka doldur):**

```env
# Server
NODE_ENV=production
PORT=3000

# Database (Internal Dokploy network)
DB_HOST=campscape-mysql
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD
DB_NAME=campscape_marketplace
DB_PORT=3306

# JWT Secrets (GENERATE NEW!)
JWT_SECRET=YOUR_64_CHARACTER_HEX_SECRET
JWT_REFRESH_SECRET=YOUR_64_CHARACTER_HEX_SECRET_DIFFERENT
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS (Your domains)
FRONTEND_URL=https://campscape.com
ALLOWED_ORIGINS=https://campscape.com,https://www.campscape.com,https://api.campscape.com
```

**🟡 File Upload:**

```env
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
MAX_USER_UPLOAD_QUOTA=1073741824
```

**🟢 Security:**

```env
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
REQUIRE_VIRUS_SCAN=false
HTTPS_ENFORCE=true
```

**🔵 Rate Limiting:**

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_UPLOADS_PER_HOUR=50
```

**⚪ Logging:**

```env
LOG_LEVEL=info
MAX_JSON_SIZE=1mb
MAX_URLENCODED_SIZE=1mb
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

**Strong Secret Generator:**

```bash
# VPS SSH'de veya local terminal'de çalıştır
# JWT_SECRET için
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_REFRESH_SECRET için (farklı olmalı!)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Adım 6.3: Volumes Yapılandır

**Application → Volumes → Add Volume**

```
Volume 1:
  Name: campscape-uploads
  Mount Path: /app/uploads
  Size: 5GB
  
Volume 2:
  Name: campscape-logs
  Mount Path: /app/logs
  Size: 1GB
```

**Save**

### Adım 6.4: Domain ve SSL Yapılandır

**Application → Domains → Add Domain**

```
Domain: api.campscape.com
Path: /
Target Port: 3000

SSL/TLS:
  Enable SSL: ✅
  Provider: Let's Encrypt
  Email: your-email@example.com
  Force HTTPS: ✅
```

**Save**

### Adım 6.5: İlk Deployment

1. **Deploy** butonuna bas
2. **Build Logs** sekmesini aç
3. Build sürecini izle (2-5 dakika)

**Build stages:**
```
📦 Cloning repository...
🔨 Building Docker image...
   - Stage 1: Builder
   - Stage 2: Production
🚀 Starting container...
✅ Health check passed
🎉 Deployment successful!
```

---

## 🔄 BÖLÜM 7: Database Migration

### Adım 7.1: Migration Çalıştır

**Deployment tamamlandıktan sonra:**

Dokploy → campscape-backend → **Console**

```bash
# Migration (tabloları oluştur)
npm run db:migrate

# Çıktı:
# ✅ Creating tables...
# ✅ Users table created
# ✅ Gear table created
# ✅ Blogs table created
# ... (tüm tablolar)
# ✅ Migration completed successfully!
```

### Adım 7.2: Seed Data Ekle

```bash
# Seed (örnek veriler)
npm run db:seed

# Çıktı:
# ✅ Seeding users...
# ✅ Seeding gear items...
# ✅ Seeding blogs...
# ✅ Seed completed successfully!
```

### Adım 7.3: Doğrulama

**MySQL'de kontrol et:**

```bash
docker exec -it campscape-mysql mysql -u root -p
```

```sql
USE campscape_marketplace;

-- Tabloları listele
SHOW TABLES;

-- Kullanıcı sayısı
SELECT COUNT(*) FROM users;
-- Beklenen: 3 (admin + 2 user)

-- Gear sayısı
SELECT COUNT(*) FROM gear;
-- Beklenen: 100+

-- Admin kullanıcı
SELECT id, email, role FROM users WHERE role = 'admin';
-- Beklenen: admin@campscape.com

EXIT;
```

---

## ✅ BÖLÜM 8: Test ve Doğrulama

### Adım 8.1: Health Check Test

```bash
# VPS SSH'den veya local terminal'den
curl https://api.campscape.com/health

# Beklenen çıktı:
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-11-14T..."
}
```

### Adım 8.2: API Endpoint Test

```bash
# Gear listesi (public endpoint)
curl https://api.campscape.com/api/gear | jq .

# Beklenen: JSON array with gear items
```

### Adım 8.3: Authentication Test

```bash
# Login
curl -X POST https://api.campscape.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@campscape.com",
    "password": "Admin123!"
  }' | jq .

# Beklenen çıktı:
{
  "user": {
    "id": 1,
    "email": "admin@campscape.com",
    "name": "Admin User",
    "role": "admin"
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Adım 8.4: CORS Test

```bash
# CORS preflight
curl -X OPTIONS https://api.campscape.com/api/auth/login \
  -H "Origin: https://campscape.com" \
  -H "Access-Control-Request-Method: POST" \
  -I

# Response headers'da şunlar olmalı:
# Access-Control-Allow-Origin: https://campscape.com
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, ...
```

### Adım 8.5: SSL Certificate Test

```bash
# SSL sertifikası kontrolü
curl -I https://api.campscape.com

# HTTP/2 200 görmeli ve:
# strict-transport-security header olmalı
```

**Online test:** https://www.ssllabs.com/ssltest/

---

## 🔒 BÖLÜM 9: Security Hardening

### Adım 9.1: SSH Güvenliği

```bash
# SSH config düzenle
nano /etc/ssh/sshd_config
```

**Değişiklikler:**

```bash
# Port değiştir (opsiyonel ama önerilir)
Port 2222

# Root login kapat (SSH key kullanacaksanız)
PermitRootLogin no

# Password authentication kapat (SSH key kullanacaksanız)
PasswordAuthentication no

# Empty passwords kapat
PermitEmptyPasswords no

# Max auth tries
MaxAuthTries 3
```

```bash
# Restart SSH
systemctl restart sshd

# !!! Yeni bir terminal açıp test edin bağlanabildiğinizi
# Port değiştirdiyseniz:
ssh -p 2222 root@your-vps-ip

# UFW'yi güncelle
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

### Adım 9.2: Fail2Ban Kurulumu

```bash
# Fail2ban kur (brute force koruması)
apt install -y fail2ban

# Jail yapılandır
nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = your-email@example.com
action = %(action_mwl)s

[sshd]
enabled = true
port = 2222
logpath = /var/log/auth.log
maxretry = 3

[dokploy]
enabled = true
port = 3000
logpath = /var/log/dokploy/*.log
maxretry = 5
bantime = 3600
```

```bash
# Fail2ban başlat
systemctl enable fail2ban
systemctl start fail2ban

# Durumu kontrol et
fail2ban-client status
fail2ban-client status sshd
```

### Adım 9.3: Automated Backups

```bash
# Backup klasörü oluştur
mkdir -p /root/backups

# Backup scripti oluştur
nano /root/backup-campscape.sh
```

```bash
#!/bin/bash

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
DB_PASSWORD="YOUR_MYSQL_ROOT_PASSWORD"
RETENTION_DAYS=7

# Create backup directory
mkdir -p $BACKUP_DIR

# MySQL Backup
echo "🗄️  Backing up MySQL database..."
docker exec campscape-mysql mysqldump -u root -p$DB_PASSWORD campscape_marketplace > $BACKUP_DIR/db_$DATE.sql

# Uploads Backup
echo "📁 Backing up uploads..."
docker cp campscape-backend:/app/uploads $BACKUP_DIR/uploads_$DATE

# Logs Backup (opsiyonel)
echo "📝 Backing up logs..."
docker cp campscape-backend:/app/logs $BACKUP_DIR/logs_$DATE

# Compress
echo "🗜️  Compressing backup..."
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR db_$DATE.sql uploads_$DATE logs_$DATE

# Cleanup temporary files
rm -rf $BACKUP_DIR/db_$DATE.sql $BACKUP_DIR/uploads_$DATE $BACKUP_DIR/logs_$DATE

# Delete old backups (keep last 7 days)
echo "🧹 Cleaning old backups..."
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Backup size
BACKUP_SIZE=$(du -h $BACKUP_DIR/backup_$DATE.tar.gz | cut -f1)
echo "✅ Backup completed: backup_$DATE.tar.gz ($BACKUP_SIZE)"

# Optional: Upload to cloud storage
# aws s3 cp $BACKUP_DIR/backup_$DATE.tar.gz s3://your-bucket/backups/
```

```bash
# Script'i çalıştırılabilir yap
chmod +x /root/backup-campscape.sh

# Test et
/root/backup-campscape.sh

# Crontab ekle (her gün 2:00 AM)
crontab -e
```

```cron
# CampScape daily backup at 2:00 AM
0 2 * * * /root/backup-campscape.sh >> /var/log/backup.log 2>&1
```

---

## 📊 BÖLÜM 10: Monitoring ve Maintenance

### Adım 10.1: Dokploy Built-in Monitoring

Dokploy Dashboard → Application → **Metrics**:

- **CPU Usage:** Realtime CPU kullanımı
- **Memory Usage:** RAM kullanımı
- **Network Traffic:** In/Out traffic
- **Disk Usage:** Storage kullanımı

### Adım 10.2: External Monitoring (UptimeRobot)

1. https://uptimerobot.com (ücretsiz 50 monitor)
2. **Add New Monitor**:
   ```
   Monitor Type: HTTPS
   Friendly Name: CampScape API
   URL: https://api.campscape.com/health
   Monitoring Interval: 5 minutes
   Alert Contacts: your-email@example.com
   ```

### Adım 10.3: Log Monitoring

```bash
# Backend logs (realtime)
docker logs -f campscape-backend

# MySQL logs
docker logs -f campscape-mysql

# Dokploy system logs
journalctl -u dokploy -f

# Nginx/Traefik logs (Dokploy proxy)
docker logs -f traefik
```

### Adım 10.4: Resource Monitoring

```bash
# System resources
htop

# Disk usage
df -h

# Docker stats
docker stats

# Specific container
docker stats campscape-backend campscape-mysql
```

---

## 🚀 BÖLÜM 11: Performance Optimization

### Adım 11.1: VPS Optimization

```bash
# Swap memory ekle (eğer RAM yetersizse)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Permanent yap
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Swap kullanımını optimize et
nano /etc/sysctl.conf
```

```ini
# Swap settings
vm.swappiness=10
vm.vfs_cache_pressure=50

# Network optimization
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 30

# File descriptors
fs.file-max = 100000
```

```bash
# Apply settings
sysctl -p
```

### Adım 11.2: MySQL Optimization

```bash
# MySQL container'a bağlan
docker exec -it campscape-mysql mysql -u root -p
```

```sql
-- Slow query log aktif et
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Query cache (MySQL 8.0'da removed, Redis kullanmalısınız)

-- Index'leri kontrol et
SHOW INDEX FROM gear;
SHOW INDEX FROM users;
SHOW INDEX FROM blogs;

-- Table optimization
OPTIMIZE TABLE gear;
OPTIMIZE TABLE users;
OPTIMIZE TABLE blogs;
```

### Adım 11.3: Docker Image Optimization

**Mevcut Dockerfile zaten optimize edilmiş:**
- ✅ Multi-stage build
- ✅ Alpine base image (küçük boyut)
- ✅ Production dependencies only
- ✅ Non-root user

---

## 🔄 BÖLÜM 12: CI/CD ve Updates

### Adım 12.1: Otomatik Deployment (Webhook)

Dokploy → Application → **Settings** → **Webhooks**

```
Webhook URL: https://dokploy-url/webhook/deploy/app-id
Trigger: Push to main branch
```

**GitHub Repository:**

Settings → Webhooks → Add webhook:
```
Payload URL: [Dokploy webhook URL]
Content type: application/json
Events: Push events
```

**Artık `git push` yaptığınızda otomatik deploy olur! 🎉**

### Adım 12.2: Manual Update

```bash
# Dokploy Dashboard
Application → Deployments → Redeploy

# veya webhook ile
curl -X POST https://your-dokploy-url/webhook/deploy/app-id
```

---

## 🆘 BÖLÜM 13: Troubleshooting

### Sorun 1: Build Failed

**Hata:** Docker build failed

**Çözüm:**
```bash
# VPS'te disk space kontrol
df -h
# /var/lib/docker %80+ doluysa:

# Docker temizlik
docker system prune -a -f
docker volume prune -f

# Manual build test
cd /tmp
git clone your-repo
cd repo/server
docker build -t test .
```

### Sorun 2: Database Connection Error

**Hata:** `ECONNREFUSED` veya `ER_ACCESS_DENIED_ERROR`

**Çözüm:**
```bash
# MySQL container çalışıyor mu?
docker ps | grep mysql

# MySQL logs
docker logs campscape-mysql

# Environment variables doğru mu?
# Dokploy dashboard'da kontrol et
# DB_HOST=campscape-mysql (service name)
# DB_PORT=3306
```

### Sorun 3: SSL Certificate Error

**Hata:** Let's Encrypt SSL failed

**Çözüm:**
```bash
# DNS doğru yapılandırılmış mı?
nslookup api.campscape.com
# VPS IP'niz dönmeli

# Port 80 ve 443 açık mı?
ufw status | grep -E "80|443"

# Traefik logs
docker logs traefik

# Manuel certbot (son çare)
apt install certbot
certbot certonly --standalone -d api.campscape.com
```

### Sorun 4: High Memory Usage

**Hata:** Container memory limit aşıyor

**Çözüm:**
```bash
# Memory kullanımı
docker stats

# Container'ı restart et
docker restart campscape-backend

# Memory limit artır
# Dokploy → Application → Resources
# Memory Limit: 512MB → 1GB
```

### Sorun 5: Slow Response Times

**Çözüm:**
```bash
# Backend logs kontrol
docker logs campscape-backend | grep -i slow

# MySQL slow queries
docker exec -it campscape-mysql mysql -u root -p
SELECT * FROM mysql.slow_log LIMIT 10;

# Index eksiklikleri
SHOW INDEX FROM gear;
SHOW INDEX FROM users;

# Application metrics
# Dokploy dashboard → Metrics
```

---

## 📋 Hostinger-Specific Checklist

### VPS Kurulum
- [ ] Hostinger VPS aktif (VPS 2 önerilir)
- [ ] Ubuntu 22.04 LTS kurulu
- [ ] SSH erişimi çalışıyor
- [ ] Root password değiştirildi

### Docker ve Dokploy
- [ ] Docker kuruldu ve çalışıyor
- [ ] Docker Compose kurulu
- [ ] Dokploy kuruldu (`http://vps-ip:3000`)
- [ ] Dokploy admin hesabı oluşturuldu
- [ ] GitHub entegrasyonu yapıldı

### Network ve Security
- [ ] UFW firewall yapılandırıldı
- [ ] Port 22, 80, 443, 3000 açık
- [ ] Fail2ban kuruldu
- [ ] SSH hardening yapıldı

### Domain ve DNS
- [ ] Hostinger DNS ayarlandı (A records)
- [ ] DNS propagation tamamlandı
- [ ] `nslookup` test başarılı

### Database
- [ ] MySQL servisi oluşturuldu
- [ ] Database bağlantısı çalışıyor
- [ ] Migration çalıştırıldı
- [ ] Seed data eklendi

### Backend Application
- [ ] Application oluşturuldu
- [ ] Environment variables eklendi
- [ ] Volumes yapılandırıldı
- [ ] Domain ve SSL ayarlandı
- [ ] İlk deployment başarılı

### Testing
- [ ] Health check çalışıyor
- [ ] API endpoints erişilebilir
- [ ] Login test başarılı
- [ ] CORS çalışıyor
- [ ] SSL sertifikası valid

### Monitoring ve Backup
- [ ] Dokploy monitoring aktif
- [ ] UptimeRobot kuruldu (opsiyonel)
- [ ] Backup scripti oluşturuldu
- [ ] Cron job eklendi
- [ ] Test backup alındı

---

## 💰 Maliyet Optimizasyonu

### VPS Plan Seçimi

**Küçük Proje (5000 user/month):**
- VPS 1: 2 vCPU, 4GB RAM
- Maliyet: ~$7/ay
- CloudFlare CDN (ücretsiz)
- **Toplam: ~$7/ay**

**Orta Ölçek (50,000 user/month):**
- VPS 2: 4 vCPU, 8GB RAM
- Maliyet: ~$18/ay
- CloudFlare Pro (opsiyonel: $20/ay)
- **Toplam: ~$18-38/ay**

**Büyük Ölçek (500,000+ user/month):**
- VPS 4: 8 vCPU, 16GB RAM
- Multiple replicas
- External managed database
- **Toplam: ~$80-150/ay**

---

## 🎉 Deployment Tamamlandı!

**Backend başarıyla Hostinger VPS + Dokploy'da çalışıyor!** 🚀

### ✅ Verification URLs

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

### 📊 Erişim Bilgileri

```
Backend API: https://api.campscape.com
Dokploy Dashboard: http://your-vps-ip:3000
VPS SSH: ssh root@your-vps-ip (veya port 2222)
MySQL: campscape-mysql:3306 (internal)
```

### 🔐 Credentials

```
Admin API:
  Email: admin@campscape.com
  Password: Admin123!

Dokploy Dashboard:
  Email: [sizin email'iniz]
  Password: [belirlediğiniz şifre]

MySQL:
  User: root
  Password: [belirlediğiniz DB password]
  Database: campscape_marketplace
```

---

## 📞 Support ve Kaynaklar

### Hostinger Support
- Website: https://hostinger.com
- Support: https://hostinger.com/support
- Live Chat: 24/7 available

### Dokploy Documentation
- Main Docs: https://docs.dokploy.com
- GitHub: https://github.com/dokploy/dokploy
- Discord: https://discord.gg/dokploy

### CampScape
- GitHub: [Your repository]
- Documentation: [Your docs]
- Security Contact: [Your email]

---

**Hazırlayan:** AI DevOps Engineer  
**Platform:** Hostinger VPS + Dokploy  
**Tarih:** 14 Kasım 2025  
**Versiyon:** 1.0

**🚀 Backend production'da çalışıyor! Tebrikler!** 🎉

