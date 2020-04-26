// pages/refresh/refresh.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let str = '';
    let url;
    let route = options.route
    if (options.query) {
      let a = JSON.parse(options.query);
      let arr = Object.keys(a)
      for (let i in arr) {
        let index = arr[i];
        str = str + `${arr[i]}=${a[index]}&`
      }
      let parameter = str.substring(0, str.length - 1);
      url = `../../${route}?${parameter}`;
    } else {
      url = `../../${route}`
    }
    this.setData({
      url: url
    })
  },
  refresh() {
    if (app.globalData.isConnected) {
      let url = this.data.url
      wx.reLaunch({
        url: url
      })
    } else {
      wx.showToast({
        title: '当前网络异常',
        icon: 'loading',
        duration: 1000,
      })
    }
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
  // onShareAppMessage: function () {

  // }
})