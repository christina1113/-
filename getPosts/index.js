// 获取帖子的数据 并且判断是否收藏
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // 两个值是一样的 为了区分发现和我的
  const {
    userId,
    openid
  } = event
  try {
    // 先获取收藏的列表，根据收藏的列表来判断已被收藏的帖子是哪些
    // 获取我收藏的那些帖子
    const collections = await db.collection('collections').where({
      userId
    }).get()

    const postIds = collections.data.map(item => item.postId)

    let search = {}
    if (openid) {
      search = {
        _openid: openid
      }
    }
    // 获取全部的帖子
    const posts = await db.collection('posts').where({
      ...search
    }).get()


    // return {
    //   code: 0,
    //   data: posts,
    //   postIds
    // }

    if (postIds.length === 0) {
      return {
        code: 0,
        data: posts
      }
    } else {

      if (posts.data && posts.data.length) {
        posts.data.forEach((item) => {

          if (postIds.indexOf(item._id) > -1) {
            item.iscollect = true
          } else {
            item.iscollect = false
          }

        })
      }

      return {
        code: 0,
        data: posts
      }

    }





    // 获取我收藏的那些数据
    // const posts = await db.collection('posts').where({
    //   _id: _.in(postIds)
    // }).get()
    // return {
    //   code: 0,
    //   data: posts.data
    // }
  } catch (e) {
    console.error(e)
    return {
      code: -1,
      message: '获取收藏列表失败'
    }
  }
}