import { fetchUserAddressList } from '../../../services/address/fetchAddress';
import { fetchTrade, fetchOrderm, fetchSubmitOrder, fetchOrder } from '../../../services/order/orderConfirm';
// const stripeImg = `https://cdn-we-retail.ym.tencent.com/miniapp/order/stripe.png`;

Page({
  data: {
    userAddress: null,
    orderInfo: null,
    submitActive: false
  },
  onLoad({skuId}) {
    console.log(skuId);
    if (skuId) {
      this.getOrder(skuId)
      this.getUserAddressList()
    } else {
      this.init()
    }
  },

  init() {
    this.getUserAddressList()
    this.getTrade()
  },

  /** 获取单个订单详情 */
  getOrder(skuId) {
    fetchOrder(skuId).then(res => {
      this.setData({
        orderInfo: res.data
      })
    })
  },

  /** 获取订单信息 */
  getTrade() {
    fetchTrade().then(res => {
      this.setData({orderInfo: res.data})
    })
  },

  /** 获取用户默认地址 */
  getUserAddressList() {
    fetchUserAddressList().then((res) => {
      if (res.code === 200 && res.data.length > 0) {
        res.data.forEach(item => {
          if (item.isDefault === '1') {
            this.setData({
              userAddress: item,
              submitActive: true
            })
          }
        })
      }
    })
  },

  submitOrder() {
    const { orderInfo } = this.data

    fetchSubmitOrder(orderInfo).then(res => {
      console.log(res);
    })
  }
});
