import { request } from '../../utils/request';
import { config } from '../../config/index';

/** 获取收货地址 */
function mockFetchDeliveryAddress(id) {
  const { delay } = require('../_utils/delay');
  const { genAddress } = require('../../model/address');

  return delay().then(() => genAddress(id));
}

/** 获取收货地址列表 */
function mockFetchDeliveryAddressList(len = 0) {
  const { delay } = require('../_utils/delay');
  const { genAddressList } = require('../../model/address');

  return delay().then(() =>
    genAddressList(len).map((address) => {
      return {
        ...address,
        phoneNumber: address.phone,
        address: `${address.provinceName}${address.cityName}${address.districtName}${address.detailAddress}`,
        tag: address.addressTag,
      };
    }),
  );
}

/** 获取收货地址 */
export function fetchDeliveryAddress(id = 0) {
  if (config.useMock) {
    return mockFetchDeliveryAddress(id);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 获取收货地址列表Mock */
export function fetchDeliveryAddressList(len = 10) {
  if (config.useMock) {
    return mockFetchDeliveryAddressList(len);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 获取地址列表 */
export function fetchUserAddressList() {
  return request({
    url: `/api/user/userAddress/auth/findUserAddressList`,
  })
}

/** 获取区 */
export function fetchRegionList() {
  return request({
    url: '/api/user/userAddress/auth/findBaseRegion'
  })
}

/** 获取省 */
export function fetchProvinceList(regionId) {
  return request({
    url: `/api/user/userAddress/auth/findBaseProvinceByRegionId/${regionId}`
  })
}

/** 根据地址id获取地址详情 */
export function fetchAddressDetail(userAddressId) {
  return request({
    url: `/api/user/userAddress/auth/${userAddressId}`
  })
}

/** 添加收货地址 */
export function fetchSaveAddress(data) {
  return request({
    url: `/api/user/userAddress/auth/save`,
    data,
    method: 'POST'
  })
}

/** 更新收货地址 */
export function fetchUpdateAddress(data) {
  return request({
    url: `/api/user/userAddress/auth/update`,
    data,
    method: 'POST'
  })
}

/** 删除收货地址 */
export function fetchDeleteAddress(userAddressId) {
  return request({
    url: `/api/user/userAddress/auth/delete/${userAddressId}`,
  })
}
