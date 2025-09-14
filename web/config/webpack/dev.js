const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const path = require('path');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  module: {
    rules: [
      // JS/TS 规则已下沉到 base
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: false, importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      // CSS Modules
      {
        test: /\.module\.css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: { localIdentName: '[name]__[local]--[hash:base64:5]' }, importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      // 全局 SASS/SCSS（包含 node_modules）
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: false, importLoaders: 2 } },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // SASS/SCSS Modules
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: { localIdentName: '[name]__[local]--[hash:base64:5]' }, importLoaders: 2 } },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new WebpackBar({
      name: '🚀 开发环境',
      color: '#61dafb',
      profile: true,
      basic: false,
      fancy: true,
      reporter: [
        'fancy',
        'profile',
      ],
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          '🎉 应用已启动！',
          '🌐 本地地址: http://localhost:5173',
          '📱 网络地址: http://0.0.0.0:5173',
        ],
        notes: [
          '💡 提示: 按 Ctrl+C 停止开发服务器',
          '🔥 热重载已启用，修改代码自动刷新',
        ]
      },
      clearConsole: true,
    }),
    new CaseSensitivePathsPlugin(), // 确保路径大小写一致
    new ReactRefreshWebpackPlugin(),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, '../../public'),
      publicPath: '/',
    },
    historyApiFallback: true,
    // CI 环境下不自动打开浏览器，避免无头环境异常
    open: process.env.CI ? false : true,
    hot: true,
    liveReload: true,
    compress: true,
    port: 5173, // 保持与 Vite 相同的端口
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
      progress: true,
      logging: 'warn',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
  },

  // 使用 FriendlyErrorsWebpackPlugin 处理输出，这里仅显示错误和警告（已在 base 设置）
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
