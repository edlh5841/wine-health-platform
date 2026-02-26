# 保健酒平台 - Render 部署指南

## 快速开始

### 1. 创建 GitHub 仓库

```bash
# 在 GitHub 创建仓库后，本地执行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/wine-health-platform.git
git push -u origin main
```

### 2. Render 部署

1. 访问 https://render.com 注册/登录
2. 点击 **New +** → **Web Service**
3. 选择你的 GitHub 仓库
4. 配置如下：

| 配置项 | 值 |
|--------|-----|
| Name | wine-health-platform |
| Environment | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | Free |

5. 点击 **Create Web Service**

### 3. 访问应用

部署完成后，Render 会提供一个类似 `https://wine-health-platform.onrender.com` 的 URL。

### 4. 测试接口

```bash
curl https://wine-health-platform.onrender.com/api/health
```

## 项目结构

```
wine-health-platform/
├── web-server.js      # 主服务入口
├── package.json       # Node 配置
├── miniprogram/       # 微信小程序
├── admin/             # Vue 管理后台
├── database/          # SQL 脚本
└── docs/              # 文档
```

## 注意事项

1. **免费版限制**：
   - 15分钟无访问会自动休眠
   - 首次访问需要等待启动（约30秒）

2. **自定义域名**：
   - 在 Render 控制台 Settings → Custom Domains 添加

3. **环境变量**：
   - 在 Render 控制台 Environment 添加
   - 如数据库连接、API密钥等

## 接口列表

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/health | GET | 健康检查 |
| /api/technicians | GET | 技师列表 |
| /api/deposits | GET | 托管库存 |
| /api/order/create | POST | 创建订单 |
| /api/order/pay | POST | 支付 |
| /api/write-off/execute | POST | 核销 |

---

*部署时间: 2026-02-25*
