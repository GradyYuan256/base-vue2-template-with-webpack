const path = require('path')
const os = require("os");
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: './src/index.js',
    // output: {
    //     filename: 'js/[name].[contenthash].js', // 指定 js 输出目录
    //     path: path.resolve(__dirname, 'dist'),
    //     publicPath: '/',
    //     // assetModuleFilename: 'images/[hash][ext][query]', // 指定输出文件名（太统一了不好）
    //     clean: true, // 清空上次打包结果，这是 webpack 5 的新特性，过去要使用插件
    // },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            "@": path.resolve(__dirname, '../src')
        }
    },
    module: {
        noParse: /^(vue|vue-router|vuex)$/, // 不解析库
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            // {
            //     test: /\.(png|svg|jpe?g|gif|webp)$/i,
            //     type: 'asset/resource', // webpack5 内置的
            //     generator: {
            //         filename: 'images/[hash][ext][query]', // 将某些资源发送到指定目录
            //     }
            // },
            // {
            //     test: /\.(png|svg|jpe?g|gif|webp)$/i,
            //     type: 'asset/inline', // webpack5 内置的
            // },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include: [path.resolve(__dirname, '../src/assets/svg-icon')],
                options: {
                  symbolId: 'icon-[name]',
                //   symbolId: filePath => {
                //     console.log('***********************', path.basename(filePath))
                //     return path.basename(filePath)
                //   }
                },
            },
            {
                test: /\.(png|svg|jpe?g|gif|webp)$/i,
                type: 'asset', 
                /* 在导出一个 data URI 和发送一个单独的文件之间自动选择。
                webpack 将按照默认条件，自动地在 resource 和 inline 之间
                进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则
                会被视为 resource 模块类型。*/
                parser: {
                    dataUrlCondition: {
                        maxSize: 5 * 1024 // 5kb
                    }
                },
                generator: {
                    // filename: 'images/[name].[hash:6][ext][query]', // 将某些资源发送到指定目录
                    filename: 'images/[base]', // 将某些资源发送到指定目录
                },
                exclude: [path.resolve(__dirname, '../src/assets/svg-icon')],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                cacheDirectory: true,
                            }
                        }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                // type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 2 * 1024 // 2kb
                    }
                },
                generator: {
                    filename: 'fonts/[name][ext][query]',
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack Usage',
            template: 'index.html',
            inject: true,
        }),
        // new ESLintWebpackPlugin({
        //     // 指定检查文件的根目录
        //     context: path.resolve(__dirname, "../src"),
        //     exclude: "node_modules", // 默认值
        // }),
        new VueLoaderPlugin(),
    ],
}