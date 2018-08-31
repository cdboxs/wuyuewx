// pages/transaction/mingxi/index.js
let that;
const app = new getApp();
const base64 = require('../../utils/base64.js');
const getSH = require('../../utils/computed.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollheight: app.globalData.windowHeight,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      mxid: options.mxid
    });
    getSH.getScroolH('.mxTplOneS').exec(function (res) {
      that.setData({
        getscrollH: that.data.scrollheight - res[0].top
      });
    })
    that.jrwtList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /*今日委托*/
  jrwtList(){
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.request({
        url: app.globalData.urlPre + '/api/getMyStockOrder',
        header: {
          'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          type:1,
          page:1,
          size:10,
          starTime:'2018-7-13',
          access_token: userInfo.getToken
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 200 && res.data.data != null) {
            that.setData({
              paySeachList: res.data.data.info
            });
          } else {
            wx.showToast({
              title: '暂无检测结果',
              mask: true,
              icon: 'none'
            })
          }
        },
        fail: function (res) { },
      });
    }
  } 
})