Page({
  data: {
    genders: ['男', '女'],
    gender: '男',
    age: '',
    height: '',
    weight: '',
    calorie: null,
    recipes:[]//新增菜谱数组
  },

  changeGender(e) {
    this.setData({ gender: this.data.genders[e.detail.value] });
  },

  inputAge(e) {
    this.setData({ age: e.detail.value });
  },

  inputHeight(e) {
    this.setData({ height: e.detail.value });
  },

  inputWeight(e) {
    this.setData({ weight: e.detail.value });
  },

  calculate() {
    const { gender, age, height, weight } = this.data;
    if (!age || !height || !weight) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    // Harris-Benedict公式
    let bmr;
    if (gender === '男') {
      bmr = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
    } else {
      bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
    }

    const calorie = Math.round(bmr);
    this.setData({ 
      calorie,
      recipes: this.getRecipesByCalories(calorie)
    });
  },

  // 新增方法：根据热量获取菜谱
  getRecipesByCalories(calories) {
    // 定义菜谱数据库
    const allRecipes = [
      {
        name: "鸡胸肉沙拉",
        calories: 350,
        image: "/images/chicken_salad.jpg", // 本地图片路径
        ingredients: "鸡胸肉100g\n 生菜50g\n 小番茄5个\n 黄瓜半根\n 橄榄油5ml",
        steps: "1. 鸡胸肉煮熟切片 \n2. 蔬菜洗净切好 \n3. 混合所有食材 \n4. 加入少许橄榄油和盐调味"
      },
      {
        name: "三文鱼糙米饭",
        calories: 450,
        image: "/images/salmon_rice.jpg",
        ingredients: "三文鱼150g\n 糙米100g\n 西兰花50g\n柠檬1片",
        steps: "1. 糙米煮熟 \n2. 三文鱼煎熟 \n3. 西兰花焯水 \n4. 摆盘后挤上柠檬汁"
      },
      {
        name: "牛肉蔬菜炒面",
        calories: 500,
       image: "/images/beef_noodles.jpg",
        ingredients: "牛肉片100g\n 全麦面条80g\n 青椒1个\n 胡萝卜半根",
        steps: "1. 面条煮熟 \n2. 牛肉和蔬菜炒熟 \n3. 加入面条翻炒 \n4. 调味即可"
      },
      {
        name: "素食藜麦碗",
        calories: 300,
        image: "/images/quinoa_bowl.jpg",
        ingredients: "藜麦80g\n 牛油果半个\n 鹰嘴豆50g\n 菠菜30g",
        steps: "1. 藜麦煮熟 \n2. 牛油果切片\n 3. 混合所有食材 \n4. 加入橄榄油和柠檬汁"
      },
      {
        name: "虾仁炒蔬菜",
        calories: 400,
        image: "/images/shrimp_vegetables.jpg",
        ingredients: "虾仁150g\n 芦笋100g\n 彩椒半个\n 大蒜2瓣",
        steps: "1. 虾仁腌制 \n2. 蔬菜切好\n 3. 先炒虾仁再炒蔬菜 \n4. 混合调味"
      }
    ];

    // 根据热量范围筛选菜谱
    if (calories < 1500) {
      return allRecipes.filter(recipe => recipe.calories < 400);
    } else if (calories >= 1500 && calories < 2000) {
      return allRecipes.filter(recipe => recipe.calories >= 400 && recipe.calories < 450);
    } else {
      return allRecipes.filter(recipe => recipe.calories >= 450);
    }
  }
});