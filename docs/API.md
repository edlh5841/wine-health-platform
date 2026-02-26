# 保健酒平台 API 接口文档

## 基础信息

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **编码**: UTF-8

## 接口列表

### 1. 健康检查

**请求**
```http
GET /health
```

**响应**
```json
{
  "code": 200,
  "data": {
    "status": "UP",
    "time": "2026-02-25T10:21:08.739Z"
  }
}
```

---

### 2. 获取技师列表

**请求**
```http
GET /technicians
```

**响应**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "realName": "王师傅",
      "certNo": "TECH2024001",
      "workYears": 5,
      "ratingScore": 4.9,
      "orderCount": 156,
      "balance": 8960,
      "onlineStatus": 1
    }
  ]
}
```

**字段说明**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 技师ID |
| realName | String | 真实姓名 |
| certNo | String | 资格证号 |
| workYears | Integer | 从业年限 |
| ratingScore | Decimal | 评分(0-5) |
| orderCount | Integer | 接单数量 |
| balance | Decimal | 账户余额 |
| onlineStatus | Integer | 0-离线 1-在线 |

---

### 3. 获取托管库存

**请求**
```http
GET /deposits?userId={userId}
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |

**响应**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "batchNo": "DP202401150001",
      "productName": "茅台保健酒 53°",
      "quantity": 1000,
      "availableQuantity": 1000,
      "depositStatus": 2
    }
  ]
}
```

---

### 4. 创建订单

**请求**
```http
POST /order/create
Content-Type: application/json

{
  "userId": 3,
  "technicianId": 1,
  "batchId": 1,
  "quantity": 200,
  "amount": 299.00
}
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Long | 是 | 用户ID |
| technicianId | Long | 是 | 技师ID |
| batchId | Long | 是 | 托管批次ID |
| quantity | Integer | 是 | 预估用量(ml) |
| amount | Decimal | 是 | 订单金额 |

**响应**
```json
{
  "code": 200,
  "data": {
    "orderId": 1,
    "orderNo": "W2026022500002"
  }
}
```

---

### 5. 支付成功

**请求**
```http
POST /order/pay
Content-Type: application/json

{
  "orderId": 1
}
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderId | Long | 是 | 订单ID |

**响应**
```json
{
  "code": 200,
  "message": "支付成功"
}
```

---

### 6. 核销订单

**请求**
```http
POST /write-off/execute
Content-Type: application/json

{
  "orderId": 1,
  "technicianId": 1
}
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| orderId | Long | 是 | 订单ID |
| technicianId | Long | 是 | 技师ID |

**响应**
```json
{
  "code": 200,
  "data": {
    "writeOffNo": "WO1772014868878",
    "amount": 200
  }
}
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 500 | 服务器错误 |
| 404 | 接口不存在 |

---

## 测试账号

- **管理后台**: admin / admin123
- **测试用户ID**: 3
- **测试技师ID**: 1 (王师傅)

---

## 业务流程

```
用户选技师 → 下单支付 → 库存冻结 → 技师接单 → 扫码核销 → 自动分账 → 税务申报
```

### 分账比例

| 角色 | 比例 | 说明 |
|------|------|------|
| 平台 | 30% | 技术服务费 |
| 技师 | 50% | 劳务报酬 |
| 托管方 | 20% | 酒品使用费 |

---

*文档生成时间: 2026-02-25*
