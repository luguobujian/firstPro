//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isLog: false,
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')

    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    indicatorColor: '#96a6a6',
    indicatorActiveColor: '#f8f8f8',
    autoplay: true,
    interval: 5000,
    duration: 1000,

    sellerLocationData: '',

    latitude: "",
    longitude: "",
    currentCity: "",
    markers: [],

    oneIsShow: 0,
    oneLogo: "",
    oneName: "",
    oneAddress: "",
    oneTel: "",
    onejuli: "",
    oneLatitude: "",
    oneLongitude: "",
  },



  onLoad: function() {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    let that = this;
    wx.getStorage({
        key: 'log',
        success: function(res) {
          console.log(res.data)
          console.log(that)
          if (res.data.msg == "登录成功") {
            that.setData({
              isLog: true
            })
          } else {
            that.setData({
              isLog: false
            })
          }
        }
      }),
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
              success: function(res) {
                if (res.cancel) {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'success',
                    duration: 1000
                  })
                } else if (res.confirm) {
                  wx.openSetting({
                    success: function(dataAu) {
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        //再次授权，调用getLocationt的API
                        this.getLocation(this);
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'success',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
            this.getLocation(this);
          } else { //授权后默认加载
            this.getLocation(this);
          }
        }
      })

    this.getBannerData();
  },


  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  getLocation: (that) => {
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: (res) => {
        // console.log(res);
        that.loadCity(res.latitude, res.longitude);
        that.getSellerData(res.latitude, res.longitude)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      fail: function(res) {
        // console.log(res);
      }
    })
  },
  loadCity: function(latitude, longitude) {
    let that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=LmUqsfoEtzX3YH0Zuv5v7B664w0jytO9&location=' + latitude + ',' + longitude + '&output=json',
      success: function(res) {
        let city = res.data.result.addressComponent.city;
        that.setData({
          currentCity: city
        });
      },
      fail: function() {
        this.setData({
          currentCity: "获取定位失败"
        });
      },

    })
  },
  getBannerData: function() {
    wx.request({
      url: getApp().globalData.server + '/api/banner/lists',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        group: 1
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  swipclick: function(e) {

    console.log(this.data.swiperCurrent);

    // wx.switchTab({

    //   url: this.data.links[this.data.swiperCurrent]

    // })

  },
  getSellerData: function(y, x) {
    let that = this;
    wx.request({
      url: getApp().globalData.server + '/api/seller/nearby_seller',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        x,
        y
      },
      success: function(res) {
        // console.log(res.data)
        that.setData({
          sellerLocationData: res.data.data
        })
        let markers = [];
        for (let i = 0; i < res.data.data.length; i++) {
          let iconPath = getApp().globalData.server + res.data.data[i].logo_image;
          markers.push({
            id: res.data.data[i].id,
            latitude: res.data.data[i].y,
            longitude: res.data.data[i].x,
            width: 40,
            height: 40,
            iconPath: '../../images/icon/sn.png',
            label: {
              color: "red",
              bgColor: 'rgba(0,0,0,0)',
            },
            // logo_image: (getApp().globalData.server + res.data.data[i].logo_image),
            // name: res.data.data[i].name,
            // mobile: res.data.data[i].mobile,
            // address: res.data.data[i].address,
            // juli: res.data.data[i].juli,
            // qiye_id: res.data.data[i].qiye_id,
          })
        }

        that.setData({
          markers
        })
      }
    })
  },
  //事件处理函数
  markertap(e) {
    // console.log(e.markerId)
    // console.log(this)
    for (let i = 0; i < this.data.sellerLocationData.length; i++) {
      if (this.data.sellerLocationData[i].id == e.markerId) {
        this.setData({
          oneIsShow: 1,
          oneLogo: getApp().globalData.server + this.data.sellerLocationData[i].sellerqiye.logo_image,
          oneId: this.data.sellerLocationData[i].id,
          oneName: this.data.sellerLocationData[i].name,
          oneAddress: this.data.sellerLocationData[i].address,
          oneTel: this.data.sellerLocationData[i].mobile,
          onejuli: this.data.sellerLocationData[i].juli,
          oneLatitude: this.data.sellerLocationData[i].y,
          oneLongitude: this.data.sellerLocationData[i].x
        })
      }
    }

  },
  openSearchPage: () => {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  goHeadline: () => {
    wx.switchTab({
      url: '../headline/headline'
    })
  },
  openShopItemsPage: () => {
    wx.navigateTo({
      url: '../shopitem/shopitem'
    })
  },
  openMap: function() {
    if (this.data.isLog) {
      wx.openLocation({
        latitude: this.data.oneLatitude - 0,
        longitude: this.data.oneLongitude - 0,
        scale: 28,
        name: this.data.oneName,
        address: this.data.oneAddress
      })
    } else {
      wx.redirectTo({
        url: '../logs/logs'
      })
    }
  },
  setHideOne: function() {
    this.setData({
      oneIsShow: 0,
    })
  },
  openGetApp: () => {
    wx.navigateTo({
      url: '../getApp/getApp'
    })
  },
})