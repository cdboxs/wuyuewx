// pages/starSpace/index.js
let that;
const app = getApp();
const quotationStar = require('../utils/starInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPre: app.globalData.urlPre,
    pages:1,
    starId:'',
    fourSelected: 1,
    scrollviewHeight: app.globalData.windowHeight,
  },
  informationDetail(e) {
    wx.navigateTo({
      url: '../newInformation/index?id=' + e.currentTarget.dataset.id + '&starId=' + that.data.starId,
    })
  },
  fourSwiper: (e) => {
    that.setData({
      fourSelected: e.currentTarget.dataset.selected,
      starId: that.data.starId
    });

   
    if (that.data.fourSelected==1){
      let { types, starId, pages, size } = { types: 2, starId: that.data.starId, pages: 1, size: 7 };
      quotationStar.getListData(that, { types, starId, pages, size });
    } else if (that.data.fourSelected == 2){
      let { types, starId, pages, size } = { types: 3, starId: that.data.starId, pages: 1, size: 7 };
      quotationStar.getListData(that, { types, starId, pages, size });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let starInfo = wx.getStorageSync('starInfo');
    that=this;
    that.setData({
      starInfo: starInfo,
      price:options.price,
      starId:options.starId
    });
    if (that.data.fourSelected == 1) {
      let { types, starId, pages, size } = { types: 2, starId: that.data.starId, pages: 1, size: 7 };
      quotationStar.getListData(that, { types, starId, pages, size });
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
    if (that.data.fourSelected == 1) {
      wx.showLoading({
        title: '正在加载...',
        mask: true,
        icon: 'none'
      })

        that.data.pages = that.data.pages + 1;
        wx.request({
          url: app.globalData.urlPre + '/api/getInformationListByStarId',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            starId: that.data.starId,
            page: that.data.pages,
            size: 7
          },
          success: function (e) {
            if (that.data.pages > e.data.data.lastPage) {
              wx.hideLoading();
              wx.showToast({
                title: '暂无数据',
                mask: true,
                icon: 'none'
              })
              return;
            } else {
              let getMoreList = that.data.information;
              if (e.data.code = 200 && e.data.data) {
                for (let val of e.data.data.list) {
                  val.scrollviewHeight = that.data.scrollviewHeight;
                }
                for (let i = 0; i < e.data.data.list.length; i++) {
                  getMoreList.push(e.data.data.list[i]);
                }
                that.setData({
                  information: getMoreList
                });
              } else if (e.data.code = 200 && e.data.data == null) {
                wx.showToast({
                  title: '暂无数据',
                  mask: true,
                  icon: 'none'
                })
              };
              wx.hideLoading();
            }

          }
        })
      } 
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})