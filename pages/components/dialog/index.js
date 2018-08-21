// pages/components/dialog/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  data: {
    getPwd: ''
  },
  properties:{
    focus:{
      type: 'Boolean',
      value: ''
    }
    
  },
  methods:{
    payPwd: function (e) {
      let that = this;
      console.log(e.detail.value);
      that.setData({
        getPwd: e.detail.value
      });

    },
  }
});
