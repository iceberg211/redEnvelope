// 根据环境变量选择配置文件
module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development' || process.env.NODE_ENV === 'development';
  const isProduction = argv.mode === 'production' || process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return require('./config/webpack/prod.js');
  }
  
  // 默认使用开发配置
  return require('./config/webpack/dev.js');
};