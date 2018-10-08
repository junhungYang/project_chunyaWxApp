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
  onShow(data) {
    console.log(data)
  },
  wxLoginApi() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.getSessionKey(res.code);
      }
    });
  },
  getSessionKey(code) {
    _GetSessionKey({code})
    .then(data => {
        wx.setStorageSync("sessionKey", data.session_key);
        this.getSensitiveInfo();
      }).catch(msg => this.showMod(msg))
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
              }).then(data => {
                  wx.setStorageSync("userInfo", data);
                  this.wxappLogin();
              }).catch(msg => this.showMod(msg))
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
    }).then( data => {
        this.globalData.userInfo = data.userInfo;
        _SetToken(data.token)
    }).catch( msg => this.showMod(msg))
  },
  showMod(msg) {
    wx.showModal({
      title: 'Error',
      content: msg
    })
  },
  globalData: {
    userInfo: null,
  }
});
