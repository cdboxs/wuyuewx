const base64 = require('base64.js');
function getToken(){
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo){
        wx.request({
          url: "https://www.wuyueapp.com/wuyue/oauth/token",
          header: {
            'Authorization': 'Basic ' + base64.Base64.encode(userInfo.clientStr),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            client_id: userInfo.client_id,
            client_secret: userInfo.client_secret,
            grant_type: 'client_credentials'
          },
          success: tokenData => {
            userInfo.getToken = tokenData.data.access_token;
            wx.setStorageSync('userInfo', userInfo);
          }
        });
    }
   
  }
 
 
  

module.exports={
  getToken: getToken
}