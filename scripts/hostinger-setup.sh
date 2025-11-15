#!/bin/bash

# ============================================
# HOSTINGER VPS + DOKPLOY AUTOMATED SETUP
# ============================================
#
# Bu script Hostinger VPS'inizi otomatik olarak
# Docker ve Dokploy için hazırlar.
#
# Kullanım:
#   1. Hostinger VPS'e SSH ile bağlanın
#   2. Bu scripti çalıştırın: bash hostinger-setup.sh
#   3. Script tüm kurulumu otomatik yapacak
#
# ⚠️ ROOT olarak çalıştırılmalı!
#

set -e  # Hata durumunda dur

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_banner() {
    echo ""
    echo "╔═══════════════════════════════════════════════════╗"
    echo "║    🚀 HOSTINGER VPS + DOKPLOY SETUP 🚀          ║"
    echo "║    CampScape Backend Deployment                  ║"
    echo "╚═══════════════════════════════════════════════════╝"
    echo ""
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        log_error "Bu script root olarak çalıştırılmalı!"
        echo "Lütfen: sudo bash hostinger-setup.sh"
        exit 1
    fi
}

# Detect OS
detect_os() {
    log_info "İşletim sistemi tespit ediliyor..."
    
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        log_error "İşletim sistemi tespit edilemedi!"
        exit 1
    fi
    
    log_success "OS: $OS $VER"
    
    # Ubuntu kontrolü
    if [[ $OS != *"Ubuntu"* ]]; then
        log_warning "Bu script Ubuntu için optimize edilmiştir. Devam edilsin mi? (y/n)"
        read -r response
        if [[ ! $response =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi
}

# Update system
update_system() {
    log_info "Sistem güncelleniyor..."
    apt update -qq
    apt upgrade -y -qq
    log_success "Sistem güncellendi"
}

# Install basic packages
install_basics() {
    log_info "Temel paketler kuruluyor..."
    apt install -y -qq \
        curl \
        wget \
        git \
        nano \
        vim \
        htop \
        ufw \
        fail2ban \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    log_success "Temel paketler kuruldu"
}

# Install Docker
install_docker() {
    log_info "Docker kuruluyor..."
    
    # Docker zaten kurulu mu?
    if command -v docker &> /dev/null; then
        log_warning "Docker zaten kurulu"
        docker --version
        return
    fi
    
    # Docker kurulum scripti
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sh /tmp/get-docker.sh
    
    # Docker Compose plugin
    apt install -y docker-compose-plugin
    
    # Docker'ı başlat
    systemctl enable docker
    systemctl start docker
    
    # Doğrulama
    if docker --version && docker compose version; then
        log_success "Docker başarıyla kuruldu"
        docker --version
        docker compose version
    else
        log_error "Docker kurulumu başarısız!"
        exit 1
    fi
}

# Install Dokploy
install_dokploy() {
    log_info "Dokploy kuruluyor..."
    
    # Dokploy kurulum
    curl -sSL https://dokploy.com/install.sh | sh
    
    # Kurulum bekle
    sleep 10
    
    # Dokploy kontrol
    if docker ps | grep -q dokploy; then
        log_success "Dokploy başarıyla kuruldu"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎉 Dokploy Dashboard: http://$(hostname -I | awk '{print $1}'):3000"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
    else
        log_error "Dokploy kurulumu başarısız!"
        exit 1
    fi
}

# Configure firewall
configure_firewall() {
    log_info "Firewall yapılandırılıyor..."
    
    # UFW kuralları
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (current port)
    SSH_PORT=$(grep "^Port" /etc/ssh/sshd_config 2>/dev/null | awk '{print $2}')
    if [ -z "$SSH_PORT" ]; then
        SSH_PORT=22
    fi
    ufw allow $SSH_PORT/tcp comment 'SSH'
    
    # Allow HTTP/HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Allow Dokploy Dashboard
    ufw allow 3000/tcp comment 'Dokploy Dashboard'
    
    # Enable firewall
    ufw --force enable
    
    log_success "Firewall yapılandırıldı"
    ufw status verbose
}

# Configure fail2ban
configure_fail2ban() {
    log_info "Fail2Ban yapılandırılıyor..."
    
    # Jail configuration
    cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = root@localhost
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF
    
    # Start fail2ban
    systemctl enable fail2ban
    systemctl restart fail2ban
    
    log_success "Fail2Ban yapılandırıldı"
}

# Setup swap (if needed)
setup_swap() {
    log_info "Swap kontrolü yapılıyor..."
    
    # Mevcut swap kontrolü
    SWAP_SIZE=$(free -m | awk '/Swap:/ {print $2}')
    
    if [ "$SWAP_SIZE" -gt 0 ]; then
        log_warning "Swap zaten mevcut ($SWAP_SIZE MB)"
        return
    fi
    
    # RAM miktarı
    RAM_SIZE=$(free -m | awk '/Mem:/ {print $2}')
    
    # Swap boyutu belirle (RAM'in 2 katı, max 4GB)
    if [ "$RAM_SIZE" -lt 2048 ]; then
        SWAP_SIZE_GB=2
    elif [ "$RAM_SIZE" -lt 4096 ]; then
        SWAP_SIZE_GB=4
    else
        log_info "RAM yeterli, swap oluşturulmayacak"
        return
    fi
    
    log_info "Swap oluşturuluyor (${SWAP_SIZE_GB}GB)..."
    
    # Swap dosyası oluştur
    fallocate -l ${SWAP_SIZE_GB}G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Permanent yap
    if ! grep -q "/swapfile" /etc/fstab; then
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    
    # Swappiness ayarla
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    sysctl -p > /dev/null 2>&1
    
    log_success "Swap oluşturuldu (${SWAP_SIZE_GB}GB)"
}

# System optimization
optimize_system() {
    log_info "Sistem optimize ediliyor..."
    
    # Sysctl optimization
    cat >> /etc/sysctl.conf <<EOF

# CampScape Optimization
vm.swappiness=10
vm.vfs_cache_pressure=50
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 30
fs.file-max = 100000
EOF
    
    sysctl -p > /dev/null 2>&1
    
    # Limits configuration
    cat >> /etc/security/limits.conf <<EOF

# CampScape Limits
* soft nofile 65535
* hard nofile 65535
* soft nproc 65535
* hard nproc 65535
EOF
    
    log_success "Sistem optimize edildi"
}

# Create backup script
create_backup_script() {
    log_info "Backup scripti oluşturuluyor..."
    
    mkdir -p /root/backups
    
    cat > /root/backup-campscape.sh <<'EOF'
#!/bin/bash

# Configuration
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
RETENTION_DAYS=7

# MySQL password - Dokploy'dan alacaksınız
DB_PASSWORD="YOUR_MYSQL_ROOT_PASSWORD"

mkdir -p $BACKUP_DIR

echo "🗄️  MySQL backup..."
docker exec campscape-mysql mysqldump -u root -p$DB_PASSWORD campscape_marketplace > $BACKUP_DIR/db_$DATE.sql

echo "📁 Uploads backup..."
docker cp campscape-backend:/app/uploads $BACKUP_DIR/uploads_$DATE

echo "🗜️  Compressing..."
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR db_$DATE.sql uploads_$DATE

# Cleanup
rm -rf $BACKUP_DIR/db_$DATE.sql $BACKUP_DIR/uploads_$DATE

echo "🧹 Old backups cleanup..."
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

BACKUP_SIZE=$(du -h $BACKUP_DIR/backup_$DATE.tar.gz | cut -f1)
echo "✅ Backup completed: backup_$DATE.tar.gz ($BACKUP_SIZE)"
EOF
    
    chmod +x /root/backup-campscape.sh
    
    log_success "Backup scripti oluşturuldu: /root/backup-campscape.sh"
    log_warning "DB_PASSWORD'u düzenleyip crontab ekleyin!"
}

# Generate secrets
generate_secrets() {
    log_info "Güvenlik secret'ları oluşturuluyor..."
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔐 GÜVENLIK SECRET'LARI (Kaydedin!)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # JWT Secret
    JWT_SECRET=$(openssl rand -hex 32)
    echo "JWT_SECRET:"
    echo "$JWT_SECRET"
    echo ""
    
    # JWT Refresh Secret
    JWT_REFRESH_SECRET=$(openssl rand -hex 32)
    echo "JWT_REFRESH_SECRET:"
    echo "$JWT_REFRESH_SECRET"
    echo ""
    
    # MySQL Password
    MYSQL_PASSWORD=$(openssl rand -base64 24)
    echo "MYSQL_ROOT_PASSWORD:"
    echo "$MYSQL_PASSWORD"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Save to file
    cat > /root/campscape-secrets.txt <<EOF
CAMPSCAPE SECRETS - $(date)
================================

JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
MYSQL_ROOT_PASSWORD=$MYSQL_PASSWORD

================================
Bu dosyayı güvenli bir yere kaydedin ve sunucudan silin!
EOF
    
    chmod 600 /root/campscape-secrets.txt
    
    log_success "Secret'lar /root/campscape-secrets.txt dosyasına kaydedildi"
}

# Print summary
print_summary() {
    echo ""
    echo "╔═══════════════════════════════════════════════════╗"
    echo "║    ✅ KURULUM TAMAMLANDI! ✅                     ║"
    echo "╚═══════════════════════════════════════════════════╝"
    echo ""
    
    VPS_IP=$(hostname -I | awk '{print $1}')
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 KURULUM BİLGİLERİ"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "VPS IP: $VPS_IP"
    echo "Dokploy Dashboard: http://$VPS_IP:3000"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔐 GÜVENLİK DOSYALARI"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Secret'lar: /root/campscape-secrets.txt"
    echo "Backup Script: /root/backup-campscape.sh"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 SONRAKI ADIMLAR"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Dokploy Dashboard'a git: http://$VPS_IP:3000"
    echo "2. Admin hesabı oluştur"
    echo "3. GitHub repository bağla"
    echo "4. MySQL servisi oluştur (campscape-mysql)"
    echo "5. Backend application oluştur"
    echo "6. Environment variables ekle (/root/campscape-secrets.txt'den)"
    echo "7. Deploy et!"
    echo ""
    echo "Detaylı rehber: HOSTINGER_DOKPLOY_DEPLOYMENT.md"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Main execution
main() {
    print_banner
    
    check_root
    detect_os
    
    log_info "Kurulum başlıyor..."
    echo ""
    
    update_system
    install_basics
    install_docker
    install_dokploy
    configure_firewall
    configure_fail2ban
    setup_swap
    optimize_system
    create_backup_script
    generate_secrets
    
    print_summary
    
    log_success "Kurulum başarıyla tamamlandı!"
    log_info "VPS'i reboot etmek önerilir: reboot"
}

# Run main
main

exit 0


