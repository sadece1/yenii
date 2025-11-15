# ⚠️ Backend Sunucusu Başlatma Talimatları

## Sorun: ECONNREFUSED Hatası

Frontend çalışıyor ancak backend sunucusu çalışmıyor. `ECONNREFUSED` hatası backend'in port 3000'de çalışmadığını gösteriyor.

## Çözüm: Backend'i Başlatın

### Windows PowerShell ile:

1. **Yeni bir terminal penceresi açın** (backend için ayrı terminal)

2. **Backend klasörüne gidin:**
   ```powershell
   cd "C:\Users\huzey\Desktop\Yeni klasör (5)\server"
   ```

3. **.env dosyasını kontrol edin:**
   ```powershell
   if (Test-Path .env) { Write-Host ".env exists" } else { Copy-Item env.example.txt .env }
   ```

4. **Bağımlılıkları yükleyin (ilk kez çalıştırıyorsanız):**
   ```powershell
   npm install
   ```

5. **Veritabanını oluşturun (MySQL'de):**
   ```sql
   CREATE DATABASE IF NOT EXISTS campscape_marketplace;
   ```

6. **Veritabanı tablolarını oluşturun:**
   ```powershell
   npm run db:migrate
   ```

7. **Test verilerini yükleyin (opsiyonel):**
   ```powershell
   npm run db:seed
   ```

8. **Backend sunucusunu başlatın:**
   ```powershell
   npm run dev
   ```

### Başarılı Başlatma İşareti

Backend başarıyla başladığında şu mesajları göreceksiniz:

```
🚀 Server is running on port 3000 in development mode
📡 API endpoint: http://localhost:3000/api
🏥 Health check: http://localhost:3000/health
✅ Database connection established successfully
```

## Önemli Notlar

1. **İki terminal penceresi gerekli:**
   - Terminal 1: Frontend (`npm run dev` - ana klasörde)
   - Terminal 2: Backend (`npm run dev` - server klasöründe)

2. **Port kontrolü:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

3. **MySQL gereklidir:**
   - MySQL servisinin çalıştığından emin olun
   - Windows'ta: `services.msc` ile kontrol edin

## Hızlı Başlatma Komutu

Tek satırda başlatmak için:

```powershell
cd server; npm run dev
```

## Sorun Giderme

### "Cannot find module" hatası
```powershell
cd server
npm install
```

### "Database connection failed" hatası
- MySQL'in çalıştığından emin olun
- `.env` dosyasındaki veritabanı bilgilerini kontrol edin
- Veritabanının oluşturulduğundan emin olun

### Port zaten kullanılıyor hatası
```powershell
netstat -ano | findstr ":3000"
```
Çıkan PID'yi not edin ve işlemi sonlandırın veya farklı bir port kullanın.






