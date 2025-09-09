const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, '../../src/main.tsx'),

  resolve: {
    extensions: ['.mjs', '.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../../src'),
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser.js'),
      fs: false,
      net: false,
      tls: false,
    },
    extensionAlias: {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    },
    fullySpecified: false, // 允许不完全指定的模块导入
  },

  module: {
    rules: [
      // 通用 JS/TS 处理（SWC），按 NODE_ENV 调整 React 开发特性
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
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
              keepClassNames: process.env.NODE_ENV !== 'production',
              transform: {
                react: {
                  runtime: 'automatic',
                  development: process.env.NODE_ENV !== 'production',
                  refresh: process.env.NODE_ENV !== 'production',
                },
              },
            },
            module: { type: 'es6' },
            sourceMaps: true,
          },
        },
      },
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
      favicon: path.resolve(__dirname, '../../public/vite.svg'),
      inject: 'body',
      scriptLoading: 'defer',
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
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
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },

  stats: 'errors-warnings',
};
