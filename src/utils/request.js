//es6  promise 微信小程序的api的铺垫， 封装自己的异步请求
//export导出后，在mian.js中引入，将其挂载在vue的原型上，在页面（如home/index.vue）中通过this.request来请求代码
export default (params) => {

    //加载中
    uni.showLoading({
        title: "加载中"
    })

    return new Promise((resolve, reject) => {

        wx.request({
            ...params,
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            },
            complete() {
                uni.hideLoading();
            }
        })

    })
}