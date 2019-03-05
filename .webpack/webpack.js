const os = require("os");
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const pkg = require('../package.json');
const resolve = dir => path.resolve(process.cwd(), dir);
let webpackConfig = {};

try {
    webpackConfig = require('../.webpack.config.js');
} catch (e) {
}

const env = process.env.NODE_ENV;
const threadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const PATH_NODE_MODULES = resolve('node_modules');
console.info(PATH_NODE_MODULES);
const chunkhash = env === 'development' ? 'hash' : 'chunkhash';
const contenthash = env === 'development' ? 'hash' : 'contenthash';
const seen = new Set();
const nameLength = 4;
// 默认配置项
const defaultConfig = {
    extensions: ['.js', '.jsx'],
    outputPath: resolve('../dist'),
    htmlTemplate: resolve('../public/index.html'),
    entry:  {
        [pkg.name]: ['@babel/polyfill', resolve('../src/index.js')]
    },
    copy: [{
        from: resolve('../static'),
        to: resolve('../dist/static'),
        ignore: ['html/*', '.DS_Store'],
    }],
};
// 打包配置
const packConfig = {
    // 入口
    entry: webpackConfig.entry || defaultConfig.entry,
    // 输出
    output: {
        path: webpackConfig.outputPath || defaultConfig.outputPath,
        filename: `[name].min.js?[${chunkhash}:8]`,
        chunkFilename: `[name].min.js?[${chunkhash}:8]`,
        publicPath: webpackConfig.publicPath || '/',
    },
    mode: env , //'production' ||
    devtool: 'none',
};
packConfig.module = {
    rules: [
        // eslint检查
        {
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            use: [{
                loader: 'eslint-loader'
            }],
            exclude: [PATH_NODE_MODULES]
        },

        // 转化ES6语法
        {
            test: /\.jsx?$/,
            use: [{
                loader: 'happypack/loader?id=babel',
            }],
            exclude: [PATH_NODE_MODULES],
        },
        // 编译css并自动添加css前缀
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css'],
        },
        // less文件编译
        {
            test: /\.less$/,
            exclude: [/node_modules/, resolve('package/back-ui/component')],
            use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=less'],
        },
        // less node-moudle 文件编译
        {
            test: /\.less$/,
            include: [/node_modules/, resolve('package/back-ui/component')],
            use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=nodeless'],
        },
        // 图片转化，小于8k自动转化成base64编码
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            loader: 'url-loader',
            options: {
                limit: 11920,
                // name: `images/${pkg.name}.[ext]`,
                outputPath: "images"
            },
        },
        {
            test: /\.md$/,
            loader: 'raw-loader',
          },
    ],
};
// 重命名
packConfig.resolve = {
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: webpackConfig.extensions || defaultConfig.extensions,
    alias: {
        '@View': path.resolve('./src/core/View.jsx'),
    },
};
// 插件
packConfig.plugins = [
    new HappyPack({
        id: 'babel',
        threadPool: threadPool,
        loaders: [{
            path: 'babel-loader',
            options: { cacheDirectory: true },
        }],
    }),
    new HappyPack({
        id: 'css',
        threadPool: threadPool,
        loaders: [{
            loader: 'css-loader',
            options: {
                minimize: true,
            },
        }],
    }),
    new HappyPack({
        id: 'nodeless',
        threadPool: threadPool,
        loaders: [
            {
                loader: 'css-loader',
                options: {
                    minimize: true,
                },
            }, {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true,
                    modifyVars: webpackConfig.theme || {},
                },
            },
        ],
    }),
    new HappyPack({
        id: 'less',
        threadPool: threadPool,
        loaders: [
            {
                loader: 'css-loader',
                options: {
                    minimize: true,
                    modules: true,
                    // localIdentName: '[local]',
                },
            }, {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true,
                    modules: true,
                    modifyVars: webpackConfig.theme || {},
                },
            },
        ],
    }),
    // 将静态文件拷贝到打包目录
    new CopyWebpackPlugin(webpackConfig.copy || defaultConfig.copy),
    new MiniCssExtractPlugin({
        filename: `[name].min.css?[${contenthash}:8]`,
        chunkFilename: `[name].min.css?[${contenthash}:8]`,
    }),
    new HtmlWebpackPlugin({
        template: webpackConfig.html ? webpackConfig.html.template : defaultConfig.htmlTemplate,
        inject: true,
        minify: {
            minifyCSS: true,
            removeComments: true,
            collapseWhitespace: true,
        }
    }),
        //在开发时不需要每个页面都引用React
        new webpack.ProvidePlugin({
        "React": "react",
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20
        }),
    new ProgressBarPlugin(),
],
packConfig.devServer = {
    port: webpackConfig.port || 9999,
    hot: true,
    open: 'Chrome',
    clientLogLevel: 'error',
    overlay: {
        errors: true,
    },
    contentBase: path.resolve(process.cwd(), "dist"),
    quiet: true,
    proxy: webpackConfig.proxy,
    historyApiFallback: true,
};

packConfig.optimization = {
    splitChunks: {
        chunks: 'all',
        minSize: 40000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '-',
        name: true,
        cacheGroups: {
            common: {
                name: 'common',
                minChunks: 2,
                priority: 10,
                reuseExistingChunk: true
            },
            vendors: {
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                priority: 20,
                enforce: true,
                chunks: "initial",
            },
        },
    },
};

if (env === 'development') {
    packConfig.devtool = "source-map";
    packConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    if (webpackConfig.isMockOpen !== undefined ? webpackConfig.isMockOpen : true) {
        packConfig.devServer.before = (app) => {
            generateMock(app);
        }
    }
} else {
    // const mock = require('../mock');
    // packConfig.entry[pkg.name].push(resolve('../mock/index.js'));
}

function generateMock(app) {
    const mock = require('../mock');
    return Object.entries(mock).map(([urls, result]) => {
        const [ method, url] = (urls || '').split(' ');
        if (typeof result !== 'function') {
            result = function(req, res) {
               return res.json(result);
            };
        }
        app[method.toLowerCase()](url, result);
    })
}

module.exports = packConfig;
