const baseConfig = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ts', '.tsx'],
        root: ['./src'],
        alias: {
          '^@/(.+)': ([, name]) => `./src/${name}`,
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
}

const prodConfig = {
  ...baseConfig,
  plugins: ['transform-remove-console', ...baseConfig.plugins],
}

module.exports = api => {
  // api.cache(true)
  const isTesting = api.env() === 'development' || api.env() === 'test'
  return isTesting ? baseConfig : prodConfig
}
