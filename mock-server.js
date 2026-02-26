const http = require('http');
const url = require('url');

// 模拟数据
const technicians = [
  { id: 1, realName: '王师傅', certNo: 'TECH2024001', workYears: 5, ratingScore: 4.9, orderCount: 156, balance: 8960, onlineStatus: 1, avatar: '' },
  { id: 2, realName: '李师傅', certNo: 'TECH2024002', workYears: 3, ratingScore: 4.8, orderCount: 89, balance: 7520, onlineStatus: 1, avatar: '' },
  { id: 3, realName: '张师傅', certNo: 'TECH2024003', workYears: 2, ratingScore: 4.5, orderCount: 45, balance: 3200, onlineStatus: 0, avatar: '' }
];

const deposits = [
  { id: 1, batchNo: 'DP202401150001', userId: 3, productId: 1, productName: '茅台保健酒', quantity: 1000, availableQuantity: 1000, depositStatus: 2 },
  { id: 2, batchNo: 'DP202402200001', userId: 3, productId: 2, productName: '五粮液保健酒', quantity: 500, availableQuantity: 380, depositStatus: 2 }
];

const orders = [];
let orderIdCounter = 1;

// 响应辅助函数
const jsonResponse = (res, data, code = 200) => {
  res.writeHead(code, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

// 路由处理
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${path}`);

  // OPTIONS 请求处理（CORS预检）
  if (method === 'OPTIONS') {
    jsonResponse(res, {});
    return;
  }

  // 健康检查
  if (path === '/api/health' && method === 'GET') {
    jsonResponse(res, { code: 200, data: { status: 'UP', time: new Date().toISOString() } });
    return;
  }

  // 获取技师列表
  if (path === '/api/technicians' && method === 'GET') {
    jsonResponse(res, { code: 200, data: technicians });
    return;
  }

  // 获取托管库存
  if (path === '/api/deposits' && method === 'GET') {
    const userId = parsedUrl.query.userId;
    const userDeposits = deposits.filter(d => d.userId == userId && d.depositStatus === 2);
    jsonResponse(res, { code: 200, data: userDeposits });
    return;
  }

  // 创建订单
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

  // 支付成功
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

  // 核销
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
  jsonResponse(res, { code: 404, message: 'Not Found' }, 404);
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🍷 保健酒平台 Mock Server 启动成功！`);
  console.log(`📡 API地址: http://localhost:${PORT}/api`);
  console.log(`📋 可用接口:`);
  console.log(`   GET  /api/health          - 健康检查`);
  console.log(`   GET  /api/technicians     - 技师列表`);
  console.log(`   GET  /api/deposits        - 托管库存`);
  console.log(`   POST /api/order/create    - 创建订单`);
  console.log(`   POST /api/order/pay       - 支付成功`);
  console.log(`   POST /api/write-off/execute - 核销`);
});
