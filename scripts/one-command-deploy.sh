#!/bin/bash

# ============================================
# ONE-COMMAND DEPLOYMENT
# ============================================
#
# Tek komutla tüm kurulumu yapar!
# 
# Kullanım:
#   curl -sSL https://raw.githubusercontent.com/your-repo/scripts/one-command-deploy.sh | bash
#
# veya
#
#   bash <(curl -sSL https://raw.githubusercontent.com/your-repo/scripts/one-command-deploy.sh)
#

set -e

echo "🚀 CampScape - One Command Deployment"
echo "======================================"
echo ""

# Check root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Root olarak çalıştırılmalı!"
    echo "Lütfen: sudo bash one-command-deploy.sh"
    exit 1
fi

# Step 1: System update
echo "📦 Sistem güncelleniyor..."
apt update -qq && apt upgrade -y -qq

# Step 2: Install basics
echo "📦 Temel paketler kuruluyor..."
apt install -y -qq curl wget git ufw fail2ban

# Step 3: Install Docker
echo "🐳 Docker kuruluyor..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Step 4: Install Dokploy
echo "🚀 Dokploy kuruluyor..."
if ! docker ps | grep -q dokploy; then
    curl -sSL https://dokploy.com/install.sh | sh
    sleep 10
fi

# Step 5: Configure firewall
echo "🔥 Firewall yapılandırılıyor..."
ufw allow 22,80,443,3000/tcp
ufw --force enable

# Step 6: Generate secrets
echo "🔐 Secret'lar oluşturuluyor..."
mkdir -p /root/backups
cat > /root/campscape-secrets.txt <<EOF
# CampScape Secrets - $(date)
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 24)
EOF
chmod 600 /root/campscape-secrets.txt

# Get VPS IP
VPS_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║    ✅ KURULUM TAMAMLANDI! ✅                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Dokploy Dashboard: http://$VPS_IP:3000"
echo "🔐 Secret'lar: /root/campscape-secrets.txt"
echo ""
echo "📝 Sonraki adımlar:"
echo "   1. Dokploy dashboard'a git"
echo "   2. Admin hesabı oluştur"
echo "   3. GitHub repository bağla"
echo "   4. MySQL servisi oluştur"
echo "   5. Backend application oluştur"
echo ""
echo "Detaylı rehber: HOSTINGER_QUICKSTART.md"
echo ""


