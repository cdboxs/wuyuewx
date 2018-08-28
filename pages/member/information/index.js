// pages/member/information/index.js
let that;
const app = new getApp();
const base64 = require('../../utils/base64.js');
const getUserInfo = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },
  ueditorUserInfo(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    let userInfo = wx.getStorageSync('userInfo');
    wx.setNavigationBarTitle({
      title: '个人信息',
    });
    wx.request({
      url: app.globalData.urlPre +'/api/info',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      data:{
        access_token: userInfo.getToken
      },
      success: function(res) {
        console.log(res);
        if(res.data.code){
          that.setData({
            userInfo: res.data.data.UsersInfoList,
            userName: res.data.data.usersName
          });
        }
      },
      fail: function(res) {},
    })
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
  
  }
})