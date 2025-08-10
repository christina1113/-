Page({
  data: {
    dailyGoal: 2000,
    remainingCal: 1500
  },
  setDailyGoal(e) {
    this.setData({
      dailyGoal: e.detail.value
    });
  }
});