module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'), // 使用 postcss-nested 替代 tailwindcss/nesting
    require('autoprefixer'),
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
    }),
    ...(process.env.NODE_ENV === 'production' 
      ? [
          require('cssnano')({
            preset: 'default',
          }),
        ]
      : []
    ),
  ],
};