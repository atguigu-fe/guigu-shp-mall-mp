/* eslint-disable no-param-reassign */
import { fetchUserAddressList, fetchDeleteAddress } from '../../../../services/address/fetchAddress';
import Toast from 'tdesign-miniprogram/toast/index';
import { resolveAddress, rejectAddress } from './util';
import { getAddressPromise } from '../edit/util';

Page({
  data: {
    addressList: [],
    deleteID: '',
    showDeleteConfirm: false,
    isOrderSure: false,
  },

  /** 选择模式 */
  selectMode: false,
  /** 是否已经选择地址，不置为true的话页面离开时会触发取消选择行为 */
  hasSelect: false,

  onLoad(query) {
    const { selectMode = '', isOrderSure = '', id = '' } = query;
    this.setData({
      isOrderSure: !!isOrderSure,
      id,
    });
    this.selectMode = !!selectMode;
    this.init();
  },
  onShow() {
    this.init()
  },

  init() {
    this.getAddressList();
  },
  async getAddressList() {
    const result = await fetchUserAddressList()
    this.setData({ addressList: result.data });
  },
  getWXAddressHandle() {
    wx.chooseAddress({
      success: (res) => {
        if (res.errMsg.indexOf('ok') === -1) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.errMsg,
            icon: '',
            duration: 1000,
          });
          return;
        }
        Toast({
          context: this,
          selector: '#t-toast',
          message: '添加成功',
          icon: '',
          duration: 1000,
        });
        const { length: len } = this.data.addressList;
        this.setData({
          [`addressList[${len}]`]: {
            name: res.userName,
            phoneNumber: res.telNumber,
            address: `${res.provinceName}${res.cityName}${res.countryName}${res.detailInfo}`,
            isDefault: 0,
            tag: '微信地址',
            id: len,
          },
        });
      },
    });
  },

  /** 删除地址 */
  async deleteAddressHandle(e) {
    const { id } = e.currentTarget.dataset;
    await fetchDeleteAddress(id)
    this.setData({
      showDeleteConfirm: false,
    })
    Toast({
      context: this,
      selector: '#t-toast',
      message: '地址删除成功',
      theme: 'success',
      duration: 1000,
    });
    this.init()
  },
  /** 编辑地址 */
  editAddressHandle({ detail }) {
    const { id } = detail || {};
    wx.navigateTo({ url: `/pages/usercenter/address/edit/index?id=${id}` });
  },
  /** 选择收货地址 */
  selectHandle({ detail }) {
    wx.navigateBack({ delta: 1 });
  },
  /** 新建地址 */
  createHandle() {
    wx.navigateTo({ url: '/pages/usercenter/address/edit/index' });
  },
});
