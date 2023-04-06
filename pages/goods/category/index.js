import { getCategoryList } from '../../../services/good/fetchCategoryList';
Page({
  data: {
    list: [],
  },
  async init() {
    try {
      const result = await getCategoryList({});
      this.setData({
        list: result.data,
      });
    } catch (error) {
      console.error('err:', error);
    }
  },

  onShow() {
    this.getTabBar().init();
  },
  onChange(e) {
    console.log(e);
    const categoryId = e.detail.item.categoryId;
    wx.navigateTo({
      url: `/pages/goods/list/index?category3Id=${categoryId}`,
    });
  },
  onLoad() {
    this.init(true);
  },
});
