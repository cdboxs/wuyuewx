// pages/member/assets/index.js
let that;
const app=getApp();
const base64 = require('../../utils/base64.js');
const gettoken = require('../../utils/token.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.globalData.urlPre,
    current:1,
    clickSwitchH:app.globalData.windowHeight-85,
    xqjlPages:1,
    xqjlData:[],
    cztxPages:1,
    cztxData:[]

  },
  /**
   * 切换事件
   */
  clickSwitch(e){
    that.setData({
      current: e.currentTarget.dataset.current
    });
  },
  //行权记录加载更多
  xqjlMoreData(){
    that.setData({
      xqjlPages: that.data.xqjlPages+1
    });
    wx.showLoading({
      title: '正在加载',
      mask:true,
      icon:'none'
    })
    let userInfo = wx.getStorageSync('userInfo');
    //获取行权记录
    wx.request({
      url: app.globalData.urlPre + '/api/getMyExerciseOrder',
      method: 'POST',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        page: that.data.xqjlPages,
        size: 7,
        access_token: userInfo.getToken
      },
      success: e => {
        if(e.data.code==200){
          let getOnexqjlData=that.data.xqjlData;
          if (that.data.xqjlPages > e.data.data.lastPage) {
            wx.showToast({
              title: '没有更多数据',
              mask:true,
              icon:'none'
            })
          }else{
            for(var i=0;i<e.data.data.list.length;i++){
              getOnexqjlData.push(e.data.data.list[i]);
            }
            that.setData({
              xqjlData: getOnexqjlData
            });
            setTimeout(()=>{
              wx.hideLoading();
            },600);
          }
        }
        
      }
    });
  },
  cztxMoreData(){
     //获取充值提现
    that.setData({
      cztxPages: that.data.cztxPages + 1
    });
    wx.showLoading({
      title: '正在加载',
      mask: true,
      icon: 'none'
    })
    let userInfo = wx.getStorageSync('userInfo');
   
    wx.request({
      url: app.globalData.urlPre + '/api/getMyUsersWalletLogList',
      method: 'POST',
      header: {
        'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        page: that.data.cztxPages,
        size: 7,
        access_token: userInfo.getToken
      },
      success: e => {
       
        if (e.data.code == 200) {
          let getOnecztxData = that.data.cztxData;
          if (that.data.cztxPages > e.data.data.lastPage) {
            wx.showToast({
              title: '没有更多数据',
              mask: true,
              icon: 'none'
            })
          } else {
            for (var i = 0; i < e.data.data.list.length; i++) {
              getOnecztxData.push(e.data.data.list[i]);
            }
            that.setData({
              cztxData: getOnecztxData
            });
            setTimeout(() => {
              wx.hideLoading();
            }, 600);
          }
        }

      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   that=this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.getToken) {
        wx.showLoading({
          title: '正在加载...',
          mask: true,
        })
        //获取我的资产基本数据
        wx.request({
         url: app.globalData.urlPre + '/api/getMyBalanceAndHoldWarehouse',
          method:'POST',
          header: {
            'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            access_token: userInfo.getToken
          },
          success: e => {
            wx.hideLoading();
            if(e.data.code==200){
              that.setData({
                assets: e.data.data
              });
            }
            
          }
        })
        //获取行权记录
        wx.request({
          url: app.globalData.urlPre + '/api/getMyExerciseOrder', 
          method: 'POST',
          header: {
            'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            page: 1,
            size: 7,
            access_token: userInfo.getToken
          },
          success: e => {
            that.setData({
              xqjlData: e.data.data.list
            });
              wx.hideLoading();
          }
        });
        //获充值提现记录
        wx.request({
          url: app.globalData.urlPre + '/api/getMyUsersWalletLogList',
          method: 'POST',
          header: {
            'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            page: 1,
            size: 7,
            access_token: userInfo.getToken
          },
          success: e => {
            console.log(e);
            that.setData({
              cztxData:e.data.data.list
            });
            wx.hideLoading();
          }
        });
    }
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
  
})