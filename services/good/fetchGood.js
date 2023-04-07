import { config } from '../../config/index';
import { request } from '../../utils/request';

/** 获取商品列表 */
function mockFetchGood(ID = 0) {
  const { delay } = require('../_utils/delay');
  const { genGood } = require('../../model/good');
  return delay().then(() => genGood(ID));
}

/** 获取商品列表 */
export function fetchGood(id = 0) {
  if (!config.useMock) {
    return mockFetchGood(id);
  }
  return request({
    url: `/api/item/${id}`
  })
}
