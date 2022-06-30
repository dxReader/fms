const path = require("path");
const webpack = require('webpack');
const package = require("./package.json");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const config = JSON.parse(process.env.npm_config_argv).original.slice(1);
const router = config[1] ? config[1].replace(/-/g, '') : 'tv';
// const host = process.argv.splice(2)[1] ||'/';
// const gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim() //这个是获取提交版本的记录
const SentryPlugin = require('@sentry/webpack-plugin');
  
// process.env.RELEASE_VERSION = '123' //将记录赋值给RELEASE_VERSION

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: isProduction ?
        '/tv/' :
        '/',
    outputDir: "fms",
    lintOnSave: !isProduction,
    assetsDir: "static",
    runtimeCompiler: true,
    productionSourceMap: true,
    pages: {
        index: {
            entry: "./src/main.ts",
            template: "public/index.html",
            filename: 'index.html',
            title: 'MDSP-FMS',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },

    chainWebpack: (config) => {
        config.resolve.alias.set("src", resolve("src"));
        config.plugins.delete('preload-index');
        config.plugins.delete('prefetch-index');
        config.optimization.minimize(isProduction);
        
        //提取公共(分离)插件
        config.optimization.splitChunks({
            chunks: "async",
            minSize: 1024*30,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                // 抽离自定义工具库
                elementUI: {
                    name: "chunk-elementui",
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                    priority: 2,
                    reuseExistingChunk: true,
                    enforce: true
                },
                vendors: {
                    name: "chunk-vendors",
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 3,
                    reuseExistingChunk: true,
                    enforce: true
                },
            }
        })
        
        // if (isProduction) {
        //     config.plugin("sentry").use(SentryPlugin, [{
        //         ignore: ['node_modules'],
        //         include: './fms/static/js', //上传dist文件的js
        //         configFile: './.sentryclirc', //配置文件地址
        //         release: process.env.RELEASE_VERSION, //版本号
        //         deleteAfterCompile: true,
        //         // urlPrefix: './fms/' //cdn js的代码路径前缀
        //     }])
        // }
    },

    configureWebpack: (config) => {
        if (isProduction) {
            config.output.filename = `static/js/[name].${package.version}.[hash:8].js`;
            config.output.chunkFilename = `static/js/[name].${package.version}.[hash:8].js`;

            config.plugins.push(
                // new SentryPlugin({
                //     ignore: ['node_modules'],
                //     include: './fms/static/js', //上传dist文件的js
                //     configFile: './.sentryclirc', //配置文件地址
                //     // release: 'fms@2.5.1' //版本号
                //     // deleteAfterCompile: true,
                //     // urlPrefix: './fms/' //cdn js的代码路径前缀
                // }),
                new webpack.DefinePlugin({
                    'process.env.LOCAL_URL': JSON.stringify(router),
                }),
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8,
                    deleteOriginalAssets: false
                })
                // new UglifyJsPlugin({
                //     uglifyOptions: {
                //         warnings: false,
                //         compress: {
                //             drop_console: true,
                //             drop_debugger: true,
                //             pure_funcs: ['console.log']
                //         },
                //         output:{
                //             comments: false, //去注释
                //         }
                //     },
                //     sourceMap: true,
                //     parallel: true,
                // })
            );
            config.performance = {
                maxEntrypointSize: 1024 * 500,
                maxAssetSize: 1024 * 200,
            }
        } 
    },

    // CSS 相关选项
    css: {
        extract: !isProduction, //process.env.NODE_ENV === "development",
        sourceMap: !isProduction,
        loaderOptions: {
            sass: {
                data: `@import "src/styles/theme.scss";`
            }
        }
    },

    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,

    devServer: {
        host: "0.0.0.0",
        port: 8888, // 端口号
        open: !isProduction,
        https: isProduction,
        hotOnly: true
    },

    // pwa
    pwa: {
        name: 'MDSP-FMS',
        themeColor: '#03f9fc',
        iconPaths: {
            favicon32: '',
            favicon16: ''
        }
    },

    // 第三方插件的选项
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: false,
        }
    }
};
