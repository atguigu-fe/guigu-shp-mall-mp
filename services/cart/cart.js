import { config } from '../../config/index';
import { request } from '../../utils/request';

/** 获取购物车mock数据 */
function mockFetchCartGroupData(params) {
  const { delay } = require('../_utils/delay');
  const { genCartGroupData } = require('../../model/cart');

  return delay().then(() => genCartGroupData(params));
}

/** 获取购物车数据 */
export function fetchCartGroupData(params) {
  if (!config.useMock) {
    return mockFetchCartGroupData(params);
  }

  return request({
    url: '/api/cart/cartList'
  })
}

/** 修改购物车数量 */
export function fetchCartNum(params) {
  return request({
    url: `/api/cart/addToCart/${params.skuId}/${params.skuNum}`,
  })
}

/** 选中/取消购物车 */
export function fetchCheckedCart(params) {
  return request({
    url: `/api/cart/checkCart/${params.skuId}/${params.isChecked}`,
  })
}

/** 批量选中/批量取消购物车 */
export function fetchCheckedAllCart(params) {
  return request({
    url: `/api/cart/allCheckCart/${params.isAllSelected}`,
  })
}

/** 批量选中/批量取消购物车 */
export function fetchDeleteCart(params) {
  return request({
    url: `/api/cart/deleteCart/${params.skuId}`,
    method: 'DELETE'
  })
}