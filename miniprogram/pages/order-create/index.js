const { api, wechatPay } = require('../../utils/api');

Page({
  data: {
    technician: {},
    technicianId: null,
    depositBatches: [],
    depositIndex: 0,
    predictQuantity: 200,
    orderAmount: 0,
    submitting: false
  },

  onLoad(options) {
    const techId = options.technicianId;
    this.setData({ technicianId: techId });
    this.loadTechnician(techId);
    this.loadDepositBatches();
  },

  async loadTechnician(techId) {
    try {
      const res = await api.get('/api/technicians');
      const tech = res.data.find(t => t.id == techId);
      this.setData({ technician: tech || {} });
    } catch (error) {
      console.error(error);
    }
  },

  async loadDepositBatches() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const res = await api.get('/api/deposits', { userId: userInfo.id || 3 });
      const batches = res.data.filter(b => b.availableQuantity > 0);
      this.setData({ depositBatches: batches }, () => {
        this.calculateAmount();
      });
    } catch (error) {
      wx.showToast({ title: '加载库存失败', icon: 'none' });
    }
  },

  onDepositChange(e) {
    this.setData({ depositIndex: e.detail.value }, () => {
      this.calculateAmount();
    });
  },

  onQuantityChange(e) {
    this.setData({ predictQuantity: parseInt(e.detail.value) || 0 }, () => {
      this.calculateAmount();
    });
  },

  calculateAmount() {
    const { predictQuantity } = this.data;
    // 基础价: 用量×0.5元 + 服务费99元
    const amount = predictQuantity * 0.5 + 99;
    this.setData({ orderAmount: amount.toFixed(2) });
  },

  async submitOrder() {
    if (this.data.submitting) return;
    
    const { technicianId, depositBatches, depositIndex, predictQuantity, orderAmount } = this.data;
    
    if (!depositBatches[depositIndex]) {
      wx.showToast({ title: '请选择托管酒品', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      // 1. 创建订单
      const orderRes = await api.post('/api/order/create', {
        userId: wx.getStorageSync('userInfo').id || 3,
        technicianId: technicianId,
        batchId: depositBatches[depositIndex].id,
        quantity: predictQuantity,
        amount: parseFloat(orderAmount)
      });

      const orderId = orderRes.data.orderId;

      // 2. 模拟支付（MVP版本直接调用支付成功）
      await api.post('/api/order/pay', { orderId: orderId });

      wx.showToast({ title: '支付成功' });
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/order-detail/index' });
      }, 1500);

    } catch (error) {
      wx.showToast({ title: error.message || '下单失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  }
});
