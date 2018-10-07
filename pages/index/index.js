//index.js
//获取应用实例
const app = getApp()

Page({
  shangchuan() {
    wx.chooseImage({
      success: (res) => {
        console.log(res)
        console.log(app)
        let token = app.globalData.token
        wx.uploadFile({
          url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
          filePath: res.tempFilePaths[0],
          name: "file",
          success: res => {
            alert(res);
          }
        });
      }
    })
  },
  onLoad: function () {

  },
  bindGetUserInfo(res) {
    console.log(res)
    if(res.detail.userInfo) {
      //用户点击了授权
      console.log(app)
      app.getSensi
    }else {
      //用户点击了取消
    }
  }
})
