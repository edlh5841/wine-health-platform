# 保健酒平台完整项目技术文档

## 一、项目总览

### 1.1 项目简介

保健酒平台是一个集酒品托管、技师服务、在线支付、智能分账、税务申报于一体的B2C2B数字化服务平台。

**核心业务流程**：用户选技师 → 下单支付 → 库存冻结 → 技师接单 → 扫码核销 → 自动分账 → 税务申报

### 1.2 技术栈

| 层级 | 技术选型 | 版本 |
|------|----------|------|
| 后端框架 | Spring Boot | 3.2.3 |
| 数据库 | MySQL | 8.0 |
| 缓存 | Redis | 7.0 |
| ORM | MyBatis Plus | 3.5.5 |
| 支付 | 微信支付APIv3 | - |
| 小程序 | 原生微信小程序 | API 3.0 |
| 容器化 | Docker + Docker Compose | - |

## 二、系统架构

### 2.1 微服务模块划分

```
wine-health-platform
├── wine-common（公共模块）
├── wine-domain（领域实体）
├── wine-infrastructure（基础设施）
├── wine-service（业务服务层）
├── wine-web（Web层）
└── wine-job（定时任务）
```

### 2.2 核心业务流程

```
用户下单 → 微信支付 → 支付回调 → 库存冻结 → 技师接单 → 扫码核销 → 自动分账 → 税务计算
```

## 三、数据库设计

### 3.1 核心表

- `order_master` - 订单主表
- `wine_deposit_batch` - 托管批次表
- `deposit_freeze_log` - 库存冻结日志
- `split_master` - 分账主表
- `technician` - 技师表

### 3.2 索引规范

- 高频查询字段必须建立索引：user_id, technician_id, order_no
- 状态字段必须建立索引：status, split_status
- 时间范围查询必须建立索引：create_time

## 四、API接口

### 4.1 创建订单

```http
POST /api/order/create
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "technicianId": 2001,
  "depositBatchId": 3001,
  "predictQuantity": 200,
  "orderAmount": 300.00
}
```

### 4.2 扫码核销

```http
POST /api/write-off/execute
Authorization: Bearer {token}

Request:
{
  "orderId": 10001,
  "technicianId": 2001
}
```

## 五、部署运维

### 5.1 Docker部署

```bash
# 启动基础设施
docker-compose up -d mysql redis

# 构建并启动应用
mvn clean install -DskipTests
docker build -t wine-platform:1.0.0 ./wine-web
docker run -d -p 8080:8080 wine-platform:1.0.0
```

### 5.2 监控告警

- Prometheus: 指标采集
- Grafana: 可视化大盘
- 告警规则：订单超时率、Redis锁失败率

## 六、测试方案

### 6.1 单元测试

```bash
mvn test
```

### 6.2 性能压测

- QPS目标: > 500
- 响应时间: < 200ms (P99)
- 成功率: 99.99%

## 七、安全规范

- 接口签名验证（X-Sign）
- 敏感数据脱敏（身份证、手机号）
- 每日数据库备份

## 八、启动Checklist

### 开发环境

- [ ] 数据库初始化
- [ ] Redis启动
- [ ] 应用启动

### 生产环境

- [ ] MySQL主从搭建
- [ ] Redis集群部署
- [ ] SSL证书配置
- [ ] 微信支付密钥配置
- [ ] 监控系统部署
- [ ] 备份脚本配置

## 项目结构

```
wine-health-platform/
├── pom.xml                          # 根POM
├── docker-compose.yml               # 部署配置
├── docs/                            # 文档
│   └── README.md                    # 本文件
├── database/
│   ├── init.sql                     # 核心表
│   └── tax.sql                      # 税务表
├── miniprogram/                     # 微信小程序
├── wine-common/                     # 公共模块
├── wine-domain/                     # 领域实体
├── wine-infrastructure/             # 基础设施
├── wine-service/                    # 业务服务
├── wine-web/                        # Web层
└── wine-job/                        # 定时任务
```

## 快速开始

```bash
# 1. 克隆项目
git clone <repository>
cd wine-health-platform

# 2. 启动基础设施
docker-compose up -d

# 3. 构建项目
mvn clean install -DskipTests

# 4. 启动应用
cd wine-web
mvn spring-boot:run

# 5. 访问API
curl http://localhost:8080/api/health
```

## 联系方式

- 项目维护: wine-platform-team
- 技术支持: support@wine-health.com
