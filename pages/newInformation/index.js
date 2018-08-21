// pages/newInformation/index.js
const app = getApp();
let that;
let WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.setData({
      starId: options.starId,
      informationID:options.id
    });
   
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
    wx.showLoading({
      title: '正在加载...',
      mask: true,
    })
    wx.request({
      url: app.globalData.urlPre + '/api/getInformationByStarId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        articleId: that.data.informationID,
        starId: that.data.starId,
       
      },
      success:(e)=> {
        // console.log(e);
        wx.hideLoading();
        if (e.data.code == '200') {
          that.setData({
            information:e.data.data
          });
          var article = e.data.data.content.replace(/src="/g, 'src="https://www.wuyueapp.com/wuyue');
          WxParse.wxParse('article', 'html', article, that, 5)
        }
      }
    })
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
  
  }
})