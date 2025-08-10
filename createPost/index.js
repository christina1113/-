// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { content, images, tags, location } = event
  
  try {
    // 1. 获取用户信息
    const userRes = await db.collection('users').where({
      openid: wxContext.OPENID
    }).get()
    
    let userInfo = {}
    if (userRes.data.length > 0) {
      userInfo = userRes.data[0]
    } else {
      // 如果用户不存在，创建默认用户记录
      const { result } = await cloud.callFunction({
        name: 'addUser',
        data: {
          openid: wxContext.OPENID
        }
      })
      userInfo = result
    }
    
    // 2. 创建帖子
    const postData = {
      content,
      images,
      tags,
      location,
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
      user: {
        _id: userInfo._id,
        nickName: userInfo.nickName || '微信用户',
        avatarUrl: userInfo.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
      }
    }
    
    const res = await db.collection('posts').add({
      data: postData
    })
    
    return {
      code: 0,
      data: res,
      message: '发布成功'
    }
  } catch (err) {
    console.error('发布失败:', err)
    return {
      code: -1,
      message: '发布失败'
    }
  }
}