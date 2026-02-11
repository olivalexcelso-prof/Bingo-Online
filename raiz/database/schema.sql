-- ============================================
-- BINGO MASTER LITE - DATABASE SCHEMA
-- ============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS bingo_master_lite;
USE bingo_master_lite;

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cpf (cpf),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- 2. TABELA DE CARTELAS
-- ============================================
CREATE TABLE IF NOT EXISTS cards (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  game_id VARCHAR(36) NOT NULL,
  series_number INT NOT NULL,
  card_number INT NOT NULL,
  numbers JSON NOT NULL, -- Array 3x5 de números
  marked_numbers JSON DEFAULT '[]', -- Array de números marcados
  status ENUM('active', 'won_line', 'won_quadra', 'won_bingo', 'expired') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_game_id (game_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_card (user_id, game_id, series_number, card_number)
);

-- ============================================
-- 3. TABELA DE JOGOS/SORTEIOS
-- ============================================
CREATE TABLE IF NOT EXISTS games (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('scheduled', 'running', 'paused', 'finished') DEFAULT 'scheduled',
  scheduled_start DATETIME NOT NULL,
  actual_start DATETIME,
  actual_end DATETIME,
  drawn_numbers JSON DEFAULT '[]', -- Array de números sorteados
  current_number INT,
  narration_start TEXT,
  narration_during TEXT,
  narration_end TEXT,
  total_raised DECIMAL(10, 2) DEFAULT 0.00,
  prize_line DECIMAL(10, 2) DEFAULT 0.00,
  prize_quadra DECIMAL(10, 2) DEFAULT 0.00,
  prize_bingo DECIMAL(10, 2) DEFAULT 0.00,
  prize_accumulated DECIMAL(10, 2) DEFAULT 0.00,
  accumulated_from_previous DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_scheduled_start (scheduled_start),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- 4. TABELA DE PRÊMIOS/GANHADORES
-- ============================================
CREATE TABLE IF NOT EXISTS prizes (
  id VARCHAR(36) PRIMARY KEY,
  game_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  card_id VARCHAR(36) NOT NULL,
  prize_type ENUM('line', 'quadra', 'bingo') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balls_drawn INT NOT NULL,
  narration TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  INDEX idx_game_id (game_id),
  INDEX idx_user_id (user_id),
  INDEX idx_prize_type (prize_type),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- 5. TABELA DE TRANSAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('deposit', 'withdrawal', 'prize', 'purchase') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
  description TEXT,
  reference_id VARCHAR(255), -- ID do Mercado Pago, PIX, etc
  pix_key VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- 6. TABELA DE COMPRAS DE CARTELAS
-- ============================================
CREATE TABLE IF NOT EXISTS card_purchases (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  game_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_game_id (game_id),
  INDEX idx_status (status)
);

-- ============================================
-- 7. TABELA DE SOLICITAÇÕES DE SAQUE
-- ============================================
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  pix_key VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'processed') DEFAULT 'pending',
  rejection_reason TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- 8. TABELA DE MENSAGENS DE SUPORTE
-- ============================================
CREATE TABLE IF NOT EXISTS support_messages (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  message TEXT NOT NULL,
  word_count INT,
  response TEXT,
  status ENUM('open', 'responded', 'closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- 9. TABELA DE PROPAGANDAS
-- ============================================
CREATE TABLE IF NOT EXISTS advertisements (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  duration_seconds INT DEFAULT 30,
  image_url VARCHAR(500),
  link_url VARCHAR(500),
  status ENUM('active', 'inactive', 'scheduled') DEFAULT 'active',
  scheduled_start DATETIME,
  scheduled_end DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_scheduled_start (scheduled_start)
);

-- ============================================
-- 10. TABELA DE CONFIGURAÇÕES DO JOGO
-- ============================================
CREATE TABLE IF NOT EXISTS game_settings (
  id VARCHAR(36) PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key)
);

-- ============================================
-- 11. TABELA DE PROGRAMAÇÃO DE PARTIDAS
-- ============================================
CREATE TABLE IF NOT EXISTS game_schedules (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  frequency ENUM('once', 'daily', 'weekly', 'monthly') DEFAULT 'once',
  start_time TIME,
  end_time TIME,
  days_of_week JSON, -- ["monday", "tuesday", ...] para weekly
  dates JSON, -- [1, 15] para monthly
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
);

-- ============================================
-- 12. TABELA DE LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(255) NOT NULL,
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- Inserir configurações padrão
-- ============================================
INSERT INTO game_settings (id, setting_key, setting_value, description, data_type) VALUES
('setting-1', 'prize_percentage_line', '10', 'Porcentagem de premiação para linha', 'number'),
('setting-2', 'prize_percentage_quadra', '15', 'Porcentagem de premiação para quadra', 'number'),
('setting-3', 'prize_percentage_bingo', '50', 'Porcentagem de premiação para bingo', 'number'),
('setting-4', 'prize_percentage_accumulated', '25', 'Porcentagem de premiação acumulada', 'number'),
('setting-5', 'card_price', '10.00', 'Preço unitário da cartela', 'number'),
('setting-6', 'min_withdrawal', '10.00', 'Valor mínimo para saque', 'number'),
('setting-7', 'max_withdrawal', '5000.00', 'Valor máximo para saque', 'number');

-- ============================================
-- Criar índices adicionais para performance
-- ============================================
CREATE INDEX idx_users_balance ON users(balance);
CREATE INDEX idx_games_status_start ON games(status, scheduled_start);
CREATE INDEX idx_cards_game_user ON cards(game_id, user_id);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX idx_prizes_game_type ON prizes(game_id, prize_type);
