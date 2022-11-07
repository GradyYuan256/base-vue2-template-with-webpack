const path = require('path')
const os = require("os");
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config.js')
// const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = function(env, argv) {
    console.log('------', env, argv)
    let nodeEnv = 'production'
    if (env.development) {
        nodeEnv = 'development'
    }
    if (env.test) {
        nodeEnv = 'test'
    }
    if (env.uat) {
        nodeEnv = 'uat'
    }

    return merge(baseWebpackConfig, {
        mode: 'development',
        devtool: 'eval-cheap-source-map',
        entry: './src/index.js',
        output: {
            filename: 'js/[name].[contenthash:6].js', // 指定 js 输出目录
            path: path.resolve(__dirname, 'dist'),
            // assetModuleFilename: 'images/[hash][ext][query]', // 指定输出文件名（太统一了不好）
            clean: true, // 清空上次打包结果，这是 webpack 5 的新特性，过去要使用插件
        },
        resolve: {
            alias: {
                "utils": path.resolve(__dirname, '../src/utils')
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        // 'postcss-loader'
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader', 
                        // 'postcss-loader', // 开发模式下不需要
                        {
                            loader: 'sass-loader',
                            options: {
                                additionalData: `
                                    @import "src/style/vars.scss";
                                `, // 在每个文件开头加上这一句话
                                sassOptions: {
                                    includePaths: [__dirname] // 基于当前目录寻找 src 目录
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.less$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        // 'postcss-loader',
                        'less-loader'
                    ],
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
                // {
                //     test: /\.(png|svg|jpe?g|gif|webp)$/i,
                //     type: 'asset', 
                //     /* 在导出一个 data URI 和发送一个单独的文件之间自动选择。
                //     webpack 将按照默认条件，自动地在 resource 和 inline 之间
                //     进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则
                //     会被视为 resource 模块类型。*/
                //     parser: {
                //         dataUrlCondition: {
                //             maxSize: 5 * 1024 // 5kb
                //         }
                //     },
                //     generator: {
                //         filename: 'images/[name].[hash:6][ext][query]', // 将某些资源发送到指定目录
                //     }
                // },
                // {
                //     test: /\.m?js$/,
                //     exclude: /node_modules/,
                //     use: [
                //             {
                //                 loader: 'babel-loader',
                //                 options: {
                //                     presets: ['@babel/preset-env'],
                //                     cacheDirectory: true,
                //                 }
                //             }
                //     ]
                // },
                // {
                //     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                //     // type: 'asset',
                //     parser: {
                //         dataUrlCondition: {
                //             maxSize: 2 * 1024 // 4kb
                //         }
                //     },
                //     generator: {
                //         filename: 'fonts/[name][ext][query]',
                //     },
                // },
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development'),
            }),
            // new ESLintWebpackPlugin({
            //     // 指定检查文件的根目录
            //     context: path.resolve(__dirname, "../src"),
            //     exclude: "node_modules", // 默认值
            // }),
        ],
        optimization: {
            // emitOnErrors 在编译时每当有错误时，就会发送静态资源
            // 这样可以确保出错的静态资源被发送出来。关键错误会被发送到生成的代码中，并会在运行时报错。
            emitOnErrors: true, // 如果出现图片不存在就会报错
            nodeEnv: false, // 是否使用node模块，false的话如果有模块中使用到node模块需要手动npm 安装指定模块
        },
        devServer: {
            // static: './dist',
            host: 'localhost',
            port: '3001',
            open: true, // 自动打开浏览器
            hot: true,
            // compress: true, // 压缩
            allowedHosts: 'all', // 允许所有来源域
            client: {
                progress: false, // 将运行进度输出到控制台
                overlay: { warnings: false, errors: true }, // 全屏显示错误信息
            },
            // 刷新以后默认加载静态文件，防止在路由地址上刷新404，出现资源不存在问题
            historyApiFallback: { 
                rewrites: [
                  {
                    from: /.*/g,
                    to: '/index.html', // 如果需要 404 页面，就写上
                  },
                ],
            },
        },
        cache: {
            type: 'filesystem',
            buildDependencies: {
              config: [__filename], // 针对构建的额外代码依赖的数组对象。webpack 将使用这些项和所有依赖项的哈希值来使文件系统缓存失效。
            },
            cacheDirectory: path.resolve(__dirname, '../temp_cache'),
            name: 'scf-cache', // 路径temp_cache/scf-cache
            compression: 'gzip',
        },
    })
}