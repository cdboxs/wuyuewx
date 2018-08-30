// pages/transaction/index/index.js
let that;
const app = new getApp();
const base64 = require('../../utils/base64.js');
const getUserInfo = require('../../utils/login.js');
const getSH = require('../../utils/computed.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollheight: app.globalData.windowHeight,
    current:1,
    tablecurrent:0,
    second:0,//买入的秒数
    totalPrice:0,//买入的总价格
    addjust:'',//买入价格调整
    paySeachShow:false,//买入搜索显示状态
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
    /*scroll高度计算：买入scroll 明细scroll*/ 
    getSH.getScroolH('.maiH').exec(function (res) {
      that.setData({
        getscrollH: that.data.scrollheight - res[0].top
      });
    })
    getSH.getScroolH('.Purchase').exec(function (res) {
      console.log(res);
      console.log(res[0].height);
      that.setData({
        getscrollHt: res[0].height
      });
    })
    getSH.getScroolH('.table_nav').exec(function (res) {
      console.log( res[0].top);
      that.setData({
        getscrollHf: res[0].top
      });
    })
  /*scroll高度计算：买入scroll 明细scroll*/
 
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
  *买入
  */ 
  paySeachName(e){
    that=this;
    if (e.detail.value){
      that.setData({
        paySeachShow:true,
        second: 0
      });
      wx.request({
        url: app.globalData.urlPre + '/api/getStockByParam',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          type:1,
          param: e.detail.value
        },
        success: function (res) {
          //console.log(res)
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

    }else{
      that.setData({
        paySeachShow: false,
        second: 0
      });
    }

  },
  assginValue(e){
    that=this;
    that.setData({
      seachVal: e.currentTarget.dataset.payname.name + '[' + e.currentTarget.dataset.payname.code+']',
      payPrice: e.currentTarget.dataset.payname.new_price,
      limit_down: e.currentTarget.dataset.payname.limit_down,
      limit_up: e.currentTarget.dataset.payname.limit_up,
      paySeachShow: false
     
    });
    //五档卖
    wx.request({
      url: app.globalData.urlPre + '/api/stockOrderByPrice',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        type: 2,//1买2卖
        stockId: e.currentTarget.dataset.payname.id
      },
      success: function (res) {
        //console.log(res)
        if (res.data.code == 200 && res.data.data != null) {
          that.setData({
            wudang: res.data.data.info,
            wudangStatus: res.data.data.closing_price
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
    //五档买
    wx.request({
      url: app.globalData.urlPre + '/api/stockOrderByPrice',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        type: 1,//1买2卖
        stockId: e.currentTarget.dataset.payname.id
      },
      success: function (res) {
        //console.log(res)
        if (res.data.code == 200 && res.data.data != null) {
          that.setData({
            mai: res.data.data.info,
            maiStatus: res.data.data.closing_price
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
    //买入明细
    wx.request({
      url: app.globalData.urlPre + '/api/getTransactionSuccessList',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        pages:1,
        size:20,
        stockId: e.currentTarget.dataset.payname.id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200 && res.data.data != null) {
          that.setData({
            mxi: res.data.data.list,
            mxiH: res.data.data.list.length*16
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
  },
  addjust(e){
    let computedTotal;
    that=this;
    that.setData({
      payPrice: e.detail.value
    });
    
    computedTotal = that.data.payPrice * that.data.second;
    if (computedTotal <= 5) {
      computedTotal = computedTotal + (computedTotal * 0.01);
    } else if (computedTotal > 5) {
      computedTotal = computedTotal + (computedTotal * 0.001);
    }
    that.setData({
      totalPrice: computedTotal
    });
  },
  payJian(){
    that=this;
    if (that.data.second<=0){
     
    }else{
      that = this;
      if (that.data.second > 10000) {

      } else {
        let computedTotal;

        that.setData({
          second: parseInt(that.data.second) - 1
        });
        computedTotal = that.data.payPrice * that.data.second;
        if (computedTotal <= 5) {
          computedTotal = computedTotal + (computedTotal * 0.01);
        } else if (computedTotal > 5) {
          computedTotal = computedTotal + (computedTotal * 0.001);
        }
        console.log(computedTotal);
        that.setData({
          totalPrice: computedTotal
        });
      }
    }
    
  },
  secondChange(e){
    console.log(e.detail.value);
    that = this;
    that.setData({
      second: parseInt(e.detail.value)
    });
    if (e.detail.value > 10000) {

    } else {
      let computedTotal;
      computedTotal = that.data.payPrice * parseInt(e.detail.value);
      if (computedTotal <= 5) {
        computedTotal = computedTotal + (computedTotal * 0.01);
      } else if (computedTotal > 5) {
        computedTotal = computedTotal + (computedTotal * 0.001);
      }
      console.log(computedTotal);
      that.setData({
        totalPrice: computedTotal
      });
    }
  },
  payJia(){
    that = this;
    if (that.data.second >10000) {

    } else {
      let computedTotal;
      
      that.setData({
        second: parseInt(that.data.second) +1
      });
      computedTotal = that.data.payPrice * that.data.second;
      if (computedTotal<=5){
        computedTotal = computedTotal+(computedTotal*0.01);
      } else if (computedTotal>5){
        computedTotal = computedTotal + (computedTotal * 0.001);
      }
      console.log(computedTotal);
      that.setData({
        totalPrice: computedTotal
      });
    }
  },
  /*
  *持仓数据
  */
  ccData(){
    that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      wx.request({
        url: app.globalData.urlPre + '/api/getMyHoldWarehouseList',
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
              ccListData: res.data.data.list
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
    }else{
      wx.showToast({
        title: '请登录',
        mask:true,
        icon:'none'
      });
      setTimeout(()=>{
        wx.switchTab({
          url: '../../member/index/index',
        })
      },600);
      
    }

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
    if (userInfo) {
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
    } else {
      wx.showToast({
        title: '请登录',
        mask: true,
        icon: 'none'
      });
      setTimeout(() => {
        wx.switchTab({
          url: '../../member/index/index',
        })
      }, 600);

    }
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