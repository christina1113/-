// 云函数目录/cloudLogin/index.js
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}); // 自动获取环境
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    code
  } = event;
  
  try {
    // 1. 通过 code 换取 openid 和会话密钥
    const {
      openid,
      session_key
    } = await cloud.auth.code2Session({
      code
    });

    // 3. 返回登录成功信息（可添加自定义令牌）
    return {
      code: 0,
      message: "登录成功",
      data: {
        openid,
      }
    };

  } catch (error) {
    console.error("云函数登录错误：", error);
    return {
      code: -1,
      message: "登录验证失败",
      error: error.message
    };
  }
};