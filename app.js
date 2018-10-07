//app.js
import { 
  _GetSessionKey, 
  _GetSensitiveInfo, 
  _WxappLogin,
  _SetToken
} from './utils/request'
App({
  onLaunch: function() {
    // 当打开app时需先判断当前登录态是否已过期
    wx.checkSession({
      success: () => {
        //未过期
        this.wxappLogin();
        // this.wxLoginApi();
      },
      fail: () => {
        //已过期
        this.wxLoginApi();
      }
    });
    // 获取用户信
  },
  wxLoginApi() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // this.getSessionKey(res.code);
        this.getSessionKey(res.code);
      }
    });
  },
  getSessionKey(code) {
    _GetSessionKey({code}).then(res => {
      if (res.data.errno === 0) {
        wx.setStorageSync("sessionKey", res.data.data.session_key);
        this.getSensitiveInfo();
      }
    });
  },
  getSensitiveInfo() {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          let sessionKey = wx.getStorageSync("sessionKey");

          wx.getUserInfo({
            success: res => {
              _GetSensitiveInfo({
                sessionKey,
                encryptedData: res.encryptedData,
                ivStr: res.iv
              }).then(res => {
                if(res.data.errno === 0) {
                  wx.setStorageSync("userInfo", res.data.data);
                  this.wxappLogin();
                }
              })
            }
          });
        }
      }
    });
  },
  wxappLogin(data) {
    let userInfo = JSON.parse(wx.getStorageSync("userInfo"));
    _WxappLogin({
      openid: userInfo.openId,
      gender: userInfo.gender,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    }).then( res => {
      if (res.data.errno === 0) {
        this.globalData.userInfo = res.data.data.userInfo;
        _SetToken(res.data.data.token)
      }
    })
  },
  globalData: {
    userInfo: null,
  }
});
