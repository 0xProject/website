const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const childProcess = require('child_process');
const remarkSlug = require('remark-slug');
const remarkAutolinkHeadings = require('./webpack/remark_autolink_headings');
const remarkSectionizeHeadings = require('./webpack/remark_sectionize_headings');

const GIT_SHA = childProcess.execSync('git rev-parse HEAD').toString().trim();

module.exports = (_env, argv) => {
    const plugins = [new Dotenv()];
    const isDevEnvironment = argv.mode === 'development';

    const config = {
        entry: ['./ts/index.tsx'],
        output: {
            path: path.join(__dirname, '/public'),
            filename: 'bundle.js',
            chunkFilename: 'bundle-[name].js',
            publicPath: '/',
        },
        externals: {
            zeroExInstant: 'zeroExInstant',
        },
        node: {
            fs: 'empty',
        },
        resolve: {
            modules: [path.join(__dirname, '/ts'), 'node_modules'],
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.md'],
            alias: {
                ts: path.join(__dirname, '/ts'),
                less: path.join(__dirname, '/less'),
                sass: path.join(__dirname, '/sass'),
                md: path.join(__dirname, '/md'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'source-map-loader',
                    exclude: [
                        // instead of /\/node_modules\//
                        path.join(process.cwd(), 'node_modules'),
                    ],
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        // Skip type checking for local dev, can be done in editor and pre-push
                        transpileOnly: isDevEnvironment,
                    },
                },
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'less-loader'],
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.css$/,
                    loaders: ['style-loader', 'css-loader'],
                },

                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'react-svg-loader',
                            options: {
                                svgo: {
                                    plugins: [{ removeViewBox: false }],
                                },
                            },
                        },
                    ],
                },
            ],
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    sourceMap: true,
                    terserOptions: {
                        mangle: {
                            reserved: ['BigNumber'],
                        },
                    },
                }),
            ],
        },
        devServer: {
            host: '0.0.0.0',
            port: 3572,
            historyApiFallback: {
                // Fixes issue where having dots in URL path that aren't part of fileNames causes webpack-dev-server
                // to fail. Doc versions have dots in them, therefore we special case these urls to also load index.html.
                // Source: https://github.com/cvut/fittable/issues/171
                rewrites: [
                    {
                        from: /^\/docs\/.*$/,
                        to: function () {
                            return 'index.html';
                        },
                    },
                ],
            },
            disableHostCheck: true,
            // Fixes assertion error
            // Source: https://github.com/webpack/webpack-dev-server/issues/1491
        },
    };

    if (isDevEnvironment) {
        config.mode = 'development';
        config.devtool = 'cheap-module-eval-source-map';
    } else {
        config.mode = 'production';
        config.devtool = 'source-map';

        plugins.push(
            // Since we do not use moment's locale feature, we exclude them from the bundle.
            // This reduces the bundle size by 0.4MB.
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.DefinePlugin({
                'process.env': {
                    GIT_SHA: JSON.stringify(GIT_SHA),
                },
            }),
        );
        if (process.env.DEPLOY_ROLLBAR_SOURCEMAPS === 'true') {
            plugins.push(
                new RollbarSourceMapPlugin({
                    accessToken: '32c39bfa4bb6440faedc1612a9c13d28',
                    version: GIT_SHA,
                    publicPath: 'https://0x.org/',
                }),
            );
        }
    }
    console.log('i ｢atl｣: Mode: ', config.mode);

    config.plugins = plugins;
    console.log('i ｢atl｣: Plugin Count: ', config.plugins.length);

    return config;
};
