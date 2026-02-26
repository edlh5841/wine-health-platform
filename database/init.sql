-- =============================================
-- 保健酒托管服务平台 - MVP数据库设计
-- 精简版：保留核心业务流程所需的最小表结构
-- =============================================

CREATE DATABASE IF NOT EXISTS `wine_platform_mvp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wine_platform_mvp`;

-- 1. 用户表（客户/技师/托管方/管理员）
CREATE TABLE `sys_user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `openid` VARCHAR(100) NOT NULL COMMENT '微信openid',
  `nickname` VARCHAR(50) DEFAULT '',
  `avatar` VARCHAR(255) DEFAULT '',
  `phone` VARCHAR(20) DEFAULT '',
  `gender` TINYINT DEFAULT 0,
  `user_type` TINYINT DEFAULT 0 COMMENT '0-客户 1-技师 2-托管方 9-管理员',
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB COMMENT='用户表';

-- 2. 技师表
CREATE TABLE `technician` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `real_name` VARCHAR(50) NOT NULL,
  `id_card_no` VARCHAR(100) COMMENT '身份证号（加密）',
  `cert_no` VARCHAR(50) COMMENT '资格证号',
  `avatar` VARCHAR(500),
  `work_years` INT DEFAULT 0,
  `service_type` JSON COMMENT '服务项目',
  `current_lat` DECIMAL(10,8),
  `current_lon` DECIMAL(11,8),
  `account_status` TINYINT DEFAULT 0 COMMENT '0-待审核 3-已通过',
  `online_status` TINYINT DEFAULT 0 COMMENT '0-离线 1-在线',
  `balance` DECIMAL(10,2) DEFAULT 0.00,
  `rating_score` DECIMAL(3,2) DEFAULT 5.00,
  `order_count` INT DEFAULT 0,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_account_status` (`account_status`),
  KEY `idx_online_status` (`online_status`)
) ENGINE=InnoDB COMMENT='技师表';

-- 3. 保健酒商品表
CREATE TABLE `wine_product` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `sku` VARCHAR(50) NOT NULL,
  `cover_image` VARCHAR(255),
  `spec` VARCHAR(50) DEFAULT '500ml/瓶',
  `unit_ml` INT DEFAULT 500,
  `price` DECIMAL(10,2) NOT NULL,
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sku` (`sku`)
) ENGINE=InnoDB COMMENT='商品表';

-- 4. 托管批次表（核心）
CREATE TABLE `wine_deposit_batch` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `batch_no` VARCHAR(64) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '客户ID',
  `product_id` BIGINT UNSIGNED NOT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 0 COMMENT '总容量ml',
  `available_quantity` INT NOT NULL DEFAULT 0 COMMENT '可用容量ml',
  `frozen_quantity` INT NOT NULL DEFAULT 0 COMMENT '冻结容量ml',
  `used_quantity` INT NOT NULL DEFAULT 0 COMMENT '已用容量ml',
  `deposit_status` TINYINT DEFAULT 2 COMMENT '2-已激活 3-已用完 4-已过期',
  `payment_amount` DECIMAL(10,2),
  `expired_date` DATE NOT NULL,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_batch_no` (`batch_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status_expired` (`deposit_status`, `expired_date`)
) ENGINE=InnoDB COMMENT='托管批次表';

-- 5. 库存冻结记录表
CREATE TABLE `wine_frozen_record` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `frozen_no` VARCHAR(64) NOT NULL,
  `batch_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `technician_id` BIGINT UNSIGNED NOT NULL,
  `frozen_quantity` INT NOT NULL,
  `frozen_time` DATETIME NOT NULL,
  `expire_time` DATETIME NOT NULL,
  `status` TINYINT DEFAULT 1 COMMENT '1-冻结中 2-已核销 3-已解冻',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_frozen_no` (`frozen_no`),
  KEY `idx_batch_user` (`batch_id`, `user_id`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB COMMENT='冻结记录表';

-- 6. 核销流水表
CREATE TABLE `wine_write_off_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `write_off_no` VARCHAR(64) NOT NULL,
  `batch_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `technician_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `write_off_amount` INT NOT NULL,
  `write_off_time` DATETIME NOT NULL,
  `qr_code_token` VARCHAR(255),
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_write_off_no` (`write_off_no`),
  KEY `idx_batch_id` (`batch_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB COMMENT='核销流水表';

-- 7. 服务订单表
CREATE TABLE `service_order` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(64) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `technician_id` BIGINT UNSIGNED,
  `batch_id` BIGINT UNSIGNED,
  `frozen_no` VARCHAR(64),
  `service_amount` INT NOT NULL COMMENT '服务用量ml',
  `total_amount` DECIMAL(10,2) NOT NULL,
  `pay_amount` DECIMAL(10,2) DEFAULT 0.00,
  `pay_time` DATETIME,
  `transaction_id` VARCHAR(64),
  `order_status` TINYINT DEFAULT 0 COMMENT '0-待支付 1-待服务 2-服务中 3-已完成 4-已取消',
  `pay_status` TINYINT DEFAULT 0,
  `appointment_time` DATETIME,
  `address` VARCHAR(500),
  `contact_name` VARCHAR(50),
  `contact_phone` VARCHAR(20),
  `write_off_no` VARCHAR(64),
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_technician_id` (`technician_id`),
  KEY `idx_status` (`order_status`)
) ENGINE=InnoDB COMMENT='订单表';

-- 8. 分账记录表（简化版）
CREATE TABLE `order_split` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `write_off_no` VARCHAR(64) NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `platform_amount` DECIMAL(10,2) COMMENT '平台30%',
  `technician_amount` DECIMAL(10,2) COMMENT '技师50%',
  `deposit_amount` DECIMAL(10,2) COMMENT '托管方20%',
  `split_status` TINYINT DEFAULT 0 COMMENT '0-待分账 1-已分账',
  `split_time` DATETIME,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_id` (`order_id`),
  UNIQUE KEY `uk_write_off_no` (`write_off_no`)
) ENGINE=InnoDB COMMENT='分账表';

-- 插入测试数据
INSERT INTO `sys_user` (`id`, `openid`, `nickname`, `phone`, `user_type`, `status`) VALUES
(1, 'oAdmin001', '管理员', '13800000000', 9, 1),
(2, 'oTech001', '张技师', '13912345678', 1, 1),
(3, 'oUser001', '李客户', '13812345678', 0, 1),
(4, 'oDepositor001', '王托管方', '13712345678', 2, 1);

INSERT INTO `technician` (`id`, `user_id`, `real_name`, `cert_no`, `work_years`, `account_status`, `online_status`, `current_lat`, `current_lon`) VALUES
(1, 2, '张伟', 'TECH2024001', 5, 3, 1, 39.9042, 116.4074);

INSERT INTO `wine_product` (`id`, `name`, `sku`, `price`, `status`) VALUES
(1, '茅台保健酒', 'WINE-001', 999.00, 1),
(2, '五粮液保健酒', 'WINE-002', 888.00, 1);

INSERT INTO `wine_deposit_batch` (`id`, `batch_no`, `user_id`, `product_id`, `product_name`, `quantity`, `available_quantity`, `deposit_status`, `payment_amount`, `expired_date`) VALUES
(1, 'DP202401150001', 3, 1, '茅台保健酒', 1000, 1000, 2, 1998.00, '2024-02-15');
