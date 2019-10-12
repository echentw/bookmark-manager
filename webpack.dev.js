const merge = require('webpack-merge');
const prodConfig = require('./webpack.prod.js');

module.exports = merge(prodConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
});
