// 根据环境变量选择配置文件
module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development' || process.env.NODE_ENV === 'development';
  const isProduction = argv.mode === 'production' || process.env.NODE_ENV === 'production';

  // Ensure loaders (like swc) see correct NODE_ENV at build time
  if (isProduction) process.env.NODE_ENV = 'production';
  else if (isDevelopment) process.env.NODE_ENV = 'development';

  if (isProduction) {
    return require('./config/webpack/prod.js');
  }

  // 默认使用开发配置
  return require('./config/webpack/dev.js');
};
