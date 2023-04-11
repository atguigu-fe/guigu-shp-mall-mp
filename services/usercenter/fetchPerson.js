import { config } from '../../config/index';
import { request } from '../../utils/request';
/** 获取个人中心信息 */
function mockFetchPerson() {
  const { delay } = require('../_utils/delay');
  const { genSimpleUserInfo } = require('../../model/usercenter');
  const { genAddress } = require('../../model/address');
  const address = genAddress();
  return delay().then(() => ({
    ...genSimpleUserInfo(),
    address: {
      provinceName: address.provinceName,
      provinceCode: address.provinceCode,
      cityName: address.cityName,
      cityCode: address.cityCode,
    },
  }));
}

/** 获取个人中心信息 */
export function fetchPerson() {
  if (config.useMock) {
    return mockFetchPerson();
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 注册 */
export function featchRegister(data) {
  return request({
    url: '/api/user/passport/register',
    method: 'POST',
    data
  })
}
/** 登陆 */
export function featchLogin(data) {
  return request({
    url: '/api/user/passport/login',
    method: 'POST',
    data
  })
}

/** 退出登陆 */
export function featchLogout() {
  return request({
    url: '/api/user/passport/logout',
  })
}
