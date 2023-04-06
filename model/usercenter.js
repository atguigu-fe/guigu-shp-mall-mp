const userInfo = {
  avatarUrl:
    'https://file.sheepjs.com/static/img/shop/default_avatar.png',
  nickName: '尚硅谷',
  phoneNumber: '13438358888',
  gender: 2,
};
const countsData = [
  {
    num: 0,
    name: '积分',
    type: 'point',
  },
  {
    num: 10,
    name: '优惠券',
    type: 'coupon',
  },
];

const orderTagInfos = [
  {
    orderNum: 1,
    tabType: 5,
  },
  {
    orderNum: 1,
    tabType: 10,
  },
  {
    orderNum: 1,
    tabType: 40,
  },
  {
    orderNum: 0,
    tabType: 0,
  },
];

const customerServiceInfo = {
  servicePhone: '13381100972',
  serviceTimeDuration: '每周一至周五 9:00-12:00  13:00-18:00',
};

export const genSimpleUserInfo = () => ({ ...userInfo });

export const genUsercenter = () => ({
  userInfo,
  countsData,
  orderTagInfos,
  customerServiceInfo,
});
