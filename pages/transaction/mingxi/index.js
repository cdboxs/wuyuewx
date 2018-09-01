// pages/transaction/mingxi/index.js
let that;
const app = new getApp();
const base64 = require('../../utils/base64.js');
const getSH = require('../../utils/computed.js');
const getDatas=require('mxData.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jrwtPages:1,
    jrcjPages:1,
    lswtPages:1,
    lscjPages:1,
    scrollheight: app.globalData.screenHeight,
    
  },
  startDate(e){
    that.setData({
      startDate: e.detail.value
    });
    if (e.detail.value && that.data.mxid==3){
      that.lswtList();
    } else if (e.detail.value && that.data.mxid == 4) {
      that.lscjList();
    }
  },
  endDate(e) {
    that.setData({
      endDate: e.detail.value
    });
    if (e.detail.value && that.data.mxid == 3) {
      that.lswtList();
    } else if (e.detail.value && that.data.mxid == 4) {
      that.lscjList();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    that=this;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    that.setData({
      mxid: options.mxid,
      nowDate:year + "-" + month + "-" + day
    });
    switch (options.mxid) {
      case '1':
        that.jrwtList();
        break;
      case '2':
        that.jrcjList();
        break;
      case '3':
        that.lswtList();
        break;
      case '4':
        that.lscjList();
        break;
   
    }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: function (e) {
        getSH.getScroolH('.mxTplOneNav').exec(function (res) {
          that.setData({
            getscrollH: e.windowHeight - res[0].height
          });
        })
        getSH.getScroolH('.jyData').exec(function (res) {
          that.setData({
            getscrolllisH: e.windowHeight - res[0].top
          });
        })
      },
    });
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
          starTime: that.data.nowDate,
          access_token: userInfo.getToken
        },
        success: function (res) {
          if (res.data.code == 200 && res.data.data != null) {
            that.setData({
               jrwt: res.data.data.list
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
      });
    }
  },
  jrwtMoreData() {
    that.setData({
      jrwtPages: that.data.jrwtPages + 1
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
        type: 1,
        page: that.data.jrwtPages,
        size: 10,
        starTime: that.data.nowDate,
        access_token: userInfo.getToken
      },
      success: e => {
        if (e.data.code == 200) {
          let getOneData = that.data.jrwt;
          if (that.data.jrwtPages > e.data.data.lastPage) {
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
              jrwt: getOneData
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
  *当日成交
  */ 
  jrcjList() {

    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.request({
        url: app.globalData.urlPre + '/api/getMyTransactionOrderSuccessList',
        header: {
          'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          type: 1,
          page: 1,
          size: 10,
          starTime: that.data.nowDate,
          access_token: userInfo.getToken
        },
        success: function (res) {
          if (res.data.code == 200 && res.data.data != null) {
            that.setData({
              jrcj: res.data.data.list
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
      });
    }
  },
  jrcjMoreData() {
    that.setData({
      jrcjPages: that.data.jrcjPages + 1
    });
    wx.showLoading({
      title: '正在加载',
      mask: true,
      icon: 'none'
    })
    let userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.urlPre + '/api/getMyTransactionOrderSuccessList',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        type: 1,
        page: that.data.jrcjPages,
        size: 10,
        starTime: that.data.nowDate,
        access_token: userInfo.getToken
      },
      success: e => {
        if (e.data.code == 200) {
          let getOneData = that.data.jrcj;
          if (that.data.jrcjPages > e.data.data.lastPage) {
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
              jrcj: getOneData
            });
            setTimeout(() => {
              wx.hideLoading();
            }, 600);
          }
        }

      }
    });
  },
  /*历史委托*/
  lswtList() {

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
          type: 2,
          page: 1,
          size: 10,
          starTime: that.data.startDate,
          endTime: that.data.endDate,
          access_token: userInfo.getToken
        },
        success: function (res) {
          if (res.data.code == 200 && res.data.data != null) {
            that.setData({
              lswt: res.data.data.list
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
      });
    }
  },
  lswtMoreData() {
    that.setData({
      lswtPages: that.data.lswtPages + 1
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
        type: 1,
        page: that.data.lswtPages,
        size: 10,
        starTime: that.data.startDate,
        endTime: that.data.endDate,
        access_token: userInfo.getToken
      },
      success: e => {
        if (e.data.code == 200) {
          let getOneData = that.data.lswt;
          if (that.data.lswtPages > e.data.data.lastPage) {
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
              lswt: getOneData
            });
            setTimeout(() => {
              wx.hideLoading();
            }, 600);
          }
        }

      }
    });
  },
  /*历史成交*/
  lscjList() {

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
          type: 2,
          page: 1,
          size: 10,
          starTime: that.data.startDate,
          endTime: that.data.endDate,
          access_token: userInfo.getToken
        },
        success: function (res) {
          if (res.data.code == 200 && res.data.data != null) {
            that.setData({
              lscj: res.data.data.list
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
      });
    }
  },
  lscjMoreData() {
    that.setData({
      lscjPages: that.data.lscjPages + 1
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
        type: 1,
        page: that.data.lscjPages,
        size: 10,
        starTime: that.data.startDate,
        endTime: that.data.endDate,
        access_token: userInfo.getToken
      },
      success: e => {
        if (e.data.code == 200) {
          let getOneData = that.data.lscj;
          if (that.data.lscjPages > e.data.data.lastPage) {
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
              lscj: getOneData
            });
            setTimeout(() => {
              wx.hideLoading();
            }, 600);
          }
        }

      }
    });
  },
})