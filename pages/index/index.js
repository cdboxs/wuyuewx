//index.js
//获取应用实例
const app = getApp();
const base64 = require('../utils/base64.js');
const gettoken = require('../utils/token.js');
const getSH = require('../utils/computed.js');
let that;
Page({
  data: {
    searchStatus:'none',
    urlPre: app.globalData.urlPre,
    scrollviewHeight: app.globalData.windowHeight,
    swiperHeight:'',
    currentTab:1,    //切换默认下表
    types:'',         //数据类型
    page:1,          //默认第一页数据
    dataList:[],     //列表数据

  },
  //搜索
  search(res){
    if (res.detail.value){
      wx.request({
        url: app.globalData.urlPre + '/api/getStarByParam',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          param: res.detail.value,
        },
        success: e => {
          if (e.data.code == 200 && e.data.data!=null) {        
            that.setData({
              searchList: e.data.data.info,
              searchStatus: 'block'
            });
          } else if (e.data.code == 200 && e.data.data == null){
            that.setData({
              searchList:[],
              searchStatus: 'none'
            });
            wx.showToast({
              title: '暂无' + res.detail.value+'相关信息',
              mask:true,
              icon:'none'
            })
          }

        }
      })
    }else{
      that.setData({
        searchList: [],
        searchStatus: 'none'
      });
    }
  },
  goQuotation: (e) => {
    //console.log(e);
      wx.navigateTo({
        url: '../quotation/index?stock_id=' + e.currentTarget.dataset.stock_id + '&star_id=' + e.currentTarget.dataset.star_id,
      })
   
  },

  //事件处理函数
  onLoad: function () {
   that=this;
   if (that.data.currentTab == 1) {
     let { types, page, size } = { types: that.data.currentTab, page: that.data.page, size: 7 };
     that.getData({ types, page, size });
   } else if (that.data.currentTab == 0) {
     let { types, page, size } = { types: 0, page: that.data.page, size: 7 };
     that.getMyFollowStock({ types, page, size });
   }
  },

  onShow:function(){
    let getNewToken = gettoken.getToken();
    let starInfo = wx.getStorageSync('starInfo');
    starInfo.isMaiRuUrl = '';
    wx.setStorageSync('starInfo', starInfo);

  },
  onReady:function(){
    wx.getSystemInfo({
      success: function (e) {
        getSH.getScroolH('.switch_nav').exec(function (res) {
          that.setData({
            searchH: e.windowHeight - res[0].top
          });
        })
      },
    });
  },
  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    that.data.page=that.data.page+1;
    let { types, page, size } = { types: that.data.currentTab, page: that.data.page, size:7 };
    that.getMoreData({ types, page, size });
  },
  click_nav:e=>{
    that.data.page = 1;
    that.setData({
      currentTab: e.currentTarget.dataset.current,
    });
    let { types, page, size } = { types: e.currentTarget.dataset.current, page: that.data.page, size:7 };
    if (e.currentTarget.dataset.current==1){
      that.getData({ types, page, size });
    } else if (e.currentTarget.dataset.current == 2){
      that.getData({ types, page, size });
    } else if(e.currentTarget.dataset.current == 0){
      let { types, page, size } = { types: 0, page: that.data.page, size: 7 };
      that.getMyFollowStock({ types, page, size });
    }

  },
  touch_nav:e=>{
    if (e.detail.source=="touch"){
      that.data.page = 1;
      that.setData({
        currentTab: e.detail.current
      });
      let { types, page, size } = { types: e.detail.current, page: that.data.page, size: 7 };
      if (e.detail.current == 1) {
        that.getData({ types, page, size });
      } else if (e.detail.current == 2) {
        that.getData({ types, page, size });
      } else if (e.detail.current == 0){
        let { types, page, size } = { types: 0, page: that.data.page, size: 7 };
        that.getMyFollowStock({ types, page, size });
      }
   }

  },
  getData:(...item)=>{
    wx.showLoading({
      title: '正在加载...',
      mask:true,
    })
    wx.request({
      url: app.globalData.urlPre + '/api/getStock',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: item[0].types,
        page: item[0].page,
        size: item[0].size
      },
      success: e => {
        if(e.data.code==200){
          wx.hideLoading();
          for (let val of e.data.data.list){
              val.name=val.name.substring(0,5);
          }
          that.setData({
            dataList: e.data.data.list,
            swiperHeight:e.data.data.list.length*65
          });
        }
       
      }
    })
  },
  getMoreData:(...item)=>{
    wx.showLoading({
      title: '正在加载...',
      mask: true,
    })
    if (item[0].types == 1 || item[0].types==2){
      wx.request({
        url: app.globalData.urlPre + '/api/getStock',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          type: item[0].types,
          page: item[0].page,
          size: item[0].size
        },
        success: e => {
          if (e.data.code == 200) {
            wx.hideLoading();
            if (item[0].page > e.data.data.lastPage) {
              wx.showToast({
                title: '没有更多数据...',
                mask: true,
                icon: 'none'
              });
              return;
            } else {
              let moredata = that.data.dataList;
              for (let val of e.data.data.list) {
                val.name = val.name.substring(0, 5);
                moredata.push(val);
              }
              that.setData({
                dataList: moredata,
                swiperHeight: moredata.length * 66
              });
            }
          }
        }
      })
    } else if (item[0].types == 0){
      let { types, page, size } = { types: 0, page: that.data.page, size: 7 };
      that.getMyFollowStock({ types, page, size });
    }

  },
  getMyFollowStock:(...item)=>{
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.getToken){
      wx.showLoading({
        title: '正在加载...',
        mask: true,
      })
        wx.request({
          url: app.globalData.urlPre + '/api/getMyFollowStock',
          method: 'POST',
          header: {
            'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            page: item[0].page,
            size: item[0].size,
            access_token: userInfo.getToken
          },
          success: e => {
            wx.hideLoading();
            if (item[0].page==1){
              if (e.data.code == 200 && e.data.data != null) {
                for (let val of e.data.data.list) {
                  val.name = val.name.substring(0, 5);
                }
                that.setData({
                  getMyFollowStock: e.data.data.list,
                  swiperHeight: e.data.data.list.length * 65
                });
              } else if (e.data.code == 200 && e.data.data == null) {
                that.setData({
                  getMyFollowStock: [],

                });
                wx.hideLoading();
                wx.showToast({
                  title: '暂无自选',
                  mask: true,
                  icon: 'none'
                })
              }
            } else if (item[0].page > 1){
                if (item[0].page > e.data.data.lastPage) {
                  wx.showToast({
                    title: '没有更多数据...',
                    mask: true,
                    icon: 'none'
                  });
                  return;
                } else {
                  let moredata = that.data.dataList;
                  for (let val of e.data.data.list) {
                    val.name = val.name.substring(0, 5);
                    moredata.push(val);
                  }
                  that.setData({
                    getMyFollowStock: moredata,
                    swiperHeight: moredata.length * 66
                  });
                }
            }
           

          }
        })
    }else{
      wx.showToast({
        title: '请先登录即可自选',
        mask:true,
        icon:'none',
        success:function(){
          // wx.switchTab({
          //   url: '../member/index',
          // })
        }
      })
    }

  }
 
})
