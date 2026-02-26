# 保健酒托管服务平台 - MVP版本

## 项目简介

保健酒托管服务平台的**最小可用版本(MVP)**，包含核心业务流程：

1. **保健酒托管** - 客户购买后生成虚拟库存
2. **技师展示** - 在线技师列表
3. **下单支付** - 预约服务并支付
4. **库存冻结** - 支付后冻结对应库存
5. **扫码核销** - 技师服务完成后核销
6. **自动分账** - 核销后按比例分账（平台30% + 技师50% + 托管方20%）

## 快速启动

```bash
# 一键启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
```

## 访问地址

- API: http://localhost:8080
- MySQL: localhost:3306 (root/root123)
- Redis: localhost:6379

## 核心API

### 1. 获取技师列表
```
GET /api/technicians
```

### 2. 获取我的托管库存
```
GET /api/deposits?userId=3
```

### 3. 创建订单
```
POST /api/order/create
{
  "userId": 3,
  "technicianId": 1,
  "batchId": 1,
  "serviceAmount": 500
}
```

### 4. 支付回调（模拟）
```
POST /api/order/pay-callback
{
  "orderId": 1
}
```

### 5. 执行核销
```
POST /api/write-off/execute
{
  "orderId": 1,
  "technicianId": 1
}
```

## 测试账号

| 角色 | 用户ID | 说明 |
|------|--------|------|
| 客户 | 3 | 有1000ml托管库存 |
| 技师 | 2 | 在线状态，可接单 |
| 托管方 | 4 | - |
| 管理员 | 1 | - |

## 业务流程验证

```bash
# 1. 查看技师列表
curl http://localhost:8080/api/technicians

# 2. 查看客户托管库存
curl "http://localhost:8080/api/deposits?userId=3"

# 3. 创建订单
curl -X POST http://localhost:8080/api/order/create \
  -H "Content-Type: application/json" \
  -d '{"userId":3,"technicianId":1,"batchId":1,"serviceAmount":500}'

# 4. 支付（模拟）
curl -X POST http://localhost:8080/api/order/pay-callback \
  -H "Content-Type: application/json" \
  -d '{"orderId":1}'

# 5. 核销
curl -X POST http://localhost:8080/api/write-off/execute \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"technicianId":1}'
```

## 数据库表

- `sys_user` - 用户表
- `technician` - 技师表
- `wine_product` - 商品表
- `wine_deposit_batch` - 托管批次表
- `wine_frozen_record` - 冻结记录表
- `wine_write_off_log` - 核销流水表
- `service_order` - 订单表
- `order_split` - 分账表

## 技术栈

- Java 17
- Spring Boot 3.x
- MyBatis
- MySQL 8.0
- Redis 7
- Docker

## 后续扩展

MVP验证通过后，可逐步添加：
- 微信支付集成
- 微信小程序前端
- 技师LBS定位
- 二维码核销
- 提现功能
- 管理后台
