// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLog: false,
    isShow: false,
    name: "",
    thisCard: "",
    avartar: "",
    thisCard_logo: "",
    thisCard_img: "",
    thisCard01: "",
    thisCard02: "",
    thisCard03: "",
    thisCard04: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(that)
    wx.getStorage({
      key: 'log',
      success: function(res) {
        console.log(res.data)
        console.log(that)
        if (res.data.msg == "登录成功") {
          that.setData({
            isLog: true,
            name: res.data.data.userinfo.name,
            thisCard: res.data.data.userinfo.ucard,
            avartar: getApp().globalData.server + res.data.data.userinfo.hand_image,
            thisCard_logo: getApp().globalData.server + res.data.data.userinfo.idcard1_image,
            thisCard_img: getApp().globalData.server + res.data.data.userinfo.idcard2_image,
            thisCard01: res.data.data.userinfo.ucard.substring(0, 4),
            thisCard02: res.data.data.userinfo.ucard.substring(4, 8),
            thisCard03: res.data.data.userinfo.ucard.substring(8, 12),
            thisCard04: res.data.data.userinfo.ucard.substring(12, 16),
          })
        } else {
          that.setData({
            isLog: false
          })
          wx.redirectTo({
            url: '../logs/logs'
          })
        }
      },
      fail: function(res) {
        that.setData({
          isLog: false
        })
        wx.redirectTo({
          url: '../logs/logs'
        })
      }
    })
  },
  showUCard: function() {
    if (this.data.isShow) {
      this.setData({
        isShow: false
      })
    } else {
      this.setData({
        isShow: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})