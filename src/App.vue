<template>
    <div>
        <h1 @click="handleClick">列表展示</h1>
        <img src="./assets/images/logo.png" alt="logo">
        <img src="./assets/images/avatar.jpg" alt="avatar">
        <ul>
            <li v-for="item in list">{{item}}</li>
        </ul>
        <h2>Hello World!</h2>
        <span class="iconfont icon-dots-3"></span>
        <span class="iconfont icon-close"></span>
        <article>你好，世界</article>
        <SvgIcon icon-class="plus" class="icon-plus-custom" />
        <SvgIcon icon-class="close" />
        <SvgIcon icon-class="down" class="icon-down" />
    </div>
</template>

<script>
import { getList } from './data.js'
import { say } from './utils/person.js'
// import SvgIcon from './components/SvgIcon.vue'

export default {
    data() {
        return {
            list: getList()
        };
    },
    methods: {
        handleClick() {
            say();
            import(/* webpackChunkName: "add" */ "./utils/add.js").then(res => {
                console.log(res);
                console.log(res.add(1, 2));
            });
        }
    },
    components: {  }
}
</script>

<style lang="less" scoped>
    article {
        color: red;
    }
    .icon-plus-custom {
        color: red;
    }
</style>