// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }

  console.log(wxContext, '22');
  try {
    // 调用云开发登录接口
    const {
      openid
    } = await cloud.login()
    // 返回包含 openid 的结果
    return {
      code: 0,
      message: '获取 openid 成功',
      data: {
        openid
      }
    }
  } catch (err) {
    // 捕获错误并返回错误信息
    console.error('获取 openid 失败', err)
    return {
      code: -1,
      message: '获取 openid 失败',
      error: err
    }
  }
}