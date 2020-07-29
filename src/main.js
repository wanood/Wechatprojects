import Vue from 'vue'
import App from './App'
import request from "./utils/request"; //导入
Vue.config.productionTip = false
Vue.prototype.request = request //挂载
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()