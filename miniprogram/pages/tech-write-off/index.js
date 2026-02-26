const { api } = require('../../utils/api');

Page({
  data: {
    result: null
  },

  async scanQRCode() {
    try {
      const scanRes = await wx.scanCode({ onlyFromCamera: true });
      
      // MVP简化：直接解析为orderId
      const orderId = scanRes.result;
      
      const userInfo = wx.getStorageSync('userInfo');
      
      // 调用核销接口
      const res = await api.post('/api/write-off/execute', {
        orderId: orderId,
        technicianId: userInfo.id || 2
      });

      this.setData({
        result: {
          title: '核销成功',
          message: `核销单号: ${res.data.writeOffNo}\n核销量: ${res.data.amount}ml`
        }
      });

    } catch (error) {
      this.setData({
        result: {
          title: '核销失败',
          message: error.message
        }
      });
    }
  }
});
