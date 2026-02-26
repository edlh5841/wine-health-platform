const { api } = require('../../utils/api');

Page({
  data: {
    technician: {}
  },

  onLoad(options) {
    const techId = options.id;
    this.loadTechnicianDetail(techId);
  },

  async loadTechnicianDetail(techId) {
    try {
      const res = await api.get('/api/technicians');
      const tech = res.data.find(t => t.id == techId);
      this.setData({ technician: tech || {} });
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  bookNow() {
    const techId = this.data.technician.id;
    wx.navigateTo({
      url: `/pages/order-create/index?technicianId=${techId}`
    });
  }
});
