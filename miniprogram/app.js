App({
  globalData: {
    apiBaseUrl: 'http://localhost:8080',
    userInfo: null
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('accessToken');
    if (!token) {
      this.login();
    }
  },

  login() {
    wx.login({
      success: (res) => {
        // 调用后端登录接口
        wx.request({
          url: this.globalData.apiBaseUrl + '/api/auth/login',
          method: 'POST',
          data: { code: res.code },
          success: (result) => {
            if (result.data.code === 200) {
              wx.setStorageSync('accessToken', result.data.data.token);
              wx.setStorageSync('openid', result.data.data.openid);
              wx.setStorageSync('userInfo', result.data.data.userInfo);
            }
          }
        });
      }
    });
  }
});
