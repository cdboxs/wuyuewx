// pages/transaction/index/index.js
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:1,
    tablecurrent:0
  },
  /**
     * 切换事件
     */
  clickSwitch(e) {
    that.setData({
      current: e.currentTarget.dataset.current
    });
  },
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
  
  }
})