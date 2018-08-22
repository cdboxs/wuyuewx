// pages/exercise/index.js
const base64 = require('../utils/base64.js');
const dateTimePicker = require('../utils/dateTimePicker.js');
const quotationStar = require('../utils/starInfo.js');
const app = new getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payModelShow:false,//密码框显示
    pactStaus:'',//规则状态默认
    maskState: false,
    urlPre: app.globalData.urlPre,
    width: app.globalData.windowWidth,
    height: app.globalData.screenHeight
  },
  payPwd: function (e) {
    let that = this;
    console.log(e.detail.value);
    that.setData({
      getPwd: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    let starInfo=wx.getStorageSync('starInfo');
    starInfo.experience=starInfo.experience.substring(0,66);
    that.setData({
      starInfo: starInfo
    });
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    that.setData({
      starId: options.starId,
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
    });
    that.getExerciseList();
  },
  //判断checkbox状态
  pact:(e)=>{
    if(e.detail.value[0]=="1"){
      that.setData({
        pactStaus:true
      });
    }else{
      that.setData({
        pactStaus: false
      });
    }
  },
  //预约
  yuyue(e){
    console.log(e.currentTarget.dataset);
    that.setData({
      maskState:true,
      seconds: e.currentTarget.dataset.seconds,
      star_exercise_id: e.currentTarget.dataset.star_exercise_id
    });
  },
  hideMask(){
    that.setData({
      maskState: false
    });
    that.setData({
      focus: false,
      payModelShow: false
    });
  },
 
  //点击密码输入框调取软键盘
  showkeyboard(){
    that.setData({
      focus: true
    });
  },
  changeDateTime(e) {
    that.setData({ dateTime: e.detail.value });
  },
  changeDateTimeColumn(e) {
    console.log(e);
    var arr = that.data.dateTime, dateArr = that.data.dateTimeArray;
    console.log(dateArr[0][arr[0]]);
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    that.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  TimeChange(e) {
    that.setData({
      TimeChange: e.detail.value
    });
  },
  //预约判断
  exerciseOrder(e){
   console.log(e);
    if (e.detail.value.DateChange==""){
      wx.showToast({
        title: '请选择日期',
        mask:true,
        icon:'none'
      });
      return;
    }else if (e.detail.value.address=="") {
      wx.showToast({
        title: '请填写预约地址',
        mask: true,
        icon: 'none'
      });
      return;
    }else if (e.detail.value.userName==""){
      wx.showToast({
        title: '请填写联系人姓名',
        mask: true,
        icon: 'none'
      });
      return;
    } else if (e.detail.value.phone == ""){
      wx.showToast({
        title: '请填写电话',
        mask: true,
        icon: 'none'
      });
      return;
    } else if (that.data.pactStaus==false){
      wx.showToast({
        title: '请选择吾约见规则',
        mask: true,
        icon: 'none'
      });
      return;
    }else{
      that.setData({
        focus:true,
        payModelShow: true
      });
    
      that.setData({
        orderDetail:{
          seconds: that.data.seconds,
          star_exercise_id: that.data.star_exercise_id,
          fmDetail:e.detail.value
        }
      });
      console.log(that.data.orderDetail);
      return;
      }
  },
  //支付取消
  yyCancel() {
    that.setData({
      focus: false,
      payModelShow: false
    });
  },
  yyConfirm(e){
    //行权下单
    let starInfo = wx.getStorageSync('starInfo');
    let userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: app.globalData.urlPre + '/api/orderExercise',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        access_token: userInfo.getToken,//授权
        address: that.data.orderDetail.fmDetail.address,//预约地点
        applyDate: that.data.orderDetail.fmDetail.DateChange,//预约时间
        name: that.data.orderDetail.fmDetail.userName,//真实姓名
        phone: that.data.orderDetail.fmDetail.phone,//手机号
        pay: that.data.orderDetail.seconds,//支付秒数
        stockId: starInfo.stockId,//行情id
        starId: that.data.starId,//明星id
        starExerciseId: that.data.orderDetail.star_exercise_id,//明星行权id
        editPayThePassword: that.data.getPwd//支付密码
       
      },
      success: e => {
        console.log(e);
        if (e.data.code == '-200'){
          wx.showToast({
            title: '密码不正确！',
            mask:true,
            icon:'none'
          });
          that.setData({
            getPwd: ''
          });
          return;
        }else if (e.data.code == 200) {
          wx.hideLoading();
          for (let val of e.data.data.info) {
            val.title = val.title.substring(0, 20);
          }
          that.setData({
            ExerciseList: e.data.data.info
          });
        }

      }
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
  
  },
  //获取行权列表信息
  getExerciseList(){
    wx.request({
      url: app.globalData.urlPre + '/api/getStarExerciseByStarId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        starId: that.data.starId
      },
      success: e => {
        if (e.data.code == 200 && e.data.data != null) {
          wx.hideLoading();
          for (let val of e.data.data.info) {
            val.title = val.title.substring(0, 20);
          }
          that.setData({
            ExerciseList: e.data.data.info
          });
        } else if (e.data.code == 200 && e.data.data==null) {
          wx.showToast({
            title: '暂无行权数据',
            mask:true,
            icon:'none'
          });
          that.setData({
            ExerciseList:[]
          });
        }
      }
    })
  }
})