import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'// svg component

// register globally
Vue.component('SvgIcon', SvgIcon)

//第一个参数表示相对的文件目录，第二个参数表示是否包括子目录中的文件，第三个参数表示引入的文件匹配的正则表达式
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
    console.log('&&&&&&&&&&&&&&', requireContext.keys().map(requireContext))
    return requireContext.keys().map(requireContext)
}
requireAll(req)
