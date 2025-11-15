# 🔒 CampScape Güvenlik Test Rehberi

## 📋 İçindekiler
1. [Backend Kurulum ve Başlatma](#backend-kurulum)
2. [Güvenlik Test Araçları](#güvenlik-test-araçları)
3. [OWASP Top 10 Testleri](#owasp-top-10-testleri)
4. [Penetrasyon Test Checklist](#penetrasyon-test-checklist)
5. [Otomatik Test Scriptleri](#otomatik-test-scriptleri)
6. [Güvenlik Raporlama](#güvenlik-raporlama)

---

## 🚀 Backend Kurulum ve Başlatma {#backend-kurulum}

### Adım 1: .env Dosyası Oluşturma

```bash
cd server
```

**`.env` dosyası oluşturun ve aşağıdaki içeriği yapıştırın:**

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration (MySQL kurulu olmalı)
DB_HOST=localhost
DB_USER=campscape_user
DB_PASSWORD=CampScape2024!SecurePass
DB_NAME=campscape_marketplace
DB_PORT=3306

# JWT Configuration (Güvenli random secret'lar)
JWT_SECRET=f8d4a6e2c9b1d7f3a5e8c9d4a6f2b7e3c8d9a4f6e7c2b8d3a5f9e7c6d4a8b2f
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=a3f7d9e2c5b8d1f4a6e9c2d7a4f8b5e1c9d3a7f2e8c6b4d1a9f5e3c8d6b2a4f
JWT_REFRESH_EXPIRES_IN=30d

# Frontend URL
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=./uploads
MAX_USER_UPLOAD_QUOTA=1073741824

# Security Settings
ENABLE_CSRF=false
ENABLE_VIRUS_SCAN=false
REQUIRE_VIRUS_SCAN=false
HTTPS_ENFORCE=false
ENABLE_API_VERSIONING=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Adım 2: MySQL Veritabanı Hazırlama

```bash
# MySQL'e bağlanın
mysql -u root -p

# Veritabanı ve kullanıcı oluşturun
CREATE DATABASE campscape_marketplace;
CREATE USER 'campscape_user'@'localhost' IDENTIFIED BY 'CampScape2024!SecurePass';
GRANT ALL PRIVILEGES ON campscape_marketplace.* TO 'campscape_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Adım 3: Backend Bağımlılıklarını Kurma

```bash
cd server
npm install
```

### Adım 4: Veritabanı Migration ve Seed

```bash
# Migration çalıştır (tabloları oluştur)
npm run db:migrate

# Seed çalıştır (örnek veriler ekle)
npm run db:seed

# Ya da her ikisini birden
npm run db:reset
```

### Adım 5: Backend Sunucusunu Başlatma

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Backend şimdi `http://localhost:3000` adresinde çalışıyor olmalı.

**Test için:**
```bash
curl http://localhost:3000/health
```

---

## 🔧 Güvenlik Test Araçları {#güvenlik-test-araçları}

### 1. OWASP ZAP (Zed Attack Proxy)
**En Popüler Güvenlik Test Aracı**

```bash
# İndirme
# https://www.zaproxy.org/download/

# Docker ile çalıştırma
docker run -p 8080:8080 -i owasp/zap2docker-stable zap-webswing.sh
```

**Kullanım:**
1. ZAP'i başlat
2. Automated Scan seç
3. URL: `http://localhost:3000`
4. Attack başlat

### 2. Burp Suite Community Edition
```bash
# İndirme
# https://portswigger.net/burp/communitydownload
```

### 3. SQLMap (SQL Injection Testi)
```bash
# Kurulum
pip install sqlmap

# Kullanım
sqlmap -u "http://localhost:3000/api/gear?id=1" --batch --risk=3
```

### 4. nikto (Web Sunucu Tarayıcı)
```bash
# Kurulum (Linux/Mac)
apt-get install nikto  # Linux
brew install nikto     # Mac

# Kullanım
nikto -h http://localhost:3000
```

### 5. nmap (Port Tarama)
```bash
# Kurulum
# https://nmap.org/download.html

# Kullanım
nmap -sV -p 3000 localhost
```

---

## 🎯 OWASP Top 10 Testleri {#owasp-top-10-testleri}

### A01: Broken Access Control

#### Test 1: Yetkisiz Admin Erişimi
```bash
# Token olmadan admin endpoint'e erişmeyi dene
curl -X GET http://localhost:3000/api/admin/users

# Beklenen: 401 Unauthorized
```

#### Test 2: Başka Kullanıcının Bilgilerine Erişim
```bash
# User1 token'ı ile User2'nin profilini güncellemeyi dene
curl -X PUT http://localhost:3000/api/users/2 \
  -H "Authorization: Bearer USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"hacked@example.com"}'

# Beklenen: 403 Forbidden
```

#### Test 3: IDOR (Insecure Direct Object Reference)
```bash
# Sıralı ID'lerle veri çekmeyi dene
for i in {1..100}; do
  curl http://localhost:3000/api/orders/$i \
    -H "Authorization: Bearer USER_TOKEN"
done

# Beklenen: Sadece kendi siparişlerini görmeli
```

---

### A02: Cryptographic Failures

#### Test 1: HTTPS Zorunluluğu
```bash
# HTTP üzerinden hassas veri göndermeyi dene
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Production'da: 301 Redirect to HTTPS beklenir
```

#### Test 2: Şifre Hashleme Kontrolü
```sql
-- Veritabanında şifrelerin hash'lenmiş olduğunu kontrol et
SELECT id, email, password FROM users LIMIT 5;

-- Beklenen: password bcrypt hash formatında ($2b$...)
```

---

### A03: Injection

#### Test 1: SQL Injection
```bash
# Basic SQL injection denemesi
curl -X GET "http://localhost:3000/api/gear?search=test' OR '1'='1"

# Union-based SQL injection
curl -X GET "http://localhost:3000/api/gear?id=1 UNION SELECT password FROM users--"

# Beklenen: Sanitize edilmiş sorgu, SQL hatası yok
```

#### Test 2: NoSQL Injection (eğer MongoDB kullanılıyorsa)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$ne":""},"password":{"$ne":""}}'

# Beklenen: Geçersiz istek hatası
```

#### Test 3: Command Injection
```bash
# Dosya yükleme endpoint'inde command injection
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test.txt;filename=test.txt;ls -la"

# Beklenen: Filename sanitize edilmeli
```

---

### A04: Insecure Design

#### Test 1: Rate Limiting Kontrolü
```bash
# Aynı endpoint'e hızlı istekler gönder
for i in {1..200}; do
  curl http://localhost:3000/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' &
done

# Beklenen: 429 Too Many Requests
```

#### Test 2: Brute Force Koruması
```bash
# Aynı hesaba çok sayıda yanlış şifre denemesi
for i in {1..20}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"admin@campscape.com\",\"password\":\"wrong$i\"}"
done

# Beklenen: Hesap kilitlenmesi veya IP bloğu
```

---

### A05: Security Misconfiguration

#### Test 1: Debug Bilgisi Sızması
```bash
# Hatalı istek gönder ve detaylı hata mesajlarını kontrol et
curl -X POST http://localhost:3000/api/gear/invalid

# Beklenen: Genel hata mesajı, stack trace yok
```

#### Test 2: Varsayılan Credentials
```bash
# Yaygın varsayılan şifrelerle giriş dene
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin"}'

# Beklenen: Başarısız giriş
```

#### Test 3: Security Headers Kontrolü
```bash
curl -I http://localhost:3000

# Beklenen headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Strict-Transport-Security: max-age=...
# Content-Security-Policy: ...
```

---

### A06: Vulnerable and Outdated Components

#### Test 1: npm audit
```bash
cd server
npm audit

# Beklenen: 0 vulnerabilities
```

#### Test 2: Dependency Version Check
```bash
npm outdated

# Kritik paketlerin güncel olduğunu kontrol et
```

---

### A07: Identification and Authentication Failures

#### Test 1: Zayıf Şifre Testi
```bash
# Zayıf şifrelerle kayıt olmayı dene
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'

# Beklenen: Şifre politikası hatası (min 8 karakter, büyük/küçük/rakam/özel karakter)
```

#### Test 2: JWT Token Güvenliği
```bash
# Expired token ile istek gönder
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

# Beklenen: 401 Unauthorized
```

#### Test 3: Session Management
```bash
# Logout sonrası token'ın geçersiz olduğunu kontrol et
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@campscape.com","password":"User123!"}' | jq -r '.token')

# 2. Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# 3. Token ile tekrar istek gönder
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Beklenen: 401 Unauthorized
```

---

### A08: Software and Data Integrity Failures

#### Test 1: File Upload Validation
```bash
# PHP dosyası yüklemeyi dene
echo '<?php system($_GET["cmd"]); ?>' > malicious.php
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@malicious.php"

# Beklenen: Dosya tipi hatası
```

#### Test 2: File Extension Bypass
```bash
# Double extension ile bypass denemesi
mv malicious.php malicious.php.jpg
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@malicious.php.jpg"

# Beklenen: MIME type validation ile engellenmeli
```

---

### A09: Security Logging and Monitoring Failures

#### Test 1: Log Kaydı Kontrolü
```bash
# Şüpheli aktivite oluştur
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campscape.com","password":"WRONG"}'

# Log dosyasını kontrol et
tail -f server/logs/error.log

# Beklenen: Başarısız login denemesi loglanmalı
```

---

### A10: Server-Side Request Forgery (SSRF)

#### Test 1: SSRF Denemesi
```bash
# İç ağ erişimi denemesi (eğer URL parametresi kabul eden endpoint varsa)
curl -X POST http://localhost:3000/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost:22"}'

# Beklenen: URL validation ile engellenmeli
```

---

## ✅ Penetrasyon Test Checklist {#penetrasyon-test-checklist}

### Authentication & Authorization
- [ ] Zayıf şifre politikası testi
- [ ] Brute force saldırı koruması
- [ ] Session fixation testi
- [ ] Token expiration kontrolü
- [ ] Password reset token güvenliği
- [ ] Multi-factor authentication bypass
- [ ] Privilege escalation (user → admin)
- [ ] Horizontal privilege escalation (user1 → user2)

### Input Validation
- [ ] SQL injection (GET/POST parametreleri)
- [ ] NoSQL injection
- [ ] XSS (Reflected, Stored, DOM-based)
- [ ] Command injection
- [ ] LDAP injection
- [ ] XML injection
- [ ] Path traversal
- [ ] File inclusion (LFI/RFI)

### Session Management
- [ ] Session timeout kontrolü
- [ ] Concurrent session yönetimi
- [ ] Session fixation
- [ ] Session hijacking
- [ ] CSRF token validation
- [ ] Cookie security (Secure, HttpOnly, SameSite)

### File Upload
- [ ] Dosya tipi validasyonu
- [ ] Dosya boyutu limiti
- [ ] Filename sanitization
- [ ] Magic number validation
- [ ] Upload quota kontrolü
- [ ] Executable file upload engelleme

### API Security
- [ ] Rate limiting testi
- [ ] API versioning
- [ ] CORS yapılandırması
- [ ] Content-Type validation
- [ ] Request size limiti
- [ ] API key management

### Data Protection
- [ ] Şifre hash algoritması (bcrypt)
- [ ] Sensitive data encryption
- [ ] HTTPS enforcement
- [ ] Database encryption at rest
- [ ] Secure data transmission

### Error Handling
- [ ] Stack trace sızması kontrolü
- [ ] Detailed error messages
- [ ] Information disclosure
- [ ] Debug mode devre dışı

### Security Headers
- [ ] Content-Security-Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Strict-Transport-Security
- [ ] X-XSS-Protection
- [ ] Referrer-Policy
- [ ] Permissions-Policy

### Business Logic
- [ ] Price manipulation
- [ ] Quantity manipulation
- [ ] Discount abuse
- [ ] Race condition
- [ ] Workflow bypass
- [ ] Enumeration attacks

---

## 🤖 Otomatik Test Scriptleri {#otomatik-test-scriptleri}

**Test script'i için ayrı dosya oluşturuldu: `security-tests.js`**

---

## 📊 Güvenlik Raporlama {#güvenlik-raporlama}

### Test Sonuçları Şablonu

```markdown
# Güvenlik Test Raporu
**Tarih:** [YYYY-MM-DD]
**Test Edilen Sistem:** CampScape Backend API
**Test Eden:** [İsim]

## Executive Summary
[Genel özet]

## Test Kapsamı
- [x] OWASP Top 10
- [x] Authentication & Authorization
- [x] Input Validation
- [x] API Security

## Bulgular

### Critical (P0)
1. **[Bulgu Başlığı]**
   - **Açıklama:** ...
   - **Etki:** ...
   - **Çözüm:** ...
   - **CVSS Score:** 9.0

### High (P1)
...

### Medium (P2)
...

### Low (P3)
...

## Başarılı Güvenlik Kontrolleri
- ✅ SQL Injection koruması
- ✅ XSS koruması
- ✅ CSRF koruması
- ✅ Rate limiting
...

## Öneriler
1. ...
2. ...

## Sonuç
[Genel değerlendirme]
```

---

## 🎯 Sonraki Adımlar

1. **Backend'i Başlat**
   ```bash
   cd server
   npm run dev
   ```

2. **Frontend'i Backend'e Bağla**
   - `src/services/api.ts` dosyasını güncelle
   - localStorage yerine gerçek API kullan

3. **Güvenlik Testlerini Çalıştır**
   ```bash
   node security-tests.js
   ```

4. **OWASP ZAP ile Tam Tarama**
   - Automated Scan çalıştır
   - Sonuçları raporla

5. **Dependency Audit**
   ```bash
   npm audit
   ```

---

## 📞 Destek ve Daha Fazla Bilgi

- OWASP: https://owasp.org/
- OWASP ZAP: https://www.zaproxy.org/
- Burp Suite: https://portswigger.net/burp
- OWASP Testing Guide: https://owasp.org/www-project-web-security-testing-guide/

---

**Not:** Tüm testler sadece **kendi sisteminizde ve izniniz dahilinde** yapılmalıdır. Başkasının sisteminde izinsiz güvenlik testi yapmak yasadışıdır.


