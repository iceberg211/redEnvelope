const { merge } = require('webpack-merge');
const baseConfig = require('./base');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'hidden-source-map',
  
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
  },

  module: {
    rules: [
      // JS/TS 规则已下沉到 base
      // 全局 CSS（包含 node_modules）
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: false, importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      // CSS Modules
      {
        test: /\.module\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: { localIdentName: '[hash:base64:8]' }, importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      // 全局 SASS/SCSS（包含 node_modules）
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: false, importLoaders: 2 } },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // SASS/SCSS Modules
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: { localIdentName: '[hash:base64:8]' }, importLoaders: 2 } },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new WebpackBar({
      name: '📦 生产构建',
      color: '#f56565',
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
          '🎉 生产构建完成！',
          '📁 输出目录: dist/',
          '🚀 准备部署...',
        ],
        notes: [
          '💡 提示: 使用 pnpm preview 预览构建结果',
          '📊 使用 pnpm build:analyze 分析包大小',
        ]
      },
      clearConsole: false, // 生产构建时不清空控制台
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      ignoreOrder: false,
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 8192,
      minRatio: 0.8,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../../public'),
          to: '.',
          noErrorOnMissing: true,
        },
      ],
    }),
    // 可选：bundle 分析器
    ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-analyzer.html',
    })] : []),
  ],

  optimization: {
    ...baseConfig.optimization,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          compress: {
            drop_console: false, // 保留 console，在需要时可以设为 true
            drop_debugger: true,
            pure_funcs: ['console.debug'],
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      ...baseConfig.optimization.splitChunks,
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },

  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  stats: 'errors-warnings', // 使用 FriendlyErrorsWebpackPlugin 处理成功信息
});
