import Toast from 'tdesign-miniprogram/toast/index';
import { fetchGood } from '../../../services/good/fetchGood';
import { fetchActivityList } from '../../../services/activity/fetchActivityList';
import {
  getGoodsDetailsCommentList,
  getGoodsDetailsCommentsCount,
} from '../../../services/good/fetchGoodsDetailsComments';
import { fetchCartNum } from '../../../services/cart/cart'
import { cdnBase } from '../../../config/index';

const imgPrefix = `${cdnBase}/`;

const recLeftImg = `${imgPrefix}common/rec-left.png`;
const recRightImg = `${imgPrefix}common/rec-right.png`;
const obj2Params = (obj = {}, encode = false) => {
  const result = [];
  Object.keys(obj).forEach((key) =>
    result.push(`${key}=${encode ? encodeURIComponent(obj[key]) : obj[key]}`),
  );

  return result.join('&');
};

Page({
  data: {
    commentsList: [],
    commentsStatistics: {
      badCount: 0,
      commentCount: 0,
      goodCount: 0,
      goodRate: 0,
      hasImageCount: 0,
      middleCount: 0,
    },
    isShowPromotionPop: false,
    activityList: [],
    recLeftImg,
    recRightImg,
    details: {},
    skuInfo: {},
    goodsTabArray: [
      {
        name: '商品',
        value: '', // 空字符串代表置顶
      },
      {
        name: '详情',
        value: 'goods-page',
      },
    ],
    storeLogo: `${imgPrefix}common/store-logo.png`,
    storeName: '云mall标准版旗舰店',
    jumpArray: [
      {
        title: '首页',
        url: '/pages/home/home',
        iconName: 'home',
      },
      {
        title: '购物车',
        url: '/pages/cart/index',
        iconName: 'cart',
        showCartNum: true,
      },
    ],
    isStock: true, // 是否售罄（无库存）
    cartNum: 1,
    soldout: false, // 是否下架
    buttonType: 1,
    buyNum: 1,
    selectedAttrStr: '',
    primaryImage: '',
    isSpuSelectPopupShow: false,
    isAllSelectedSku: false,
    buyType: 0,
    outOperateStatus: false, // 是否外层加入购物车
    operateType: 0,
    selectSkuSellsPrice: 0,
    maxLinePrice: 0,
    minSalePrice: 0,
    maxSalePrice: 0,
    list: [],
    spuId: '',
    navigation: { type: 'fraction' },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,
    bannerList: []
  },

  onLoad(query) {
    const { spuId } = query;
    console.log(spuId);
    this.setData({
      spuId: spuId,
    });
    this.getDetail(spuId);
    this.getCommentsList(spuId);
    this.getCommentsStatistics(spuId);
  },

  /** 商品详情 */
  getDetail(spuId) {
    Promise.all([fetchGood(spuId), fetchActivityList()]).then((res) => {
      const [detail, activityList] = res;
      console.log(detail.data);
      const details = detail.data
      const {
        price,
        skuInfo,
      } = details;
      this.getSkuItem(details.spuSaleAttrList);
      const promotionArray = [];
      activityList.forEach((item) => {
        promotionArray.push({
          tag: item.promotionSubCode === 'MYJ' ? '满减' : '满折',
          label: '满100元减99.9元',
        });
      });
      const bannerList = details.spuPosterList.map((item) => item.imgUrl)
      this.setData({
        details,
        bannerList,
        activityList,
        isStock: true,
        maxSalePrice: price ? parseInt(price) : 0,
        maxLinePrice: price ? parseInt(price) : 0,
        minSalePrice: price ? parseInt(price) : 0,
        list: promotionArray,
        primaryImage: skuInfo.skuDefaultImg,
        soldout: false,
        skuInfo,
      });
    });
  },

  handlePopupHide() {
    this.setData({
      isSpuSelectPopupShow: false,
    });
  },

  showSkuSelectPopup(type) {
    this.setData({
      buyType: type || 0,
      outOperateStatus: type >= 1,
      isSpuSelectPopupShow: true,
    });
  },

  buyItNow() {
    this.showSkuSelectPopup(1);
  },

  toAddCart() {
    this.showSkuSelectPopup(2);
  },

  /** 跳转首页｜购物车 */
  toNav(e) {
    const { url } = e.detail;
    wx.switchTab({
      url: url,
    });
  },

  showCurImg(e) {
    const { index } = e.detail;
    const { images } = this.data.details;
    wx.previewImage({
      current: images[index],
      urls: images, // 需要预览的图片http链接列表
    });
  },

  onPageScroll({ scrollTop }) {
    const goodsTab = this.selectComponent('#goodsTab');
    goodsTab && goodsTab.onScroll(scrollTop);
  },

  /** 选择规格 */
  chooseSpecItem(e) {
    const { specList } = e.detail;
    this.getSkuItem(specList);
  },

  getSkuItem(specList) {
    const selectedSkuValues = this.getSelectedSkuValues(specList);
    if (selectedSkuValues.length > 0) {
      let selectedAttrStr = ` 件 `;
      selectedSkuValues.forEach((item) => {
        selectedAttrStr += `，${item}  `;
      });
      this.setData({
        selectedAttrStr,
        isAllSelectedSku: true
      })
    }
  },

  // 获取已选择的sku名称
  getSelectedSkuValues(specList) {
    const selectedList = []
    specList.forEach((item) => {
      item.spuSaleAttrValueList.forEach((e) => {
        if (e.isChecked === '1') {
          selectedList.push(e.saleAttrValueName)
        }
      })
    })
    return selectedList
  },
 
  /** 添加购物车 */
  addCart() {
    const { isAllSelectedSku, spuId, buyNum } = this.data;
    if (!isAllSelectedSku) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请选择规格',
        icon: '',
        duration: 1000,
      });
    }
    // 添加购物车
    fetchCartNum({skuId: spuId, skuNum: buyNum}).then(() => {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '添加购物车成功',
        icon: '',
        duration: 1000,
      });
      this.setData({
        isSpuSelectPopupShow: false
      })
    })
  },

  /** 去购买 */
  gotoBuy(type) {
    const { isAllSelectedSku, buyNum } = this.data;
    if (!isAllSelectedSku) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请选择规格',
        icon: '',
        duration: 1000,
      });
      return;
    }
    this.handlePopupHide();
    const query = {
      quantity: buyNum,
      storeId: '1',
      spuId: this.data.spuId,
      goodsName: this.data.details.title,
      skuId:
        type === 1 ? this.data.skuList[0].skuId : this.data.selectItem.skuId,
      available: this.data.details.available,
      price: this.data.details.minSalePrice,
      specInfo: this.data.details.specList?.map((item) => ({
        specTitle: item.title,
        specValue: item.specValueList[0].specValue,
      })),
      primaryImage: this.data.details.primaryImage,
      spuId: this.data.details.spuId,
      thumb: this.data.details.primaryImage,
      title: this.data.details.title,
    };
    let urlQueryStr = obj2Params({
      goodsRequestList: JSON.stringify([query]),
    });
    urlQueryStr = urlQueryStr ? `?${urlQueryStr}` : '';
    const path = `/pages/order/order-confirm/index${urlQueryStr}`;
    wx.navigateTo({
      url: path,
    });
  },

  specsConfirm() {
    const { buyType } = this.data;
    if (buyType === 1) {
      this.gotoBuy();
    } else {
      this.addCart();
    }
    // this.handlePopupHide();
  },

  changeNum(e) {
    this.setData({
      buyNum: e.detail.buyNum,
    });
  },

  closePromotionPopup() {
    this.setData({
      isShowPromotionPop: false,
    });
  },

  promotionChange(e) {
    const { index } = e.detail;
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${index}`,
    });
  },

  showPromotionPopup() {
    this.setData({
      isShowPromotionPop: true,
    });
  },

  /** 获取评论列表 */
  async getCommentsList() {
    try {
      const code = 'Success';
      const data = await getGoodsDetailsCommentList();
      const { homePageComments } = data;
      if (code.toUpperCase() === 'SUCCESS') {
        const nextState = {
          commentsList: homePageComments.map((item) => {
            return {
              goodsSpu: item.spuId,
              userName: item.userName || '',
              commentScore: item.commentScore,
              commentContent: item.commentContent || '用户未填写评价',
              userHeadUrl: item.isAnonymity
                ? this.anonymityAvatar
                : item.userHeadUrl || this.anonymityAvatar,
            };
          }),
        };
        this.setData(nextState);
      }
    } catch (error) {
      console.error('comments error:', error);
    }
  },

  /** 分享 */
  onShareAppMessage() {
    // 自定义的返回信息
    const customInfo = {
      imageUrl: this.data.skuInfo.skuDefaultImg,
      title: this.data.skuInfo.skuName,
      path: `/pages/goods/details/index?spuId=${this.data.spuId}`,
    };
    return customInfo;
  },

  /** 获取评价统计 */
  async getCommentsStatistics() {
    try {
      const code = 'Success';
      const data = await getGoodsDetailsCommentsCount();
      if (code.toUpperCase() === 'SUCCESS') {
        const {
          badCount,
          commentCount,
          goodCount,
          goodRate,
          hasImageCount,
          middleCount,
        } = data;
        const nextState = {
          commentsStatistics: {
            badCount: parseInt(`${badCount}`),
            commentCount: parseInt(`${commentCount}`),
            goodCount: parseInt(`${goodCount}`),
            /** 后端返回百分比后数据但没有限制位数 */
            goodRate: Math.floor(goodRate * 10) / 10,
            hasImageCount: parseInt(`${hasImageCount}`),
            middleCount: parseInt(`${middleCount}`),
          },
        };
        this.setData(nextState);
      }
    } catch (error) {
      console.error('comments statiistics error:', error);
    }
  },

  /** 跳转到评价列表 */
  navToCommentsListPage() {
    wx.navigateTo({
      url: `/pages/goods/comments/index?spuId=${this.data.spuId}`,
    });
  },
});
