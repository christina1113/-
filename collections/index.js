// 处理用户收藏的新增
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // userid是用户的openid postid是帖子id
  const {
    userId,
    postId,
  } = event
  try {
    const res = await db.collection('collections').where({
      userId,
      postId
    }).get()
    // 取消收藏
    if (res.data.length > 0) {
      const res = await db.collection('collections').where({
        userId,
        postId
      }).remove()
      if (res.stats.removed > 0) {
        return {
          code: 0,
          message: '取消收藏成功'
        }
      }
    }
    await db.collection('collections').add({
      data: {
        userId,
        postId,
        collectTime: db.serverDate()
      }
    })
    return {
      code: 0,
      message: '收藏成功'
    }
  } catch (e) {
    console.error(e)
    return {
      code: -1,
      message: '收藏失败'
    }
  }
}