const path = require('path');
const fsExtra = require('fs-extra');
const pathBrowserify = require('path-browserify');
const Dotenv = require('dotenv-webpack');

module.exports = {
  target: 'electron-renderer',
  resolve: {
    alias: {},
    fallback: {
      fs: fsExtra,
      tls: false,
      net: false,
      path: require.resolve("path-browserify"),
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
    },
    plugins: [
        ...
        new Dotenv()
      ],
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },
};
