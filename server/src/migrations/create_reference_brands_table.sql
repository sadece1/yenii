-- Create reference_brands table
CREATE TABLE IF NOT EXISTS reference_brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500) NOT NULL,
  website_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active brands ordered by display_order
CREATE INDEX idx_reference_brands_active_order ON reference_brands (is_active, display_order, created_at);

-- Add comment to table
COMMENT ON TABLE reference_brands IS 'Reference brands/partners with logos displayed on the references page';




