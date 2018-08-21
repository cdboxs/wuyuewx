//app.js
App({

  globalData: {
    urlPre: "https://www.wuyueapp.com/wuyue",
    appid: 'wx5a33e7802b12ebfd',
    secret: '8dd3f41b3a799b32c617ca87ee3a6e15',
    windowWidth: '',
    windowHeight: '',
    screenHeight:''

  },
  onLaunch: function() {
      let that = this;
      wx.getSystemInfo({
        success: function(res) {
          that.globalData.windowWidth = res.windowWidth;
          that.globalData.windowHeight = res.windowHeight;
          that.globalData.screenHeight = res.screenHeight;
        },
      });
  },
})