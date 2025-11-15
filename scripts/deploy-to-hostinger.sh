#!/bin/bash

# ============================================
# CAMPSCAPE - HOSTINGER VPS DEPLOYMENT SCRIPT
# ============================================
#
# Bu script Hostinger VPS'te tüm deployment işlemini
# otomatik olarak yapar.
#
# Kullanım:
#   1. Hostinger VPS'e SSH ile bağlan
#   2. Bu scripti çalıştır: bash deploy-to-hostinger.sh
#   3. Script tüm işlemleri otomatik yapacak
#
# ⚠️ ROOT olarak çalıştırılmalı!
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration (Değiştirilebilir)
GITHUB_REPO="your-username/campscape"
GITHUB_BRANCH="main"
DOMAIN="campscape.com"
API_SUBDOMAIN="api"
MYSQL_SERVICE_NAME="campscape-mysql"
APP_NAME="campscape-backend"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

log_info() {
    echo -e "${CYAN}ℹ️${NC} $1"
}

print_banner() {
    clear
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║    🚀 CAMPSCAPE - HOSTINGER VPS DEPLOYMENT 🚀            ║"
    echo "║                                                           ║"
    echo "║    Otomatik Backend Deployment Script                    ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
}

# Check root
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        log_error "Bu script root olarak çalıştırılmalı!"
        echo "Lütfen: sudo bash deploy-to-hostinger.sh"
        exit 1
    fi
}

# Check dependencies
check_dependencies() {
    log "Bağımlılıklar kontrol ediliyor..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker bulunamadı! Önce Docker kurun."
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl bulunamadı!"
        exit 1
    fi
    
    log_success "Tüm bağımlılıklar mevcut"
}

# Generate secrets
generate_secrets() {
    log "Güvenlik secret'ları oluşturuluyor..."
    
    JWT_SECRET=$(openssl rand -hex 32)
    JWT_REFRESH_SECRET=$(openssl rand -hex 32)
    MYSQL_PASSWORD=$(openssl rand -base64 24)
    
    # Save to file
    cat > /root/campscape-secrets.txt <<EOF
# CampScape Secrets - $(date)
# ============================================

JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
MYSQL_ROOT_PASSWORD=$MYSQL_PASSWORD

# ============================================
# Bu dosyayı güvenli bir yere kaydedin!
# ============================================
EOF
    
    chmod 600 /root/campscape-secrets.txt
    
    log_success "Secret'lar oluşturuldu: /root/campscape-secrets.txt"
    
    # Export for use
    export JWT_SECRET
    export JWT_REFRESH_SECRET
    export MYSQL_PASSWORD
}

# Check Dokploy
check_dokploy() {
    log "Dokploy kontrol ediliyor..."
    
    if ! docker ps | grep -q dokploy; then
        log_warning "Dokploy bulunamadı! Kuruluyor..."
        curl -sSL https://dokploy.com/install.sh | sh
        sleep 10
    fi
    
    if docker ps | grep -q dokploy; then
        log_success "Dokploy çalışıyor"
        return 0
    else
        log_error "Dokploy kurulumu başarısız!"
        return 1
    fi
}

# Get Dokploy API token (manual step)
get_dokploy_info() {
    log_info "Dokploy Dashboard bilgileri:"
    VPS_IP=$(hostname -I | awk '{print $1}')
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 DOKPLOY DASHBOARD"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "URL: http://$VPS_IP:3000"
    echo ""
    echo "Lütfen Dokploy dashboard'a giriş yapın ve:"
    echo "1. Admin hesabı oluşturun (ilk kez)"
    echo "2. GitHub repository'yi bağlayın"
    echo ""
    read -p "Devam etmek için ENTER'a basın..."
}

# Create MySQL service via Dokploy API (if available)
# Note: This requires Dokploy API access
create_mysql_service() {
    log "MySQL servisi oluşturuluyor..."
    
    log_warning "MySQL servisi Dokploy dashboard'dan manuel oluşturulmalı"
    log_info "Adımlar:"
    echo "  1. Dokploy Dashboard → Services → Add Service"
    echo "  2. MySQL 8.0 seç"
    echo "  3. Name: $MYSQL_SERVICE_NAME"
    echo "  4. Database: campscape_marketplace"
    echo "  5. Root Password: $MYSQL_PASSWORD"
    echo "  6. Create"
    echo ""
    read -p "MySQL servisi oluşturuldu mu? (y/n): " mysql_ready
    
    if [[ ! $mysql_ready =~ ^[Yy]$ ]]; then
        log_error "MySQL servisi oluşturulmalı!"
        exit 1
    fi
    
    log_success "MySQL servisi hazır"
}

# Create backend application via Dokploy API (if available)
create_backend_app() {
    log "Backend application oluşturuluyor..."
    
    log_warning "Backend application Dokploy dashboard'dan manuel oluşturulmalı"
    log_info "Adımlar:"
    echo "  1. Dokploy Dashboard → Applications → New Application"
    echo "  2. Docker seç"
    echo "  3. Name: $APP_NAME"
    echo "  4. Repository: $GITHUB_REPO"
    echo "  5. Branch: $GITHUB_BRANCH"
    echo "  6. Dockerfile: server/Dockerfile"
    echo "  7. Context: server/"
    echo "  8. Port: 3000"
    echo ""
    read -p "Backend application oluşturuldu mu? (y/n): " app_ready
    
    if [[ ! $app_ready =~ ^[Yy]$ ]]; then
        log_error "Backend application oluşturulmalı!"
        exit 1
    fi
    
    log_success "Backend application hazır"
}

# Setup environment variables
setup_env_vars() {
    log "Environment variables yapılandırılıyor..."
    
    log_info "Dokploy dashboard'da environment variables ekleyin:"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 ENVIRONMENT VARIABLES"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    cat <<EOF
NODE_ENV=production
PORT=3000

DB_HOST=$MYSQL_SERVICE_NAME
DB_USER=root
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=campscape_marketplace
DB_PORT=3306

JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

FRONTEND_URL=https://$DOMAIN
ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN,https://$API_SUBDOMAIN.$DOMAIN

MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg
UPLOAD_DIR=/app/uploads
HTTPS_ENFORCE=true
LOG_LEVEL=info
EOF
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "Environment variables eklendi mi? (y/n): " env_ready
    
    if [[ ! $env_ready =~ ^[Yy]$ ]]; then
        log_error "Environment variables eklenmeli!"
        exit 1
    fi
    
    log_success "Environment variables yapılandırıldı"
}

# Setup volumes
setup_volumes() {
    log "Volumes yapılandırılıyor..."
    
    log_info "Dokploy dashboard'da volumes ekleyin:"
    echo ""
    echo "Volume 1:"
    echo "  Name: campscape-uploads"
    echo "  Mount Path: /app/uploads"
    echo ""
    echo "Volume 2:"
    echo "  Name: campscape-logs"
    echo "  Mount Path: /app/logs"
    echo ""
    read -p "Volumes eklendi mi? (y/n): " volumes_ready
    
    if [[ ! $volumes_ready =~ ^[Yy]$ ]]; then
        log_warning "Volumes eklenmedi, devam ediliyor..."
    else
        log_success "Volumes yapılandırıldı"
    fi
}

# Setup domain and SSL
setup_domain() {
    log "Domain ve SSL yapılandırılıyor..."
    
    log_info "Dokploy dashboard'da domain ekleyin:"
    echo ""
    echo "Domain: $API_SUBDOMAIN.$DOMAIN"
    echo "SSL: Let's Encrypt ✅"
    echo "Force HTTPS: ✅"
    echo ""
    read -p "Domain eklendi mi? (y/n): " domain_ready
    
    if [[ ! $domain_ready =~ ^[Yy]$ ]]; then
        log_warning "Domain eklenmedi, devam ediliyor..."
    else
        log_success "Domain yapılandırıldı"
    fi
}

# Deploy application
deploy_app() {
    log "Application deploy ediliyor..."
    
    log_info "Dokploy dashboard'da 'Deploy' butonuna basın"
    echo ""
    read -p "Deployment başladı mı? (y/n): " deploy_started
    
    if [[ ! $deploy_started =~ ^[Yy]$ ]]; then
        log_error "Deployment başlatılmalı!"
        exit 1
    fi
    
    log_info "Build loglarını izleyin (2-5 dakika)..."
    echo ""
    read -p "Deployment tamamlandı mı? (y/n): " deploy_done
    
    if [[ ! $deploy_done =~ ^[Yy]$ ]]; then
        log_error "Deployment tamamlanmalı!"
        exit 1
    fi
    
    log_success "Deployment tamamlandı"
}

# Run database migration
run_migration() {
    log "Database migration çalıştırılıyor..."
    
    log_info "Dokploy Console'dan migration çalıştırın:"
    echo ""
    echo "  1. Application → Console"
    echo "  2. Terminal'de: npm run db:migrate"
    echo "  3. Sonra: npm run db:seed"
    echo ""
    read -p "Migration tamamlandı mı? (y/n): " migration_done
    
    if [[ ! $migration_done =~ ^[Yy]$ ]]; then
        log_error "Migration çalıştırılmalı!"
        exit 1
    fi
    
    log_success "Database migration tamamlandı"
}

# Test deployment
test_deployment() {
    log "Deployment test ediliyor..."
    
    API_URL="https://$API_SUBDOMAIN.$DOMAIN"
    
    log_info "Test komutları:"
    echo ""
    echo "# Health check"
    echo "curl $API_URL/health"
    echo ""
    echo "# API test"
    echo "curl $API_URL/api/gear"
    echo ""
    echo "# Login test"
    echo "curl -X POST $API_URL/api/auth/login \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"email\":\"admin@campscape.com\",\"password\":\"Admin123!\"}'"
    echo ""
    
    read -p "Testleri çalıştırdınız mı? (y/n): " tests_done
    
    if [[ $tests_done =~ ^[Yy]$ ]]; then
        log_success "Deployment test edildi"
    else
        log_warning "Testler atlandı"
    fi
}

# Print summary
print_summary() {
    VPS_IP=$(hostname -I | awk '{print $1}')
    API_URL="https://$API_SUBDOMAIN.$DOMAIN"
    
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║    ✅ DEPLOYMENT TAMAMLANDI! ✅                          ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 ERİŞİM BİLGİLERİ"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Backend API: $API_URL"
    echo "Dokploy Dashboard: http://$VPS_IP:3000"
    echo "Health Check: $API_URL/health"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔐 CREDENTIALS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "API Admin:"
    echo "  Email: admin@campscape.com"
    echo "  Password: Admin123!"
    echo ""
    echo "Secret'lar: /root/campscape-secrets.txt"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 SONRAKI ADIMLAR"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. ✅ Frontend'i deploy et"
    echo "2. ✅ Frontend'de VITE_API_URL güncelle"
    echo "3. ✅ Security tests çalıştır"
    echo "4. ✅ Monitoring kur (UptimeRobot)"
    echo "5. ✅ Backup scripti test et"
    echo ""
}

# Main execution
main() {
    print_banner
    
    check_root
    check_dependencies
    generate_secrets
    check_dokploy
    get_dokploy_info
    create_mysql_service
    create_backend_app
    setup_env_vars
    setup_volumes
    setup_domain
    deploy_app
    run_migration
    test_deployment
    print_summary
    
    log_success "Tüm deployment adımları tamamlandı!"
}

# Run
main

exit 0


