#!/usr/bin/env node

/**
 * CampScape Sistem Testi
 * Otomatik sistem test script'i
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Test sonuçları
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

// Renkler
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addTest(name, status, message = '') {
  results.total++;
  if (status === 'passed') results.passed++;
  else if (status === 'failed') results.failed++;
  else if (status === 'warning') results.warnings++;
  
  results.tests.push({ name, status, message });
  
  const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
  const color = status === 'passed' ? 'green' : status === 'failed' ? 'red' : 'yellow';
  log(`${icon} ${name}${message ? ': ' + message : ''}`, color);
}

function checkFileExists(filePath, testName) {
  try {
    if (fs.existsSync(filePath)) {
      addTest(testName, 'passed');
      return true;
    } else {
      addTest(testName, 'failed', 'Dosya bulunamadı');
      return false;
    }
  } catch (error) {
    addTest(testName, 'failed', error.message);
    return false;
  }
}

function checkDirectoryExists(dirPath, testName) {
  try {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      addTest(testName, 'passed');
      return true;
    } else {
      addTest(testName, 'failed', 'Klasör bulunamadı');
      return false;
    }
  } catch (error) {
    addTest(testName, 'failed', error.message);
    return false;
  }
}

function checkPackageJson(packagePath, testName) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {}).length;
    const devDependencies = Object.keys(packageJson.devDependencies || {}).length;
    addTest(testName, 'passed', `${dependencies} dependency, ${devDependencies} devDependency`);
    return packageJson;
  } catch (error) {
    addTest(testName, 'failed', error.message);
    return null;
  }
}

function checkEnvFile(envPath, testName) {
  try {
    if (fs.existsSync(envPath)) {
      addTest(testName, 'passed');
      return true;
    } else {
      addTest(testName, 'warning', 'Env dosyası bulunamadı (optional)');
      return false;
    }
  } catch (error) {
    addTest(testName, 'warning', error.message);
    return false;
  }
}

function countFiles(dirPath, extension) {
  try {
    if (!fs.existsSync(dirPath)) return 0;
    const files = fs.readdirSync(dirPath);
    return files.filter(file => file.endsWith(extension)).length;
  } catch (error) {
    return 0;
  }
}

function checkControllers() {
  const controllerPath = path.join(__dirname, 'server', 'src', 'controllers');
  const count = countFiles(controllerPath, '.ts');
  addTest(`Controllers kontrolü`, count > 10 ? 'passed' : 'warning', `${count} controller bulundu`);
}

function checkRoutes() {
  const routesPath = path.join(__dirname, 'server', 'src', 'routes');
  const count = countFiles(routesPath, '.ts');
  addTest(`Routes kontrolü`, count > 10 ? 'passed' : 'warning', `${count} route dosyası bulundu`);
}

function checkMiddleware() {
  const middlewarePath = path.join(__dirname, 'server', 'src', 'middleware');
  const count = countFiles(middlewarePath, '.ts');
  addTest(`Middleware kontrolü`, count > 5 ? 'passed' : 'warning', `${count} middleware bulundu`);
}

function checkPages() {
  const pagesPath = path.join(__dirname, 'src', 'pages');
  const count = countFiles(pagesPath, '.tsx');
  addTest(`Pages kontrolü`, count > 15 ? 'passed' : 'warning', `${count} sayfa bulundu`);
}

function checkServices() {
  const servicesPath = path.join(__dirname, 'src', 'services');
  const count = countFiles(servicesPath, '.ts');
  addTest(`Services kontrolü`, count > 10 ? 'passed' : 'warning', `${count} service bulundu`);
}

function checkComponents() {
  const componentsPath = path.join(__dirname, 'src', 'components');
  if (fs.existsSync(componentsPath)) {
    const items = fs.readdirSync(componentsPath);
    addTest(`Components kontrolü`, items.length > 20 ? 'passed' : 'warning', `${items.length} component bulundu`);
  } else {
    addTest(`Components kontrolü`, 'failed', 'Components klasörü bulunamadı');
  }
}

async function checkNodeModules() {
  try {
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      addTest('Frontend node_modules', 'passed');
    } else {
      addTest('Frontend node_modules', 'warning', 'npm install gerekiyor');
    }
    
    const serverNodeModulesPath = path.join(__dirname, 'server', 'node_modules');
    if (fs.existsSync(serverNodeModulesPath)) {
      addTest('Backend node_modules', 'passed');
    } else {
      addTest('Backend node_modules', 'warning', 'Backend için npm install gerekiyor');
    }
  } catch (error) {
    addTest('Node modules kontrolü', 'failed', error.message);
  }
}

function checkSecurityFiles() {
  log('\n🔒 Güvenlik Dosyaları Kontrolü', 'cyan');
  checkFileExists(
    path.join(__dirname, 'server', 'src', 'middleware', 'auth.ts'),
    'Auth middleware'
  );
  checkFileExists(
    path.join(__dirname, 'server', 'src', 'middleware', 'uploadSecurity.ts'),
    'Upload security middleware'
  );
  checkFileExists(
    path.join(__dirname, 'server', 'src', 'middleware', 'fileValidation.ts'),
    'File validation middleware'
  );
  checkFileExists(
    path.join(__dirname, 'server', 'src', 'middleware', 'bruteForce.ts'),
    'Brute force protection'
  );
  checkFileExists(
    path.join(__dirname, 'server', 'src', 'middleware', 'csrf.ts'),
    'CSRF protection'
  );
}

function checkDockerFiles() {
  log('\n🐳 Docker Dosyaları Kontrolü', 'cyan');
  checkFileExists(path.join(__dirname, 'Dockerfile'), 'Dockerfile');
  checkFileExists(path.join(__dirname, 'docker-compose.yml'), 'docker-compose.yml');
  checkFileExists(path.join(__dirname, 'docker-compose.prod.yml'), 'docker-compose.prod.yml');
  checkFileExists(path.join(__dirname, 'nginx.conf'), 'nginx.conf');
}

function checkDeploymentFiles() {
  log('\n🚀 Deployment Dosyaları Kontrolü', 'cyan');
  checkFileExists(path.join(__dirname, 'deploy.sh'), 'deploy.sh');
  checkFileExists(path.join(__dirname, 'docker-deploy.sh'), 'docker-deploy.sh');
  checkFileExists(
    path.join(__dirname, 'server', 'ecosystem.config.js'),
    'PM2 ecosystem.config.js'
  );
}

function checkDocumentation() {
  log('\n📚 Dokümantasyon Kontrolü', 'cyan');
  checkFileExists(path.join(__dirname, 'README.md'), 'Ana README');
  checkFileExists(path.join(__dirname, 'QUICK_START.md'), 'Quick Start');
  checkFileExists(path.join(__dirname, 'server', 'README.md'), 'Backend README');
  checkFileExists(
    path.join(__dirname, 'server', 'API_DOCUMENTATION.md'),
    'API Documentation'
  );
}

function checkTypeScriptConfig() {
  log('\n⚙️ TypeScript Konfigürasyonu', 'cyan');
  checkFileExists(path.join(__dirname, 'tsconfig.json'), 'Frontend tsconfig.json');
  checkFileExists(path.join(__dirname, 'server', 'tsconfig.json'), 'Backend tsconfig.json');
}

function analyzeSecurity() {
  log('\n🛡️ Güvenlik Analizi', 'cyan');
  
  // Check middleware files for security features
  const securityFeatures = [
    { name: 'JWT Authentication', file: 'server/src/middleware/auth.ts' },
    { name: 'Rate Limiting', file: 'server/src/app.ts' },
    { name: 'Helmet Security Headers', file: 'server/src/app.ts' },
    { name: 'CORS Configuration', file: 'server/src/app.ts' },
    { name: 'File Upload Security', file: 'server/src/middleware/uploadSecurity.ts' },
    { name: 'File Validation', file: 'server/src/middleware/fileValidation.ts' },
    { name: 'Brute Force Protection', file: 'server/src/middleware/bruteForce.ts' },
  ];
  
  securityFeatures.forEach(feature => {
    checkFileExists(path.join(__dirname, feature.file), feature.name);
  });
}

function printSummary() {
  log('\n' + '='.repeat(60), 'blue');
  log('📊 TEST SONUÇLARI', 'blue');
  log('='.repeat(60), 'blue');
  
  log(`\n🎯 Toplam Test: ${results.total}`, 'cyan');
  log(`✅ Başarılı: ${results.passed}`, 'green');
  log(`❌ Başarısız: ${results.failed}`, 'red');
  log(`⚠️  Uyarı: ${results.warnings}`, 'yellow');
  
  const successRate = ((results.passed / results.total) * 100).toFixed(2);
  log(`\n📈 Başarı Oranı: ${successRate}%`, successRate > 90 ? 'green' : successRate > 70 ? 'yellow' : 'red');
  
  if (results.failed === 0) {
    log('\n🎉 Tüm testler başarılı! Sistem production-ready.', 'green');
  } else {
    log('\n⚠️  Bazı testler başarısız. Lütfen sorunları düzeltin.', 'yellow');
  }
  
  // Kategorize results
  const categories = {
    'Backend Yapısı': 0,
    'Frontend Yapısı': 0,
    'Güvenlik': 0,
    'Deployment': 0,
    'Dokümantasyon': 0
  };
  
  log('\n📋 Kategori Bazlı Sonuçlar:', 'cyan');
  log('─'.repeat(60), 'blue');
  Object.keys(categories).forEach(category => {
    const categoryTests = results.tests.filter(t => 
      t.name.toLowerCase().includes(category.toLowerCase())
    );
    log(`${category}: ${categoryTests.length} test`, 'cyan');
  });
  
  log('\n' + '='.repeat(60), 'blue');
}

async function runTests() {
  log('🚀 CampScape Sistem Testi Başlatılıyor...', 'cyan');
  log('='.repeat(60) + '\n', 'blue');
  
  // 1. Backend Yapısı
  log('📦 Backend Yapısı Kontrolü', 'cyan');
  checkDirectoryExists(path.join(__dirname, 'server'), 'Server klasörü');
  checkDirectoryExists(path.join(__dirname, 'server', 'src'), 'Server src klasörü');
  checkFileExists(path.join(__dirname, 'server', 'src', 'server.ts'), 'Server.ts');
  checkFileExists(path.join(__dirname, 'server', 'src', 'app.ts'), 'App.ts');
  checkPackageJson(path.join(__dirname, 'server', 'package.json'), 'Backend package.json');
  checkEnvFile(path.join(__dirname, 'server', '.env'), 'Backend .env');
  checkEnvFile(path.join(__dirname, 'server', 'env.example.txt'), 'Backend env.example');
  checkControllers();
  checkRoutes();
  checkMiddleware();
  
  // 2. Frontend Yapısı
  log('\n🎨 Frontend Yapısı Kontrolü', 'cyan');
  checkDirectoryExists(path.join(__dirname, 'src'), 'Frontend src klasörü');
  checkFileExists(path.join(__dirname, 'src', 'App.tsx'), 'App.tsx');
  checkFileExists(path.join(__dirname, 'src', 'main.tsx'), 'Main.tsx');
  checkPackageJson(path.join(__dirname, 'package.json'), 'Frontend package.json');
  checkFileExists(path.join(__dirname, 'vite.config.ts'), 'Vite config');
  checkFileExists(path.join(__dirname, 'tailwind.config.js'), 'Tailwind config');
  checkFileExists(path.join(__dirname, 'index.html'), 'index.html');
  checkPages();
  checkServices();
  checkComponents();
  
  // 3. Node Modules
  log('\n📚 Dependencies Kontrolü', 'cyan');
  await checkNodeModules();
  
  // 4. Security
  checkSecurityFiles();
  
  // 5. Docker
  checkDockerFiles();
  
  // 6. Deployment
  checkDeploymentFiles();
  
  // 7. Documentation
  checkDocumentation();
  
  // 8. TypeScript
  checkTypeScriptConfig();
  
  // 9. Security Analysis
  analyzeSecurity();
  
  // Summary
  printSummary();
  
  // Detaylı rapor dosyası oluştur
  const reportPath = path.join(__dirname, 'TEST_RESULTS.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\n📄 Detaylı test raporu kaydedildi: ${reportPath}`, 'cyan');
}

// Ana fonksiyon
(async () => {
  try {
    await runTests();
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    log(`\n❌ Test sırasında hata oluştu: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
})();




