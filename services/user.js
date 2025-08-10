export const getUserInfo = () => {
  return wx.cloud.callFunction({ 
    name: 'getUserProfile' 
  });
};

export const getHealthData = () => {
  return wx.getStorageSync('healthData') || {};
};