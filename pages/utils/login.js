/**
  * 方法封装
  * 
  * */
const base64 = require('base64.js');

function getUserInfo(that,tip,u){

  wx.showLoading({
    title: '正在加载...',
    mask: true
  })
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        var userInfo = {
          nickname: u.detail.userInfo.nickName,
          photo: u.detail.userInfo.avatarUrl,
          openId: '',
          getToken: ''
        };
        wx.login({
          success: res => {
            wx.request({
              url: 'https://www.wuyueapp.com/wuyue/api/wxchart/auth',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                code: res.code
              },
              success: (e) => {
                userInfo.openId = e.data.openid;
                wx.request({
                  url:"https://www.wuyueapp.com/wuyue/api/registerWeChat",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    nickname: userInfo.nickName,
                    photo: userInfo.avatarUrl,
                    openId: userInfo.openId
                  },
                  method: 'POST',
                  success: weChatRes => {
                    let clientStr = weChatRes.data.data.client_id + ":" + weChatRes.data.data.client_secret;
                    wx.request({
                      url:  "https://www.wuyueapp.com/wuyue/oauth/token",
                      header: {
                        'Authorization': 'Basic ' + base64.Base64.encode(clientStr),
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      data: {
                        client_id: weChatRes.data.data.client_id,
                        client_secret: weChatRes.data.data.client_secret,
                        grant_type: 'client_credentials'
                      },
                      success: tokenData => {
                        userInfo.getToken = tokenData.data.access_token;
                        userInfo.client_id= weChatRes.data.data.client_id
                        userInfo.client_secret= weChatRes.data.data.client_secret
                        userInfo.clientStr = clientStr;
                        wx.setStorageSync('userInfo', userInfo);
                        wx.hideLoading();
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          mask: true,
                          success(){
                            if(tip==1){
                              that.setData({
                                maskState: false,
                                photo: userInfo.photo,
                                nickname: userInfo.nickname
                              });
                            }
                           
                          }
                        });
                      }
                    });
                  }
                });
              },
              fail: e => {
                wx.showToast({
                  title: '授权失败，请重新授权',
                  icon: 'none',
                  mask: true
                });
              }
            })
          }
        })
      } else {
        wx.showToast({
          title: '授权失败，请重新授权',
          icon: 'none',
          mask: true
        });
        return;
      }
    }
  })
  return { loginStatus: u};
}
module.exports={
  getUserInfo:getUserInfo
}