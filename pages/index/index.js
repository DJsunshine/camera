// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    normalPositive: "/img/positive.png", //默认照片
    normalNegative: "/img/negative.png",
    obtainFlag: false,
    reverseFlag: false
  },

  photograph_direct() {
    this.setData({
      obtainFlag: true
    })
  },
  photograph_obverse(){
    this.setData({
      reverseFlag: true
    })
  },
  // 正面
  obtain(e) {
    this.setData({
      normalPositive: e.detail,
      // cameraFlag:false
    })
    console.log(e.detail)
  },
  // 反面
  reverse(e) {
    this.setData({
      normalNegative: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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