# 🤖 Otomatik Deployment Rehberi

## 🎯 Hızlı Başlangıç

### ⚡ Tek Komutla Kurulum

```bash
# Hostinger VPS'e SSH ile bağlan
ssh root@your-vps-ip

# Tek komutla tüm kurulumu yap
bash <(curl -sSL https://raw.githubusercontent.com/your-repo/scripts/one-command-deploy.sh)
```

**Bu komut şunları yapar:**
- ✅ Sistem güncellemesi
- ✅ Docker kurulumu
- ✅ Dokploy kurulumu
- ✅ Firewall yapılandırması
- ✅ Secret'lar oluşturma

**Süre:** ~5 dakika

---

## 📋 Adım Adım Otomatik Deployment

### Yöntem 1: Interactive Script (Önerilen)

```bash
# Hostinger VPS'e bağlan
ssh root@your-vps-ip

# Script'i indir
curl -o deploy-to-hostinger.sh https://raw.githubusercontent.com/your-repo/scripts/deploy-to-hostinger.sh

# Çalıştırılabilir yap
chmod +x deploy-to-hostinger.sh

# Çalıştır
./deploy-to-hostinger.sh
```

**Bu script:**
- ✅ Tüm adımları interaktif olarak yönlendirir
- ✅ Secret'ları otomatik oluşturur
- ✅ Dokploy kurulumunu kontrol eder
- ✅ Adım adım rehberlik eder

**Süre:** ~20 dakika

---

### Yöntem 2: Manuel Adımlar

Eğer script kullanmak istemiyorsanız:

#### 1. VPS Hazırlığı

```bash
# Hostinger VPS'e bağlan
ssh root@your-vps-ip

# Sistem güncelle
apt update && apt upgrade -y

# Docker kur
curl -fsSL https://get.docker.com | sh

# Dokploy kur
curl -sSL https://dokploy.com/install.sh | sh

# Firewall
ufw allow 22,80,443,3000/tcp
ufw enable
```

#### 2. Dokploy Dashboard

```
URL: http://your-vps-ip:3000
```

1. Admin hesabı oluştur
2. GitHub repository bağla
3. MySQL servisi oluştur
4. Backend application oluştur
5. Environment variables ekle
6. Deploy!

**Detaylı:** `HOSTINGER_QUICKSTART.md`

---

## 🔧 Script Özellikleri

### `one-command-deploy.sh`

**Ne yapar:**
- ✅ Sistem hazırlığı
- ✅ Docker + Dokploy kurulumu
- ✅ Firewall yapılandırması
- ✅ Secret generation

**Kullanım:**
```bash
bash <(curl -sSL your-repo/scripts/one-command-deploy.sh)
```

**Süre:** 5 dakika

---

### `deploy-to-hostinger.sh`

**Ne yapar:**
- ✅ Tüm `one-command-deploy.sh` özellikleri
- ✅ Interactive rehberlik
- ✅ Dokploy yapılandırması
- ✅ Environment variables setup
- ✅ Domain ve SSL yapılandırması
- ✅ Migration rehberliği

**Kullanım:**
```bash
./deploy-to-hostinger.sh
```

**Süre:** 20 dakika

---

### `hostinger-setup.sh`

**Ne yapar:**
- ✅ VPS hazırlığı
- ✅ Docker + Dokploy kurulumu
- ✅ Security hardening
- ✅ System optimization
- ✅ Backup scripti

**Kullanım:**
```bash
./hostinger-setup.sh
```

**Süre:** 10 dakika

---

## 🚀 GitHub Actions ile Otomatik Deploy

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [main]
    paths:
      - 'server/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Dokploy Deployment
        run: |
          curl -X POST ${{ secrets.DOKPLOY_WEBHOOK_URL }} \
            -H "Authorization: Bearer ${{ secrets.DOKPLOY_API_TOKEN }}"
```

**Kullanım:**
1. GitHub Secrets ekle:
   - `DOKPLOY_WEBHOOK_URL`
   - `DOKPLOY_API_TOKEN`

2. `git push` yap → Otomatik deploy! 🎉

---

## 📊 Deployment Karşılaştırması

| Yöntem | Süre | Zorluk | Otomasyon |
|--------|------|--------|-----------|
| **One Command** | 5 dk | ⭐ Kolay | %80 |
| **Interactive Script** | 20 dk | ⭐⭐ Orta | %90 |
| **Manuel** | 30 dk | ⭐⭐⭐ Zor | %0 |
| **GitHub Actions** | 2 dk | ⭐ Kolay | %100 |

---

## 🎯 Hangi Yöntemi Seçmeliyim?

### İlk Defa Deploy Ediyorsanız
→ **Interactive Script** (`deploy-to-hostinger.sh`)
- Adım adım rehberlik
- Hata yapma riski düşük
- Öğrenme fırsatı

### Hızlı Kurulum İstiyorsanız
→ **One Command** (`one-command-deploy.sh`)
- Tek komut
- Hızlı
- Minimal müdahale

### Tekrar Deploy Ediyorsanız
→ **GitHub Actions**
- Otomatik
- CI/CD entegrasyonu
- Zero-touch deployment

---

## 🔐 Security Notes

### Secret Management

**Script'ler secret'ları otomatik oluşturur:**
- `/root/campscape-secrets.txt`

**⚠️ ÖNEMLİ:**
1. Secret'ları güvenli bir yere kaydedin
2. Production'da farklı secret'lar kullanın
3. Secret dosyasını sunucudan silmeyin (backup alın)

### Firewall

**Otomatik açılan portlar:**
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (Dokploy Dashboard)

**Ek güvenlik:**
- Fail2ban otomatik kurulur
- SSH hardening önerilir

---

## 🆘 Sorun Giderme

### Script Çalışmıyor?

```bash
# Yetki ver
chmod +x script-name.sh

# Root olarak çalıştır
sudo ./script-name.sh

# Hata loglarını kontrol et
bash -x script-name.sh
```

### Dokploy Kurulmadı?

```bash
# Manuel kurulum
curl -sSL https://dokploy.com/install.sh | sh

# Kontrol
docker ps | grep dokploy
```

### Firewall Sorunu?

```bash
# Durumu kontrol
ufw status

# Port ekle
ufw allow 3000/tcp

# Restart
ufw reload
```

---

## 📚 İlgili Dosyalar

- `HOSTINGER_QUICKSTART.md` - 20 dakikada deploy
- `HOSTINGER_DOKPLOY_DEPLOYMENT.md` - Detaylı rehber
- `scripts/hostinger-setup.sh` - VPS setup
- `scripts/deploy-to-hostinger.sh` - Interactive deploy
- `scripts/one-command-deploy.sh` - Quick setup

---

## 🎉 Başarı!

**Artık otomatik deployment sisteminiz hazır!** 🚀

**Hızlı başlangıç:**
```bash
bash <(curl -sSL your-repo/scripts/one-command-deploy.sh)
```

**Detaylı rehber:**
```bash
./deploy-to-hostinger.sh
```

---

**Hazırlayan:** AI DevOps Engineer  
**Tarih:** 14 Kasım 2025  
**Versiyon:** 1.0

