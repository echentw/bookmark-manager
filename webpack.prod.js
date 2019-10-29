const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// Without this, errors found by the checker running in a different process won't be printed.
// This is needed to display async errors.
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    background: path.join(__dirname, 'src/background.ts'),
    newtab: path.join(__dirname, 'src/main.tsx'),
    popup: path.join(__dirname, 'src/popup.tsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      }
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new CopyPlugin([
      { from: 'manifest.json', to: 'manifest.json', toType: 'file', force: true },
      { from: 'src/assets/generated', to: 'assets', toType: 'dir', force: true },
      { from: 'newtab.html', to: 'newtab.html', toType: 'file', force: true },
      { from: 'popup.html', to: 'popup.html', toType: 'file', force: true },

      // Google analytics
      { from: 'analytics', to: 'analytics', toType: 'dir', force: true },
    ]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss"]
  },
};
