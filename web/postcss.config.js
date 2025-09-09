module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'), // 如果使用 Tailwind CSS
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