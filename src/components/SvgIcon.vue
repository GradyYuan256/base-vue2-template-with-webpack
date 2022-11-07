<template>
    <div v-if="hasExternalUrl" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
    <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
        <use :xlink:href="IconName"></use>
    </svg>
</template>

<script>
import '../assets/fonts/iconfont.js'

export default {
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        }
    },
    methods: {
        isExternalUrl(url) {
            return /^(https?:|mailto:|tel:)/.test(url)
        },
    },
    computed: {
        hasExternalUrl () {
            console.log(this.iconClass, this.isExternalUrl(this.iconClass))
            return this.isExternalUrl(this.iconClass)
        },
        IconName: function() {
            return `#icon-${this.iconClass}`;
        },
        svgClass: function() {
            if (this.className) {
                return `icon ${this.className}`.trim()
            } else {
                return 'icon'
            }
        },
        styleExternalIcon () {
            return {
                mask: `url(${this.iconClass}) no-repeat 50% 50%`,
                '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
            }
        }
    }
}
</script>
<style>
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
