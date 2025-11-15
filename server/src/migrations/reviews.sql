-- Reviews & Ratings System Migration
-- Değerlendirme ve yorum sistemi için tablolar

-- 1. Reviews table - Kamp alanları için değerlendirmeler
CREATE TABLE IF NOT EXISTS campsite_reviews (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    campsite_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    visit_date DATE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    admin_response TEXT,
    admin_response_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (campsite_id) REFERENCES campsites(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_campsite_id (campsite_id),
    INDEX idx_is_approved (is_approved),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- 2. Gear Reviews table - Ekipman değerlendirmeleri
CREATE TABLE IF NOT EXISTS gear_reviews (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    gear_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    would_recommend BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    admin_response TEXT,
    admin_response_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (gear_id) REFERENCES gear(id) ON DELETE CASCADE,
    
    -- Her kullanıcı bir ürün için sadece bir değerlendirme yapabilir
    UNIQUE KEY unique_user_gear (user_id, gear_id),
    
    INDEX idx_user_id (user_id),
    INDEX idx_gear_id (gear_id),
    INDEX idx_is_approved (is_approved),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- 3. Review Photos table - Değerlendirme fotoğrafları
CREATE TABLE IF NOT EXISTS review_photos (
    id VARCHAR(36) PRIMARY KEY,
    review_id VARCHAR(36) NOT NULL,
    review_type ENUM('campsite', 'gear') NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    caption VARCHAR(200),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_review_id_type (review_id, review_type),
    INDEX idx_created_at (created_at)
);

-- 4. Review Helpful Votes table - Faydalı/beğeni sistemi
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    id VARCHAR(36) PRIMARY KEY,
    review_id VARCHAR(36) NOT NULL,
    review_type ENUM('campsite', 'gear') NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Her kullanıcı bir yorumu sadece bir kez faydalı bulabilir
    UNIQUE KEY unique_user_review (user_id, review_id, review_type),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_review_id_type (review_id, review_type),
    INDEX idx_user_id (user_id)
);

-- 5. Review Reports table - Yorum şikayet sistemi
CREATE TABLE IF NOT EXISTS review_reports (
    id VARCHAR(36) PRIMARY KEY,
    review_id VARCHAR(36) NOT NULL,
    review_type ENUM('campsite', 'gear') NOT NULL,
    reporter_user_id VARCHAR(36) NOT NULL,
    reason ENUM('spam', 'offensive', 'fake', 'irrelevant', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewed', 'actioned', 'dismissed') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_review_id_type (review_id, review_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- İstatistikler için görünümler
CREATE OR REPLACE VIEW campsite_rating_stats AS
SELECT 
    campsite_id,
    COUNT(*) as total_reviews,
    AVG(rating) as average_rating,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
FROM campsite_reviews
WHERE is_approved = TRUE
GROUP BY campsite_id;

CREATE OR REPLACE VIEW gear_rating_stats AS
SELECT 
    gear_id,
    COUNT(*) as total_reviews,
    AVG(rating) as average_rating,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star,
    SUM(CASE WHEN would_recommend = TRUE THEN 1 ELSE 0 END) as recommend_count
FROM gear_reviews
WHERE is_approved = TRUE
GROUP BY gear_id;





