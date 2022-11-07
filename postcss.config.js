module.exports = {
    plugins: [
        require('autoprefixer'), // 添加前缀，需要在package.json 配置 browserslist
        require('cssnano'), // 压缩css
    ]
}