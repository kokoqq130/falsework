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
                root: ['./src'],
                alias: {
                    component: './src/component',
                    core: './src/core',
                    util: './src/util',
                    config: './config',
                },
            },
        ],
    ],
};
