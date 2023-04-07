import Dialog from 'tdesign-miniprogram/dialog/index';
import Toast from 'tdesign-miniprogram/toast/index';
import { 
  fetchCartGroupData,
  fetchCartNum,
  fetchCheckedCart,
  fetchCheckedAllCart,
  fetchDeleteCart
} from '../../services/cart/cart';

Page({
  data: {
    cartGroupData: [],
    isAllSelected: null, // 全选状态
    totalAmount: 0, // 总价
    selectedGoodsCount: 0 // 总数
  },

  // 调用自定义tabbar的init函数，使页面与tabbar激活状态保持一致
  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.refreshData();
  },

  async refreshData() {
    const res = await fetchCartGroupData();
    const cartGroupData = res.data;
    this.setData({ cartGroupData });
    this.checkAllStatus(cartGroupData);
    this.commputedCount(cartGroupData);
  },

  // 更改全选状态值
  checkAllStatus(data) {
    if (!data.length) {
      this.setData({ isAllSelected: 0 });
      return;
    }
    this.setData({ isAllSelected: 1 });
    data.map((item) => {
      if (!item.isChecked) {
        this.setData({ isAllSelected: 0 });
        return;
      }
    });
  },

  // 计算总价和总数
  commputedCount(data) {
    let total = 0, sum = 0;
    data.forEach((item) => {
      if (item.isChecked) {
        total += item.skuNum * item.skuPrice
        sum += item.skuNum
      }
    })
    this.setData({
      totalAmount: total, // 总价
      selectedGoodsCount: sum // 总数
    })
  },

  // 删除加购商品
  // 注：实际场景时应该调用接口
  deleteGoodsService({ spuId, skuId }) {
    function deleteGoods(group) {
      for (const gindex in group) {
        const goods = group[gindex];
        if (goods.spuId === spuId && goods.skuId === skuId) {
          group.splice(gindex, 1);
          return gindex;
        }
      }
      return -1;
    }
    const { storeGoods, invalidGoodItems } = this.data.cartGroupData;
    for (const store of storeGoods) {
      for (const activity of store.promotionGoodsList) {
        if (deleteGoods(activity.goodsPromotionList) > -1) {
          return Promise.resolve();
        }
      }
      if (deleteGoods(store.shortageGoodsList) > -1) {
        return Promise.resolve();
      }
    }
    if (deleteGoods(invalidGoodItems) > -1) {
      return Promise.resolve();
    }
    return Promise.reject();
  },

  // 清空失效商品
  // 注：实际场景时应该调用接口
  clearInvalidGoodsService() {
    this.data.cartGroupData.invalidGoodItems = [];
    return Promise.resolve();
  },

  // 选择单个商品
  async onGoodsSelect(e) {
    const {
      goods: { skuId },
      isChecked,
    } = e.detail;
    await fetchCheckedCart({ skuId, isChecked }).then(() => this.refreshData());
  },

  onStoreSelect(e) {
    const {
      store: { storeId },
      isSelected,
    } = e.detail;
    this.selectStoreService({ storeId, isSelected }).then(() => this.refreshData());
  },

  async onQuantityChange(e) {
    const {
      goods: { skuId },
      skuNum,
    } = e.detail;

    await fetchCartNum({ skuId, skuNum }).then(() => this.refreshData());
  },

  goCollect() {
    /** 活动肯定有一个活动ID，用来获取活动banner，活动商品列表等 */
    const promotionID = '123';
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },

  goGoodsDetail(e) {
    const { spuId, storeId } = e.detail.goods;
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}&storeId=${storeId}`,
    });
  },

  clearInvalidGoods() {
    // 实际场景时应该调用接口清空失效商品
    this.clearInvalidGoodsService().then(() => this.refreshData());
  },

  onGoodsDelete(e) {
    const {
      goods: { skuId },
    } = e.detail;
    Dialog.confirm({
      content: '确认删除该商品吗?',
      confirmBtn: '确定',
      cancelBtn: '取消',
    }).then(async () => {
      await fetchDeleteCart({ skuId }).then(() => {
        Toast({ context: this, selector: '#t-toast', message: '商品删除成功' });
        this.refreshData();
      });
    });
  },

  async onSelectAll(event) {
    const { isAllSelected } = event?.detail ?? {};
    console.log(event);
    // 调用接口改变全选
    await fetchCheckedAllCart({ isAllSelected }).then(() => this.refreshData());
  },

  onToSettle() {
    const goodsRequestList = [];
    this.data.cartGroupData.storeGoods.forEach((store) => {
      store.promotionGoodsList.forEach((promotion) => {
        promotion.goodsPromotionList.forEach((m) => {
          if (m.isSelected == 1) {
            goodsRequestList.push(m);
          }
        });
      });
    });
    wx.setStorageSync('order.goodsRequestList', JSON.stringify(goodsRequestList));
    wx.navigateTo({ url: '/pages/order/order-confirm/index?type=cart' });
  },
  onGotoHome() {
    wx.switchTab({ url: '/pages/home/home' });
  },
});
