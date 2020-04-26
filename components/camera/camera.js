Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    cameraFlag: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    // 这里是一些组件内部数据
    img: {}, // 裁剪框的节点信息
  },

  ready() {
    if(!this.data.cameraFlag) return
    this.init()
  },
  methods: {
    init(){
      // 获取裁剪框的位置
      let query = wx.createSelectorQuery().in(this)//组件中获取元素节点需要用this 不然为null
      query.select('.cropBox').boundingClientRect(rect => {
        let img = {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        }
        this.setData({
          img
        })
      }).exec()
      query.select('.camera').boundingClientRect(rect => {
        this.setData({
          cameraW: rect.width,
          cameraH: rect.height
        })
      }).exec()
    },
    // 点击拍照
    takePhoto() {
      this.init()
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.drawImage(res.tempImagePath)
        }
      })
    },
    // canvas绘图
    drawImage(url) {
      // 在组件需要绑定this or this.createSelectorQuery()
      let query = wx.createSelectorQuery().in(this)
      // 2.9.0 起支持一套新 Canvas 2D 接口（需指定 type 属性），同时支持同层渲染，原有接口不再维护。
      query.select('#myCanvas')
        .fields({
          node: true,
          size: true
        })
        .exec(res => {
          let canvas = res[0].node
          let ctx = canvas.getContext('2d')
          let dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          let img = canvas.createImage()
          img.onload = () => {
            ctx.drawImage(img, 0, 0, this.data.cameraW, this.data.cameraH)
          }
          img.src = url
          this.save(canvas)
        })
    },
    // canvas保存成图片
    save(canvas) {
      let {
        left,
        top,
        width,
        height
      } = this.data.img
      wx.canvasToTempFilePath({
        x: left,
        y: top,
        width: width,
        height: height,
        destWidth: width,
        destHeight: height,
        canvas, //这个是传入的canvas节点  旧方法中传入的是canvas-id
        success: res => {
          this.setData({
            cameraFlag:false
          })
          this.triggerEvent('transfer',res.tempFilePath )
        },
        fail: err => {
          console.log(err)
        }
      })
    },
    // 用户不允许使用摄像头时触发
    error(e) {
      wx.showModal({
        content: "需要开启摄像头权限",
        confirmText: "去打开",
        success: res => {
          if (res.confirm) {
            this.setData({
              cameraFlag: false
            })
            wx.openSetting({
              complete: (res) => {
                if (res.authSetting['scope.camera']) {
                  this.setData({
                    cameraFlag: true
                  })
                }
              },
            })
          }else{
            this.setData({
              cameraFlag:false
            })
          }
        }
      })
    },
    // 打开相册
    photos() {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: res => {
          this.setData({
            cameraFlag:false
          })
          this.triggerEvent('transfer',res.tempFilePaths[0] )
        }
      })
    },
    // 取消
    cancle(){
      this.setData({
        cameraFlag:false
      })
    }
  }
})