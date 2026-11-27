-- ===================================================================
-- AuGust Aurea Limited - Production Database Schema for Hostinger MySQL
-- Hostinger hPanel -> Databases -> phpMyAdmin -> Import
-- ===================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: pages_seo
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pages_seo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(50) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `canonical_path` VARCHAR(255),
  `og_image` VARCHAR(500),
  `keywords` VARCHAR(500),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: content_sections
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `content_sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(50) NOT NULL,
  `section_key` VARCHAR(100) NOT NULL,
  `section_name` VARCHAR(255),
  `content` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_page_section` (`page_key`, `section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: media_assets
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media_assets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255),
  `url` VARCHAR(500) NOT NULL,
  `size` INT,
  `mimetype` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Seed Initial SEO Metadata for all Site Pages
-- --------------------------------------------------------
INSERT INTO `pages_seo` (`page_key`, `title`, `description`, `canonical_path`, `og_image`, `keywords`) VALUES
('Home', 'AuGust Aurea Limited | Connecting & Creating Markets in East Africa', 'Reliable sourcing, distribution and FMCG supply for businesses trading across Tanzania and the East African corridor.', '/', 'https://images.unsplash.com/photo-1786207289475-e08d256f0258?auto=format&fit=crop&w=1200&q=80', 'FMCG distribution Tanzania, wholesale trade East Africa, commodity sourcing Dar es Salaam, mining supply'),
('About', 'About Us | AuGust Aurea Limited - Tanzanian Trading Partner', 'Learn about AuGust Aurea story, mission, and values as a disciplined sourcing and distribution partner in East Africa.', '/about', 'https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1200&q=80', 'about AuGust Aurea, Tanzania trading company, supply chain mission Dar es Salaam'),
('Services', 'Trading & Logistics Services | AuGust Aurea Limited', 'FMCG distribution, general trading, mining supplies, logistics coordination, and strategic sourcing across Tanzania.', '/services', 'https://images.unsplash.com/photo-1769752803898-e7e9a843a120?auto=format&fit=crop&w=1200&q=80', 'FMCG distribution, mining site consumables, cross-border trading, logistics coordination Tanzania'),
('Products', 'Wholesale Product Catalogue | AuGust Aurea Limited', 'Explore our wholesale supply of edible oils, grains, cleaning essentials, safety gear, and industrial consumables.', '/products', 'https://images.unsplash.com/photo-1757802868665-60b771aa399b?auto=format&fit=crop&w=1200&q=80', 'wholesale edible oil, bulk rice Tanzania, mining PPE, industrial consumables Dar es Salaam'),
('Gallery', 'Operations & Corridor Gallery | AuGust Aurea Limited', 'Visual documentation of our port operations, warehouse distribution, logistics fleet, and field teams across Tanzania.', '/gallery', 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80', 'Dar es Salaam port operations, warehouse distribution Tanzania, logistics fleet pictures'),
('News', 'Trade News & Market Briefs | AuGust Aurea Limited', 'Market updates, trade corridor insights, supply chain analysis, and news from Tanzania and East Africa.', '/news', 'https://images.unsplash.com/photo-1523848309072-c199db53f137?auto=format&fit=crop&w=1200&q=80', 'Tanzania trade news, East Africa corridor updates, commodity pricing Dar es Salaam'),
('Careers', 'Careers & Culture | AuGust Aurea Limited', 'Join a determined team building a dependable trade and distribution business from Tanzania to the region.', '/careers', 'https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1200&q=80', 'jobs in Dar es Salaam, supply chain careers Tanzania, logistics vacancies East Africa'),
('Contact', 'Contact Us & Wholesale Enquiries | AuGust Aurea Limited', 'Get in touch with our team in Dar es Salaam for wholesale pricing, supplier partnerships, or supply quotes within 24 hours.', '/contact', 'https://images.unsplash.com/photo-1769752803898-e7e9a843a120?auto=format&fit=crop&w=1200&q=80', 'wholesale inquiry Tanzania, contact AuGust Aurea, request quote Dar es Salaam')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

COMMIT;
