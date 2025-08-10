export const calculateBMI = (height, weight) => {
  return (weight / ((height / 100) ** 2)).toFixed(1);
};

export const calculateDailyCalorie = (user) => {
  // Harris-Benedict公式
  if (user.gender === 'male') {
    return 66 + (13.7 * user.weight) + (5 * user.height) - (6.8 * user.age);
  }
  return 655 + (9.6 * user.weight) + (1.8 * user.height) - (4.7 * user.age);
};