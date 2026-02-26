-- 税务规则配置表
CREATE TABLE IF NOT EXISTS `tax_rule_config` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tax_type` TINYINT NOT NULL COMMENT '1-劳务报酬 2-经营所得 3-增值税 4-企业所得税',
  `rule_name` VARCHAR(100) NOT NULL,
  `effective_date` DATE NOT NULL,
  `tax_rate` DECIMAL(5,4) COMMENT '综合税率',
  `quick_deduction` DECIMAL(10,2) COMMENT '速算扣除数',
  `threshold` DECIMAL(10,2) COMMENT '起征点',
  `status` TINYINT DEFAULT 1 COMMENT '1-生效 0-失效',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tax_type` (`tax_type`, `effective_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='税务规则配置表';

-- 插入税率表
INSERT INTO `tax_rule_config` (`tax_type`, `rule_name`, `effective_date`, `tax_rate`, `quick_deduction`, `threshold`, `status`) VALUES 
(1, '劳务报酬20%', '2024-01-01', 0.20, 0, 800, 1),
(2, '经营所得5%', '2024-01-01', 0.05, 0, 30000, 1),
(3, '增值税3%', '2024-01-01', 0.03, 0, 0, 1),
(4, '企业所得税25%', '2024-01-01', 0.25, 0, 0, 1);
