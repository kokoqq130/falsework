const path = require('path');
const pkg = require('./package.json');

const resolve = dir => path.resolve(__dirname, dir);

// 覆盖antd的默认主题设置，把字体图标文件变味本地加载
const theme = {
    "icon-url": JSON.stringify(`/static/fonts/iconfont`)
};
const outputPath = resolve('dist');
const src = {
    html: resolve( './demo/public/index.html'),
    js: resolve('./demo/src/index.js'),
    static: resolve('./demo/static'),
},
dist = {
    static:  path.resolve(outputPath, 'static'),
};

const webpackConfig = {
    entry: {
        [pkg.name]: ['@babel/polyfill', src.js],
    },
    publicPath: '/',
    outputPath,
    copy: [{
        from: src.static,
        to: dist.static,
        ignore: ['html/*', '.DS_Store']
    }],
    html: {
        template: src.html,
    },
    theme: theme,
    isMockOpen: false,
    port: 9998,
    proxy: {
        "/api": {
            "target": "http://www.baidu.com",
            "changeOrigin": true,
            "pathRewrite": { "^/api" : "" }
        }
    },
};

module.exports = webpackConfig;
