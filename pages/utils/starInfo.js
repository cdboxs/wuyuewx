const app = getApp();
function getListData(that,...item){
  if (item[0].types == 4) {
    wx.request({
      url: app.globalData.urlPre + '/api/getAnnouncement',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        starId: item[0].starId,
        page: item[0].pages,
        size: item[0].size
      },
      success: function (e) {
        if (e.data.code = 200 && e.data.data) {
          for (let val of e.data.data.list) {
            val.scrollviewHeight = that.data.scrollviewHeight;
          }
          that.setData({
            listData: e.data.data.list
          });
        } else if (e.data.code = 200 && e.data.data == null) {
          wx.showToast({
            title: '暂无数据',
            mask: true,
            icon: 'none'
          })
        }
      }
    })
  } else if (item[0].types == 3) {
    wx.request({
      url: app.globalData.urlPre + '/api/getExclusiveStarById',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        starId: item[0].starId
      },
      success: function (e) {
        if (e.data.code = 200 && e.data.data) {
          wx.setStorageSync('starInfo', e.data.data);
        
          that.setData({
            Personal: e.data.data
          });
        } else if (e.data.code = 200 && e.data.data == null) {
          wx.showToast({
            title: '暂无数据',
            mask: true,
            icon: 'none'
          })
        }
      }
    })
  } else if (item[0].types == 2) {
    wx.request({
      url: app.globalData.urlPre + '/api/getInformationListByStarId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        starId: item[0].starId,
        page: item[0].pages,
        size: item[0].size
      },
      success: function (e) {
        if (e.data.code = 200 && e.data.data) {
          that.setData({
            information: e.data.data.list
          });
        } else if (e.data.code = 200 && e.data.data == null) {
          wx.showToast({
            title: '暂无数据',
            mask: true,
            icon: 'none'
          })
        }
      }
    })
  } else if (item[0].types == 1) {
    wx.request({
      url: app.globalData.urlPre + '/api/getForumTalkList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        starId: item[0].starId,
        Page: item[0].pages,
        Sieze: item[0].size
      },
      success: function (e) {
        if (e.data.code = 200 && e.data.data) {
          that.setData({
            forum: e.data.data.list
          });
        } else if (e.data.code = 200 && e.data.data == null) {
          // wx.showToast({
          //   title: '暂无数据',
          //   mask: true,
          //   icon: 'none'
          // })
        }
      }
    })
  }
}

module.exports={
  getListData: getListData
}