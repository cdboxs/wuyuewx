// pages/quotation/index.js
let that;
const app = getApp();
const base64 = require('../utils/base64.js');
const getUserInfo = require('../utils/login.js');
const quotationStar = require('../utils/starInfo.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPre: app.globalData.urlPre,
    scrollviewHeight: app.globalData.windowHeight,
    pages: 1,
    Qone: {},
    starId: '',
    stockId: '',
    threeSelected: 1,
    fourSelected: 1,
    fSelectStatus: '', //板块四 当前选中状态
    addremoveStatus: '添加自选'
  },
  exercise() {
    wx.navigateTo({
      url: '../exercise/index?starId=' + that.data.starId,
    })
  },
  starSpace() {
    wx.navigateTo({
      url: '../starSpace/index?starId=' + that.data.starId + '&price=' + that.data.Qonel.price,
    })
  },
  informationDetail(e) {
    wx.navigateTo({
      url: '../newInformation/index?id=' + e.currentTarget.dataset.id + '&starId=' + that.data.starId,
    })
  },
  mairu(){
    wx.showLoading({
      title: '正在加载',
      mask:true,
      icon:'none'
    })
    let starInfo = wx.getStorageSync('starInfo');
    wx.request({
      url: app.globalData.urlPre + '/api/getStockByParam',
      header: {

        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        type: 1,
        param: starInfo.code,

      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200 && res.data.data != null) {
          starInfo.isMaiRuUrl = res.data.data.info[0];
          wx.setStorageSync('starInfo', starInfo);
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
  
   
    setTimeout(()=>{
      wx.switchTab({
        url: '../transaction/index/index',
      })
      wx.hideLoading();
    },800);
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      starId: options.star_id,
      stockId: options.stock_id
    });

    let userInfo = wx.getStorageSync('userInfo');
    let starInfo = wx.getStorageSync('starInfo');
    if (userInfo) {
      that.addRemove();
    };
    let {
      types,
      starId,
      stockId,
      pages,
      size
    } = {
      types: 1,
      starId: that.data.starId,
      stockId: that.data.stockId,
      pages: 1,
      size: 7
    }

    quotationStar.getListData(that, {
      types,
      starId,
      stockId,
      pages,
      size
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    setTimeout(function() {
      let {
        types,
        starId,
        stockId
      } = {
        types: 3,
        starId: that.data.starId,
        stockId: that.data.stockId
      };
      quotationStar.getListData(that, {
        types,
        starId
      });
      that.getOneData({
        starId,
        stockId
      });
    }, 300);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that = this;


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
  onReachBottom: function(e) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getOneData: (...item) => {
    wx.showLoading({
      title: '正在加载...',
      mask: true,
      icon: 'none'
    })
    wx.request({
      url: app.globalData.urlPre + '/api/getStarByIdByStock',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        starId: item[0].starId,
        stockId: item[0].stockId
      },
      success: (e) => {
        console.log(e);
        if (e.data.code == 200 && e.data.data !=null) {
          wx.setNavigationBarTitle({
            title: e.data.data.name + '[' + e.data.data.code + ']',
          })
          let starInfo = wx.getStorageSync('starInfo');
          starInfo.code = e.data.data.code;
          starInfo.stockId = that.data.stockId;
          starInfo.starId = that.data.starId;
          starInfo.isMaiRuUrl = '';
          wx.setStorageSync('starInfo', starInfo);
          that.setData({
            Qonel: e.data.data
          });
          wx.hideLoading();
        }else{
          wx.showToast({
            title: '暂无此明星',
            mask:true,
            icon:'none'
          });
          setTimeout(()=>{
            wx.switchTab({
              url: '../index/index',
            })
          },1000);
          
        }
      }
    });
    wx.request({
      url: app.globalData.urlPre + '/api/getStockOrderByStockId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        starId: item[0].starId,
        stockId: item[0].stockId
      },
      success: (e) => {
        if (e.data.code == 200) {
          e.data.data.shenjia = (e.data.data.shenjia / 10000).toFixed(2);
          if (e.data.data.liutongshijian >= 10000) {
            e.data.data.liutongshijian = (e.data.data.liutongshijian / 10000) + '万秒';
          } else {
            e.data.data.liutongshijian = e.data.data.liutongshijian + '秒';
          }
          that.setData({
            Qoner: e.data.data
          });
        }
      }
    });
  },
  threeSwiper: (e) => {
    that.setData({
      threeSelected: e.currentTarget.dataset.selected
    });
  },
  fourSwiper: (e) => {
    // wx.pageScrollTo({
    //   scrollTop: app.globalData.screenHeight,
    //   duration: 1500
    // });

    that.setData({
      fourSelected: e.currentTarget.dataset.selected,
      starId: that.data.starId
    });

    let {
      types,
      starId,
      pages,
      size
    } = {
      types: e.currentTarget.dataset.selected,
      starId: that.data.starId,
      pages: 1,
      size: 7
    };
    quotationStar.getListData(that, {
      types,
      starId,
      pages,
      size
    });
  },

  /*行情详情页添加取消*/
  addRemove: () => {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.showLoading({
        title: '正在加载...',
        mask: true,
        icon: 'none'
      })
      wx.request({
        url: app.globalData.urlPre + '/api/ifAddUsersFollowStock',
        method: 'POST',
        header: {
          'Authorization': 'Basic' + base64.Base64.encode(userInfo.clientStr),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          stockId: that.data.stockId,
          access_token: userInfo.getToken
        },
        success: function(res) {
          if (res.data.code == 200) {
            if (res.data.data.is_add_flag == false) {
              setTimeout(function() {
                wx.hideLoading();
                that.setData({
                  addremoveStatus: '添加自选'
                });
              }, 800);

            } else {
              setTimeout(function() {
                wx.hideLoading();
                that.setData({
                  addremoveStatus: '取消自选'
                });
              }, 800);

            }
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      let tip = null;
      let loginStaus = getUserInfo.getUserInfo(that, tip, u);
    }

  },
  yesno: (u) => {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.request({
        url: app.globalData.urlPre + '/api/addUsersFollowStock',
        method: 'POST',
        header: {
          'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          stockId: that.data.stockId,
          access_token: userInfo.getToken
        },
        success: function(res) {
          that.addRemove();
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      let tip = 1;
      let loginStaus = getUserInfo.getUserInfo(that, tip, u);
    }

  },
  /*行情加载更多*/
  getMoreData: (...item) => {
    wx.showLoading({
      title: '正在加载...',
      mask: true,
      icon: 'none'
    })
    if (that.data.fourSelected == 2) {
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
        success: function(e) {
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
    } else if (that.data.fourSelected == 4) {
      that.data.pages = that.data.pages + 1;
      wx.request({
        url: app.globalData.urlPre + '/api/getAnnouncement',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          starId: that.data.starId,
          page: that.data.pages,
          size: 7
        },
        success: function(e) {
          if (e.data.code = 200 && e.data.data) {
            if (that.data.pages > e.data.data.lastPage) {
              wx.hideLoading();
              wx.showToast({
                title: '暂无数据',
                mask: true,
                icon: 'none'
              })
              return;
            } else {
              let getMoreList = that.data.listData;
              if (e.data.code = 200 && e.data.data) {
                for (let val of e.data.data.list) {
                  val.scrollviewHeight = that.data.scrollviewHeight;
                }
                for (let i = 0; i < e.data.data.list.length; i++) {
                  getMoreList.push(e.data.data.list[i]);
                }
                that.setData({
                  listData: getMoreList
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
          } else if (e.data.code = 200 && e.data.data == null) {
            wx.showToast({
              title: '暂无数据',
              mask: true,
              icon: 'none'
            })
          }

        }
      })
    }

  }
})