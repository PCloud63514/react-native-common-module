module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
          ".png",
          ".jpg"
        ],
        alias: {
          '@': './src',
          '@components': './src/ui/components',
          '@containers': './src/containers',
          '@images': './assets/images',
          '@screen': './src/ui/screen',
          // '@modules': './src/modules',
          // '@scenes': './src/scenes',
          '@domain': './src/domain',
          '@exception': './src/core/exception',
          '@manager': './src/core/manager',
          '@utils': './src/core/utils',
        },
      },
    ],
  ],
};
