const BASE_URL = 'http://localhost:8080';
const REQUEST_TIMEOUT = 10000;

const request = (method) => {
  return (url, data = {}) => {
    const token = wx.getStorageSync('accessToken');
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
        data: data,
        header: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        timeout: REQUEST_TIMEOUT,
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.code === 200 || res.data.code === 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.data.message || '请求失败'));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        },
        fail: reject
      });
    });
  };
};

export const api = {
  get: request('GET'),
  post: request('POST')
};

export const wechatPay = {
  requestPayment(payParams) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: 'RSA',
        paySign: payParams.paySign,
        success: resolve,
        fail: reject
      });
    });
  }
};
