import Vue from 'vue'
import App from './App.vue'

import './assets/fonts/iconfont.css'
import './style/style.css'
import './style/style-1.scss'
import './style/style-2.less'

import './assets/svg-icon/index.js'
import './test/date/printDate.js'

console.log('Hello World --> ', process.env.NODE_ENV)

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
})