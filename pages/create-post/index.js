// pages/create-post/index.js
const db = wx.cloud.database().collection('posts');
const app = getApp()
Page({
  data: {
    content: '', // 初始化发帖内容
    images: [], // 初始化图片数组
    allTags: [{
        id: 1,
        name: '#早餐食谱'
      },
      {
        id: 2,
        name: '#减脂餐'
      },
      {
        id: 3,
        name: '#快手菜'
      },
      {
        id: 4,
        name: '#甜品'
      },
      {
        id: 5,
        name: '#家常菜'
      },
      {
        id: 6,
        name: '#健康饮食'
      }
    ],
    selectedTags: [],
    customTag: '',
    canSubmit: false
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const {
      images,
      content
    } = this.data;
    this.setData({
      canSubmit: images.length > 0 || content.trim().length > 0
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          images: [...this.data.images, ...tempFiles]
        }, this.checkCanSubmit());
      }
    });
  },

  // 删除图片
  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const newImages = [...this.data.images];
    newImages.splice(index, 1);
    this.setData({
      images: newImages
    }, this.checkCanSubmit);
  },

  // 内容变化
  onContentChange(e) {
    this.setData({
      content: e.detail.value
    }, this.checkCanSubmit);
  },

  // 切换标签
  toggleTag(e) {
    const tagId = parseInt(e.currentTarget.dataset.id);
    const index = this.data.selectedTags.indexOf(tagId);

    if (index > -1) {
      this.data.selectedTags.splice(index, 1);
    } else {
      this.data.selectedTags.push(tagId);
    }

    this.setData({
      selectedTags: [...this.data.selectedTags]
    });
  },

  // 自定义标签输入
  onTagInput(e) {
    this.setData({
      customTag: e.detail.value
    });
  },

  // 添加自定义标签
  addCustomTag(e) {
    const tagName = e.detail.value.trim();
    if (!tagName) return;

    // 简单验证标签格式
    if (!tagName.startsWith('#')) {
      wx.showToast({
        title: '标签应以#开头',
        icon: 'none'
      });
      return;
    }

    if (tagName.length > 12) {
      wx.showToast({
        title: '标签过长',
        icon: 'none'
      });
      return;
    }

    // 添加到标签列表
    const newTag = {
      id: Date.now(), // 临时ID
      name: tagName
    };

    this.setData({
      allTags: [...this.data.allTags, newTag],
      selectedTags: [...this.data.selectedTags, newTag.id],
      customTag: ''
    });
  },

  // 返回
  navigateBack() {
    if (this.data.images.length > 0 || this.data.content) {
      wx.showModal({
        title: '提示',
        content: '确定放弃当前编辑的内容吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  // 提交发布
  async handleSubmit() {
    if (!this.data.canSubmit) return;

    const {
      images,
      content,
      selectedTags,
      allTags
    } = this.data;

    // 获取选中的标签名称
    const tags = allTags
      .filter(tag => selectedTags.includes(tag.id))
      .map(tag => tag.name);

    wx.showLoading({
      title: '发布中...',
      mask: true
    });

    try {
      // 1. 上传图片到云存储
      const uploadTasks = images.map(image => {
        const cloudPath = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
        return wx.cloud.uploadFile({
          cloudPath,
          filePath: image
        });
      });

      const uploadResults = await Promise.all(uploadTasks);
      const imageUrls = uploadResults.map(res => res.fileID);

      const res = await db.add({
        data: {
          content: content.trim(),
          images: imageUrls,
          tags,
          location: '' // 可添加地理位置
        }
      })

      // // 2. 调用云函数保存数据
      // const { result } = await wx.cloud.callFunction({
      //   name: 'createPost',

      // });

 
      wx.showToast({
        title: '发布成功'
      });
      setTimeout(() => {
        wx.navigateBack();
        // 发布成功后刷新动态流
        const pages = getCurrentPages();
        if (pages.length > 1) {
          const prevPage = pages[pages.length - 2];
          prevPage.onLoad && prevPage.onLoad();
        }
      }, 1500);
    } catch (err) {
      console.error('发布失败:', err);
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  }
});