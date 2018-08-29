// pages/transaction/index/index.js
let that;
const app = new getApp();
const base64 = require('../../utils/base64.js');
const getUserInfo = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollheight: app.globalData.windowHeight,
    current:1,
    tablecurrent:0,
    ccPages: 1,//持仓页码
    ccListData: [],//持仓数据
    cdPages: 1,//撤单页码
    cdListData: []//撤单数据
  },
  /**
     * 切换事件
     */
  clickSwitch(e) {
    that=this;
    that.setData({
      current: e.currentTarget.dataset.current
    });
    switch (e.currentTarget.dataset.current){
      case '1':
        break;
      case '2':
        break;
      case '3':
        that.cdData();
        break;
      case '4':
        that.ccData();
        break;
      case '5':
        break;
    }
    
  },
  //五档切换
  tableClick(e){
    that.setData({
      tablecurrent: e.currentTarget.dataset.tablecurrent
    });
  },
  tableTouch(e){
    that.setData({
      tablecurrent: e.detail.current
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;

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
  /*
  *持仓数据
  */
  ccData(){
    that = this;
    let userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.urlPre + '/api/getMyHoldWarehouseList',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        page:1,
        size:7,
        access_token: userInfo.getToken
      },
      success: function (res) {
        if (res.data.code == 200 && res.data.data!=null) {
          that.setData({
            ccListData: res.data.data.list
          });
        }else{
          wx.showToast({
            title: '暂无数据',
            mask:true,
            icon:'none'
          })
        }
      },
      fail: function (res) { },
    })
  },
  ccMoreData(){
    that.setData({
      ccPages: that.data.ccPages + 1
    });
    wx.showLoading({
      title: '正在加载',
      mask: true,
      icon: 'none'
    })
    let userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.urlPre + '/api/getMyHoldWarehouseList',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        page: that.data.ccPages,
        size: 7,
        access_token: userInfo.getToken
      },
      success: e => {
        if (e.data.code == 200) {
          let getOneData = that.data.ccListData;
          if (that.data.ccPages > e.data.data.lastPage) {
            wx.showToast({
              title: '没有更多数据',
              mask: true,
              icon: 'none'
            })
          } else {
            for (var i = 0; i < e.data.data.list.length; i++) {
              getOneData.push(e.data.data.list[i]);
            }
            that.setData({
              ccListData: getOneData
            });
            setTimeout(() => {
              wx.hideLoading();
            }, 600);
          }
        }

      }
    });
  },
  /*
 *撤单数据
 */
  cdData() {
    that = this;
    let userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.urlPre + '/api/getMyStockOrder',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        page: 1,
        size: 7,
        access_token: userInfo.getToken
      },
      success: function (res) {
        if (res.data.code == 200 && res.data.data != null) {
          that.setData({
            cdListData: res.data.data.list
          });
        } else {
          wx.showToast({
            title: '暂无数据',
            mask: true,
            icon: 'none'
          })
        }
      },
      fail: function (res) { },
    })
  },
  cdMoreData() {
    that.setData({
      cdPages: that.data.cdPages + 1
    });
    wx.showLoading({
      title: '正在加载',
      mask: true,
      icon: 'none'
    })
    let userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.urlPre + '/api/getMyStockOrder',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        page: that.data.cdPages,
        size: 7,
        access_token: userInfo.getToken
      },
      success: e => {
        if (e.data.code == 200) {
          let getOneData = that.data.cdListData;
          if (that.data.cdPages > e.data.data.lastPage) {
            wx.showToast({
              title: '没有更多数据',
              mask: true,
              icon: 'none'
            })
          } else {
            for (var i = 0; i < e.data.data.list.length; i++) {
              getOneData.push(e.data.data.list[i]);
            }
            that.setData({
              cdListData: getOneData
            });
            setTimeout(() => {
              wx.hideLoading();
            }, 600);
          }
        }

      }
    });
  }
})