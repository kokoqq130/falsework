const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, './'),
    collectCoverage: true, // 是否收集测试时的覆盖率信息
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,mjs}'], // 哪些文件需要收集覆盖率信息
    coverageDirectory: '<rootDir>/test/coverage', // 输出覆盖信息文件的目录
    coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/src/index.jsx'], // 统计覆盖信息时需要忽略的文件
    moduleNameMapper: { // 主要用于与webpack的resolve.alias匹配，注意正则写法
        '^@bk/component-ui(.*)$': '<rootDir>/package/back-ui/component$1',
    },
    setupFiles: ['<rootDir>/test/setup.js'], // 运行测试前可运行的脚本，比如注册enzyme的兼容
    testMatch: [ // 匹配的测试文件
        '<rootDir>/package/back-ui/component/**/test.js',
    ],
    transform: {
        '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
        '^.+\\.(css|less)$': '<rootDir>/test/cssTransform.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/fileTransform.js',
    },
    transformIgnorePatterns: [ // 转换时需要忽略的文件
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/demo/',
        '<rootDir>/node_modules/',
    ],
};
