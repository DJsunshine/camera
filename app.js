//app.js
App({
  globalData: {
    userInfo: null,
    isConnected: true,
    url: "https:www.xxx.com/"
  },
  onLaunch: function (options) {
    let that = this
    // 初次加载判断网络情况
    // 无网络状态下根据实际情况进行调整
    wx.getNetworkType({
      success: function (res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000,
            complete: function () {
              that.goStartIndexPage();
            }
          })
        }
      },
    })
    // 监听网络状态变化
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          duration: 2000,
          complete: function () {
            that.goStartIndexPage();
          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })

    // 在使用的页面中使用
    // const app = getApp()
    // app.request('user/user/getAvatarUrlAndNickName', 'GET', {}, 1).then()
  },
  /**
   * http请求封装
   * @param api 请求路径
   * @param method 请求方法类型
   * @param params 请求参数
   * @param flagType Content-type类型
   */
  //便捷的请求函数 可以自动登陆 应使用此函数访问接口
  request: function (api, method, params, flagType) {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (typeof (params) != "object") {
        params = {}
      }
      resolve(params)
    }).then(function (data) {
      return new Promise(function (resolve, reject) {
        getApp().get_token().then(function (token) {
          resolve(data)
        })
      })
    }).then(function (data) {
      return getApp().request_api(api, method, data, flagType)
    })
  },
  get_token: function () { //获取登陆会话
    return new Promise(function (resolve, reject) {
      var token = wx.getStorageSync("token")
      var expire = wx.getStorageSync("expire")
      //检测是否已登录

      if (token && Date.now() < expire) //会话存在且没有超时,无需登录
      {
        resolve(token)
      } else { //需要登陆
        getApp().get_wx_login_code().then(function (code) {
          return getApp().request_api("user/wechat/auth", 'POST', {
            code: code
          }, 2)
        }).then(function (data) {
          if (data.error_code == 0) {
            let token = data.data.token;
            wx.setStorageSync("token", token)
            wx.setStorageSync("expire", Date.now() + 60 * 60 * 1000)
            resolve(token)
          } else {
            reject("登陆失败：无效的code")
          }
        })
      }
    })
  },
  get_wx_login_code: function () { //获取微信登陆code
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          if (res.code) {

            resolve(res.code)
          } else {
            reject("获取登陆态失败")
          }
        },
        fail: function (err) {
          reject("登陆失败" + err)
        }
      })
    })
  },
  //基本请求函数,会自动附加API所需的APPKEY
  request_api: function (api, method, data, flagType) {
    let that = this
    let token = wx.getStorageSync('token');
    return new Promise(function (resolve, reject) {
      wx.request({
        url: getApp().globalData.url + api,
        data: data,
        method: method,
        header: {
          "Content-type": flagType == 1 ? "application/json;charset=UTF-8" : "application/x-www-form-urlencoded",
          'SDZJ-Token': token || ''
        },
        success: function (res) {
          resolve(res.data)
        },
        fail: function (err) {
          reject(err)
          that.goStartIndexPage()
        }
      })
    })
  },

  goStartIndexPage() {
    setTimeout(function () {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1]
      let route = currentPage.route;
      let query = JSON.stringify(currentPage.options);
      if (query) {
        wx.reLaunch({
          url: `/pages/networkError/networkError?route=${route}&query=${query}`,
        })
      } else {
        wx.reLaunch({
          url: `/pages/networkError/networkError?route=${route}`,
        })
      }
    }, 1000)
  }
})