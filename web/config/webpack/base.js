const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, '../../src/main.tsx'),

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../../src'),
    },
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url"),
      "zlib": require.resolve("browserify-zlib"),
      "buffer": require.resolve("buffer"),
      "process": require.resolve("process/browser"),
    },
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../index.html'),
      inject: 'body',
      scriptLoading: 'defer',
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      // 只传递以 VITE_ 开头的环境变量（保持兼容性）
      ...Object.keys(process.env)
        .filter(key => key.startsWith('VITE_'))
        .reduce((env, key) => {
          env[`process.env.${key}`] = JSON.stringify(process.env[key]);
          return env;
        }, {}),
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],

  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
    clean: true,
  },

  // 处理 ES modules 和 polyfills
  experiments: {
    topLevelAwait: true,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20,
          chunks: 'all',
        },
        web3: {
          test: /[\\/]node_modules[\\/](wagmi|viem|@rainbow-me)[\\/]/,
          name: 'web3',
          priority: 15,
          chunks: 'all',
        },
        mantine: {
          test: /[\\/]node_modules[\\/]@mantine[\\/]/,
          name: 'mantine',
          priority: 12,
          chunks: 'all',
        },
      },
    },
  },
};