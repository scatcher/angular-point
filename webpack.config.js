const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const path = require('path');
const ROOT = path.resolve(__dirname);

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js']
    },

    entry: root('src/app.module.ts'),

    output: {
        path: root('dist'),
        publicPath: '/',
        filename: 'angular-point.js',
        libraryTarget: 'umd',
        library: 'angular-point'
    },

    externals: [nodeExternals()],

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: [root('node_modules')]
        }, {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader?declaration=false',
            exclude: [/\.e2e\.ts$/]
        }]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                tslintLoader: {
                    emitErrors: false,
                    failOnHint: false
                }
            }
        }),

        new webpack.optimize.OccurrenceOrderPlugin(true),

        new TsConfigPathsPlugin()

    ]
};

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [ROOT].concat(args));
}