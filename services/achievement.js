export const getAchievements = () => {
  return wx.cloud.callFunction({
    name: 'getUserAchievements'
  });
};