const http = require('http');
const url = require('url');

// 模拟数据
const technicians = [
  { id: 1, realName: '王师傅', certNo: 'TECH2024001', workYears: 5, ratingScore: 4.9, orderCount: 156, balance: 8960, onlineStatus: 1, avatar: '' },
  { id: 2, realName: '李师傅', certNo: 'TECH2024002', workYears: 3, ratingScore: 4.8, orderCount: 89, balance: 7520, onlineStatus: 1, avatar: '' },
  { id: 3, realName: '张师傅', certNo: 'TECH2024003', workYears: 2, ratingScore: 4.5, orderCount: 45, balance: 3200, onlineStatus: 0, avatar: '' }
];

const deposits = [
  { id: 1, batchNo: 'DP202401150001', userId: 3, productId: 1, productName: '茅台保健酒 53°', quantity: 1000, availableQuantity: 1000, depositStatus: 2 },
  { id: 2, batchNo: 'DP202402200001', userId: 3, productId: 2, productName: '五粮液保健酒 52°', quantity: 500, availableQuantity: 380, depositStatus: 2 }
];

const orders = [];
let orderIdCounter = 1;

// 管理后台 HTML - 简化版
const adminHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>管理后台</title>
<style>
body{font-family:sans-serif;background:#f5f5f5;padding:40px}
.box{max-width:400px;margin:0 auto;background:#fff;padding:40px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
h1{color:#C53D13;text-align:center}
input{width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px;box-sizing:border-box}
button{width:100%;padding:12px;background:#C53D13;color:#fff;border:none;border-radius:4px;cursor:pointer}
.success{text-align:center;padding:40px}
</style>
</head>
<body>
<div id="loginBox" class="box">
<h1>管理后台</h1>
<p>账号: admin<br>密码: admin123</p>
<input type="text" id="u" placeholder="用户名">
<input type="password" id="p" placeholder="密码">
<button onclick="login()">登录</button>
</div>
<div id="successBox" class="success" style="display:none">
<h1 style="color:#C53D13">欢迎进入管理后台</h1>
<p><a href="/">返回首页</a></p>
</div>
<script>
function login(){
  var u = document.getElementById('u').value;
  var p = document.getElementById('p').value;
  if(u === 'admin' && p === 'admin123'){
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('successBox').style.display = 'block';
  }else{
    alert('账号或密码错误');
  }
}
</script>
</body>
</html>`;

// HTML 测试页面
const testPageHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>保健酒平台 - API测试</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; 
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { color: #C53D13; text-align: center; margin-bottom: 30px; }
    .card { 
      background: #fff; 
      border-radius: 12px; 
      padding: 20px; 
      margin-bottom: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    .card h2 { color: #333; margin-bottom: 15px; font-size: 18px; }
    .btn { 
      background: linear-gradient(135deg, #C53D13 0%, #E55A2B 100%);
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 24px;
      cursor: pointer;
      font-size: 14px;
      margin: 5px;
    }
    .btn:hover { opacity: 0.9; }
    .result { 
      background: #f8f8f8; 
      padding: 15px; 
      border-radius: 8px; 
      margin-top: 15px;
      font-family: monospace;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .success { color: #52C41A; }
    .error { color: #FF4D4F; }
    .tech-card {
      display: flex;
      align-items: center;
      padding: 15px;
      background: #f8f5f2;
      border-radius: 12px;
      margin-bottom: 10px;
    }
    .tech-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #C53D13;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24px;
      margin-right: 15px;
    }
    .tech-info { flex: 1; }
    .tech-name { font-size: 18px; font-weight: 600; color: #333; }
    .tech-meta { font-size: 14px; color: #666; margin-top: 5px; }
    .price { color: #C53D13; font-weight: 600; font-size: 16px; }
    .status { 
      padding: 4px 12px; 
      border-radius: 12px; 
      font-size: 12px;
      background: #e6f7ff;
      color: #1890ff;
    }
    .status.online { background: #f6ffed; color: #52c41a; }
    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      margin: 5px 0;
      font-size: 14px;
    }
    .form-row {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    .form-row input, .form-row select {
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🍷 保健酒平台 API 测试</h1>
    
    <div class="card">
      <h2>1. 服务状态检查</h2>
      <button class="btn" onclick="testHealth()">测试健康检查</button>
      <div id="healthResult" class="result">点击按钮开始测试...</div>
    </div>

    <div class="card">
      <h2>2. 技师列表</h2>
      <button class="btn" onclick="loadTechnicians()">加载技师列表</button>
      <div id="techList"></div>
    </div>

    <div class="card">
      <h2>3. 托管库存</h2>
      <button class="btn" onclick="loadDeposits()">加载我的库存</button>
      <div id="depositList"></div>
    </div>

    <div class="card">
      <h2>4. 创建订单</h2>
      <div class="form-row">
        <select id="techSelect">
          <option value="">选择技师</option>
        </select>
        <select id="depositSelect">
          <option value="">选择酒品</option>
        </select>
      </div>
      <input type="number" id="quantity" placeholder="预估用量 (ml)" value="200">
      <input type="number" id="amount" placeholder="订单金额" value="299">
      <button class="btn" onclick="createOrder()">创建订单</button>
      <div id="orderResult" class="result"></div>
    </div>

    <div class="card">
      <h2>5. 支付 & 核销</h2>
      <input type="text" id="orderId" placeholder="订单ID">
      <button class="btn" onclick="payOrder()">模拟支付</button>
      <button class="btn" onclick="writeOff()">模拟核销</button>
      <div id="payResult" class="result"></div>
    </div>

    <div class="card">
      <h2>6. 管理后台</h2>
      <p>账号: admin / 密码: admin123</p>
      <a href="/admin.html" target="_blank"><button class="btn">打开管理后台</button></a>
    </div>
  </div>

  <script>
    // 自动获取当前域名（支持 Render 等云部署）
    const API_BASE = window.location.origin;
    
    async function testHealth() {
      const result = document.getElementById('healthResult');
      result.textContent = '测试中...';
      try {
        const res = await fetch(API_BASE + '/api/health');
        const data = await res.json();
        result.innerHTML = '<span class="success">✓ 服务正常</span>\\n' + JSON.stringify(data, null, 2);
      } catch (err) {
        result.innerHTML = '<span class="error">✗ 错误: ' + err.message + '</span>';
      }
    }

    async function loadTechnicians() {
      const container = document.getElementById('techList');
      container.innerHTML = '加载中...';
      try {
        const res = await fetch(API_BASE + '/api/technicians');
        const data = await res.json();
        
        // 填充选择框
        const select = document.getElementById('techSelect');
        select.innerHTML = '<option value="">选择技师</option>';
        
        container.innerHTML = data.data.map(t => {
          select.innerHTML += '<option value="' + t.id + '">' + t.realName + '</option>';
          return '<div class="tech-card"><div class="tech-avatar">' + t.realName[0] + '</div><div class="tech-info"><div class="tech-name">' + t.realName + ' <span class="status ' + (t.onlineStatus ? 'online' : '') + '">' + (t.onlineStatus ? '在线' : '离线') + '</span></div><div class="tech-meta">⭐ ' + t.ratingScore + '分 | ' + t.workYears + '年经验 | 已服务' + t.orderCount + '人</div></div><div class="price">¥' + (t.ratingScore * 60).toFixed(0) + '/时</div></div>';
        }).join('');
      } catch (err) {
        container.innerHTML = '<span class="error">加载失败: ' + err.message + '</span>';
      }
    }

    async function loadDeposits() {
      const container = document.getElementById('depositList');
      container.innerHTML = '加载中...';
      try {
        const res = await fetch(API_BASE + '/api/deposits?userId=3');
        const data = await res.json();
        
        // 填充选择框
        const select = document.getElementById('depositSelect');
        select.innerHTML = '<option value="">选择酒品</option>';
        
        container.innerHTML = data.data.map(d => {
          select.innerHTML += '<option value="' + d.id + '">' + d.productName + ' (库存' + d.availableQuantity + 'ml)</option>';
          return '<div class="tech-card"><div class="tech-info"><div class="tech-name">' + d.productName + '</div><div class="tech-meta">批次: ' + d.batchNo + ' | 库存: ' + d.availableQuantity + 'ml</div></div></div>';
        }).join('');
      } catch (err) {
        container.innerHTML = '<span class="error">加载失败: ' + err.message + '</span>';
      }
    }

    async function createOrder() {
      const result = document.getElementById('orderResult');
      const techId = document.getElementById('techSelect').value;
      const depositId = document.getElementById('depositSelect').value;
      const quantity = document.getElementById('quantity').value;
      const amount = document.getElementById('amount').value;
      
      if (!techId || !depositId) {
        result.innerHTML = '<span class="error">请选择技师和酒品</span>';
        return;
      }
      
      result.textContent = '创建中...';
      try {
        const res = await fetch(API_BASE + '/api/order/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 3, technicianId: parseInt(techId), batchId: parseInt(depositId), quantity: parseInt(quantity), amount: parseFloat(amount) })
        });
        const data = await res.json();
        document.getElementById('orderId').value = data.data.orderId;
        result.innerHTML = '<span class="success">✓ 订单创建成功</span>\\n订单号: ' + data.data.orderNo + '\\n订单ID: ' + data.data.orderId;
      } catch (err) {
        result.innerHTML = '<span class="error">✗ 错误: ' + err.message + '</span>';
      }
    }

    async function payOrder() {
      const result = document.getElementById('payResult');
      const orderId = document.getElementById('orderId').value;
      if (!orderId) {
        result.innerHTML = '<span class="error">请输入订单ID</span>';
        return;
      }
      
      try {
        const res = await fetch(API_BASE + '/api/order/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: parseInt(orderId) })
        });
        const data = await res.json();
        result.innerHTML = '<span class="success">✓ 支付成功</span>\\n' + JSON.stringify(data, null, 2);
      } catch (err) {
        result.innerHTML = '<span class="error">✗ 错误: ' + err.message + '</span>';
      }
    }

    async function writeOff() {
      const result = document.getElementById('payResult');
      const orderId = document.getElementById('orderId').value;
      if (!orderId) {
        result.innerHTML = '<span class="error">请输入订单ID</span>';
        return;
      }
      
      try {
        const res = await fetch(API_BASE + '/api/write-off/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: parseInt(orderId), technicianId: 1 })
        });
        const data = await res.json();
        result.innerHTML = '<span class="success">✓ 核销成功</span>\\n' + JSON.stringify(data, null, 2);
      } catch (err) {
        result.innerHTML = '<span class="error">✗ 错误: ' + err.message + '</span>';
      }
    }

    // 页面加载时自动测试健康检查
    window.onload = testHealth;
  </script>
</body>
</html>
`;

// 合并API服务和Web测试页面
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Web测试页面
  if (path === '/' || path === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(testPageHtml);
    return;
  }

  // 管理后台页面 - 直接返回登录页
  if (path === '/admin' || path === '/admin.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(adminHtml);
    return;
  }

  // API路由
  if (path === '/api/health' && method === 'GET') {
    jsonResponse(res, { code: 200, data: { status: 'UP', time: new Date().toISOString() } });
    return;
  }

  if (path === '/api/technicians' && method === 'GET') {
    jsonResponse(res, { code: 200, data: technicians });
    return;
  }

  if (path === '/api/deposits' && method === 'GET') {
    const userId = parsedUrl.query.userId;
    const userDeposits = deposits.filter(d => d.userId == userId && d.depositStatus === 2);
    jsonResponse(res, { code: 200, data: userDeposits });
    return;
  }

  if (path === '/api/order/create' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const order = {
        id: orderIdCounter++,
        orderNo: 'W' + new Date().toISOString().slice(0,10).replace(/-/g,'') + String(orderIdCounter).padStart(5,'0'),
        userId: data.userId,
        technicianId: data.technicianId,
        batchId: data.batchId,
        serviceAmount: data.quantity,
        totalAmount: data.amount,
        orderStatus: 0,
        payStatus: 0,
        createTime: new Date().toISOString()
      };
      orders.push(order);
      jsonResponse(res, { code: 200, data: { orderId: order.id, orderNo: order.orderNo } });
    });
    return;
  }

  if (path === '/api/order/pay' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const order = orders.find(o => o.id == data.orderId);
      if (order) {
        order.payStatus = 1;
        order.orderStatus = 1;
        order.payTime = new Date().toISOString();
        order.transactionId = 'WX' + Date.now();
      }
      jsonResponse(res, { code: 200, message: '支付成功' });
    });
    return;
  }

  if (path === '/api/write-off/execute' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      const order = orders.find(o => o.id == data.orderId);
      if (order) {
        order.orderStatus = 3;
        order.writeOffNo = 'WO' + Date.now();
      }
      jsonResponse(res, { 
        code: 200, 
        data: { 
          writeOffNo: order?.writeOffNo || 'WO202403150001',
          amount: order?.serviceAmount || 200
        } 
      });
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ code: 404, message: 'Not Found' }));
});

function jsonResponse(res, data, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🍷 保健酒平台 Web测试环境已启动！');
  console.log('');
  console.log('📱 Web测试页面: http://localhost:' + PORT);
  console.log('🔧 API接口: http://localhost:' + PORT + '/api');
  console.log('🖥️ 管理后台: http://localhost:' + PORT + '/admin (账号: admin/admin123)');
  console.log('');
  console.log('📋 可用接口:');
  console.log('   GET  /              - Web测试页面');
  console.log('   GET  /api/health    - 健康检查');
  console.log('   GET  /api/technicians - 技师列表');
  console.log('   GET  /api/deposits  - 托管库存');
  console.log('   POST /api/order/create - 创建订单');
  console.log('   POST /api/order/pay - 支付成功');
  console.log('   POST /api/write-off/execute - 核销');
});
