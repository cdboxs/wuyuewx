// pages/member/index.js
let that;
const app = new getApp();
const base64 = require('../../utils/base64.js');
const getUserInfo = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskState: true,
    width: app.globalData.windowWidth,
    height: app.globalData.windowHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          maskState: false,
          photo:res.data.photo,
          nickname: res.data.nickname
        });
      },
      fail:function(res){
        that.setData({
          maskState: true
        });
      }
    });
    let starInfo = wx.getStorageSync('starInfo');
    starInfo.isMaiRuUrl = '';
    wx.setStorageSync('starInfo', starInfo);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
   
  },
  /*
  *事件跳转
  goInformation 个人信息
  assets 我的资产
  */ 
  goInformation(){
    wx.navigateTo({
      url: '../information/index',
    })
  },
  goAssets() {
    wx.navigateTo({
      url: '../assets/index',
    })
  },
  /*
  *数据获取
  */ 
  getUserInfo:(u)=>{
    let tip=1;
    let loginStaus=getUserInfo.getUserInfo(that,tip,u);
  }
})