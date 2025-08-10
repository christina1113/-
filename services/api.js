// 基础请求方法（适配云开发或普通HTTP请求）
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'http',  // 云函数名称（需提前创建）
      data: { url, method, data }
    }).then(res => {
      resolve(res.result)
    }).catch(reject)
  })
}

// 或者使用普通HTTP请求（如果未用云开发）
const httpRequest = (options) => {
  return wx.request({
    ...options,
    header: {
      'Content-Type': 'application/json',
      'Authorization': wx.getStorageSync('token')
    }
  })
}

export { request, httpRequest }