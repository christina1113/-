const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 检查用户是否已存在
    const checkRes = await db.collection('users').where({
      openid: wxContext.OPENID
    }).get()
    
    if (checkRes.data.length > 0) {
      return checkRes.data[0]
    }
    
    // 创建新用户
    const userData = {
      openid: wxContext.OPENID,
      nickName: '微信用户',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate(),
      postCount: 0,
      likeCount: 0
    }
    
    const res = await db.collection('users').add({
      data: userData
    })
    
    return {
      ...userData,
      _id: res._id
    }
  } catch (err) {
    console.error('添加用户失败:', err)
    throw err
  }
}