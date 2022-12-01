const {readdirSync} = require('fs');
const {join, resolve} = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const folders = ['collectors', 'functions'];

const dirs = () => folders.map(entry => {
    return readdirSync(join(__dirname, entry), {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .map(subentry => {
            return `./${join(entry, subentry, 'index.js')}`;
        })
}).flat().reduce((acc, path) => {
    const entry = path.replace('/index.js', '');
    acc[entry] = path;
    return acc;
}, {});

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: true,
                format: {
                    comments: false
                }
            }
        })],
    },
    target: 'node',
    mode: "production",
    entry: dirs,
    output: {
        filename: './[name]/index.js',
        path: resolve(__dirname, 'dist'),
        libraryTarget: "commonjs",
    },
    node: {
        global: false
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: './*/*/conf.*.json',
                    to: './'
                },
                {
                    from: './*/*/*.md',
                    to: './'
                }
            ]
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
    ]
}