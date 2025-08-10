const db = wx.cloud.database();

export const getRecipes = async (params) => {
  const { type, calorie } = params;
  const res = await db.collection('recipes')
    .where({
      type,
      calorie: _.lte(calorie || 2000)
    })
    .get();
  return res.data;
};