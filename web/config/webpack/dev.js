const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const path = require('path');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: '@swc/loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: false,
                dynamicImport: true,
              },
              target: 'es2022',
              loose: false,
              externalHelpers: false,
              keepClassNames: true, // 开发环境保持类名
              transform: {
                react: {
                  runtime: 'automatic',
                  development: true, // 开发模式
                  refresh: true, // 支持 React Fast Refresh
                },
              },
            },
            module: {
              type: 'es6',
            },
            sourceMaps: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, '../../public'),
      publicPath: '/',
    },
    historyApiFallback: true,
    open: true,
    hot: true,
    liveReload: true,
    compress: true,
    port: 5173, // 保持与 Vite 相同的端口
    host: 'localhost',
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
  },

  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false,
  },

  optimization: {
    ...baseConfig.optimization,
    runtimeChunk: 'single', // 开发环境单独的 runtime chunk
  },

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
});