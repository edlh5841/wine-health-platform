const { api } = require('../../utils/api');

Page({
  data: {
    technicians: []
  },

  onLoad() {
    this.loadTechnicians();
  },

  onShow() {
    this.loadTechnicians();
  },

  async loadTechnicians() {
    try {
      const res = await api.get('/api/technicians');
      this.setData({ technicians: res.data });
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  selectTech(e) {
    const techId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-create/index?technicianId=${techId}`
    });
  }
});
