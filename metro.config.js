const { getDefaultConfig } = require('expo/metro-config');
const { Buffer } = require('buffer'); // Импортируем Buffer

const config = getDefaultConfig(__dirname);

// Добавляем поддержку полифила для Buffer
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve('buffer/'),
};

// Настройка для SVG
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
