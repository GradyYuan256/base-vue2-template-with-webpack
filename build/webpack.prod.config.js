const path = require('path')
const os = require("os");
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
// const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const threads = os.cpus().length - 1; // cpu核数

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
        mode: 'production',
        devtool: 'source-map',
        entry: './src/index.js',
        output: {
            // filename: '[name].[contenthash].js',
            filename: 'js/[name].[contenthash:9].js', // 指定 js 输出目录
            chunkFilename: 'js/[name].chunk.[contenthash:9].js',
            path: path.resolve(__dirname, '../dist'),
            publicPath: '/',
            // assetModuleFilename: 'images/[hash][ext][query]', // 统一指定输出文件名（可用于图片、字体等等）
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
                        MiniCssExtractPlugin.loader,
                        // 'style-loader',
                        'css-loader',
                        'postcss-loader'
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // 'style-loader',
                        'css-loader', 
                        'postcss-loader',
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
                        MiniCssExtractPlugin.loader,
                        // 'style-loader',
                        'css-loader',
                        'postcss-loader',
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
                //             // {
                //             //     loader: "thread-loader", // 开启多进程
                //             //     options: {
                //             //         workers: threads, // 数量
                //             //     },
                //             // },
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
            // DefinePlugin 允许你创建可在编译时配置的全局常量。
            // 这对需要再开发环境构建和生产环境构建之间产生不同行为来说非常有用。
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            }),
            // new ESLintWebpackPlugin({
            //     // 指定检查文件的根目录
            //     context: path.resolve(__dirname, "../src"),
            //     exclude: "node_modules", // 默认值
            // }),
            // 抽离 css 成文件
            new MiniCssExtractPlugin({
                filename: 'css/[contenthash:8].css',
                chunkFilename: "css/[contenthash:8].chunk.css",
            }),
            // 迁移静态资源
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../static'),
                        to: 'static',
                    }
                ]
            }),
            // 开启gzip压缩
            // new CompressionWebpackPlugin({
            //     algorithm: 'gzip',
            //     test: new RegExp(
            //         '\\.(' +
            //         ['js', 'css'].join('|') +
            //         ')$'
            //     ),
            //     threshold: 10240,
            //     minRatio: 0.8
            // }),
            // new BundleAnalyzerPlugin()
        ],
        optimization: {
            emitOnErrors: true, // 如果出现图片不存在就会报错
            // chunk拆分
            splitChunks: {
                name: 'vendor',
                // 单文件入口使用下面这个字段足够了
                chunks: 'all', // 三个枚举值： async 异步加载导入的模块 import('module').then() ; initial 直接import导入的模块 ; all 包含上述两种情况
                // enforceSizeThreshold: 50000, // 当chunk的大小超过此值将强制拆分
                // 各个字段都是默认的
                // minSize: 20000, // 分割代码最小的大小，生成chunk最小的大小 20kb
                // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
                // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
                // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
                // maxInitialRequests: 30, // 入口js文件最大并行请求数量
                // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
                // cacheGroups: { // 组，哪些模块要打包到一个组
                //   defaultVendors: { // 组名
                //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
                //     priority: -10, // 权重（越大越高）
                //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
                //   },
                //   // 默认的可用于 多入口引用公共代码进行打包
                //   default: { // 其他没有写的配置会使用上面的默认值
                //     minSize: 0,
                //     minChunks: 2, // 这里的minChunks权重比外层的更大，至少有2个入口文件引用公共代码
                //     priority: -20,
                //     reuseExistingChunk: true,
                //   },
                // },
            },
            // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩。
            minimize: true, 
            minimizer: [
                // css压缩也可以写到optimization.minimizer里面，效果一样的
                // new CssMinimizerPlugin(), // 可以不需要，要 cssnano
                // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
                new TerserPlugin({
                    // parallel: threads, // 开启多进程
                })
            ],
            // tree shaking
            usedExports: true,
            // 提取runtime文件
            runtimeChunk: 'single',
            // runtimeChunk: {
            //     name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
            // },
        },
    })
}