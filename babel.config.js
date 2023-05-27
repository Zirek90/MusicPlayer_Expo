module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      [
        'module-resolver',
        {
          alias: {
            '@assets/*': './src/assets/*',
            '@screens': './src/screens',
            '@components': './src/components',
            '@utils': './src/utils',
            '@hoc': './src/hoc',
            '@types': './src/types',
            '@enums': './src/enums',
            '@errors': './src/errors',
            '@configs': './src/configs',
            '@constants': './src/constants',
            '@store': './src/store',
            '@global': './src/global',
            '@context': './src/context',
            '@service': './src/service',
          },
        },
      ],
    ],
  };
};
