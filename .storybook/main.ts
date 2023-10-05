require('dotenv').config()
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', 'storybook-css-modules-preset'],
  env: (config) => ({
    ...config,
    DBS_URL: process.env.DBS_URL,
    DBS_ACCOUNT: process.env.DBS_ACCOUNT,
    PUBLIC_INFURA_PROJECT_ID: process.env.PUBLIC_INFURA_PROJECT_ID,
    PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID,
  }),
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  webpackFinal: async config => {
    config.resolve.plugins = [...(config.resolve.plugins || []), new TsconfigPathsPlugin({
      extensions: config.resolve.extensions
    })];

    config.module.rules.push({
      test: /\.module\.css$/,
      exclude: /\.module\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(__dirname, './'),
    });

    // Mimic next.config.js webpack config
    config.module.rules.push({
      test: /\.gif$/,
      // yay for webpack 5
      // https://webpack.js.org/guides/asset-management/#loading-images
      type: 'asset/resource'
    });

    // Modify storybook's file-loader rule to avoid conflicts with svgr
    const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'));
    fileLoaderRule.exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(tsx|ts)$/,
      use: [{
        loader: require.resolve('@svgr/webpack'),
        options: {
          icon: true
        }
      }]
    });
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      fs: false,
      crypto: false,
      os: false,
      stream: false,
      assert: false,
      zlib: false,
      net: false,
      tls: false
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })]);
    return config;
  },
  docs: {
    autodocs: false
  }
};