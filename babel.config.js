module.exports = {
    babelrcRoots: [
        '.',
        './package/*',
    ],
    presets: [
        '@babel/preset-env',
        '@babel/react',
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'lib',
                style: 'css',
            },
        ],
        [
            'module-resolver',
            {
                root: ['./demo/src'],
                alias: {
                    component: './demo/src/component',
                    core: './demo/src/core',
                    util: './demo/src/util',
                    config: './demo/config',
                },
            },
        ],
    ],
};
