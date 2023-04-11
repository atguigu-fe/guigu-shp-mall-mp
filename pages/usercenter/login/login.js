import { featchLogin, featchRegister } from '../../../services/usercenter/fetchPerson'
import Toast from 'tdesign-miniprogram/toast/index';
const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitActive: false, // 表单是否能提交
    tips: '' ,// 表单校验错误信息
    formData: {
      password: '',
      phone: '',
    }
  },

  /**
   * input change
   */
  onInputValue(e) {
    const { item } = e.currentTarget.dataset;
    const { value = '' } = e.detail;
    this.setData(
      {
        [`formData.${item}`]: value,
      },
      () => {
        const { isLegal, tips } = this.onVerifyInputLegal();
        this.setData({
          submitActive: isLegal,
          tips
        });
      },
    );
  },
  /** 
   * 校验表单
   */
  onVerifyInputLegal() {
    const { phone, password } = this.data.formData;
    const prefixPhoneReg = String(this.properties.phoneReg || innerPhoneReg);
    const phoneRegExp = new RegExp(prefixPhoneReg);

    if (!phone || !phone.trim()) {
      return {
        isLegal: false,
        tips: '请填写手机号',
      };
    }
    if (!phoneRegExp.test(phone)) {
      return {
        isLegal: false,
        tips: '请填写正确的手机号',
      };
    }

    if (!password || !password.trim()) {
      return {
        isLegal: false,
        tips: '请填写密码',
      };
    }
    return {
      isLegal: true,
      tips: '添加成功',
    };
  },
  /**
   * 提交表单
   */
  formSubmit() {
    const { submitActive, tips } = this.data;
    if (!submitActive) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: tips,
        icon: '',
        duration: 1000,
      });
      return;
    }

    featchLogin(this.data.formData).then((res) => {
      if(res.code === 200) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '登陆成功',
          theme: 'success',
          icon: '',
          duration: 1000,
        });
        wx.setStorageSync('userInfo', res.data);
        wx.navigateBack({ delta: 1 });
      }
    })
  },
})