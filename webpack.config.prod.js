const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: './src/electron/main.js',
  output: {
    path: './app',
    publicPath: './app',
    filename: 'app.bundle.js'
  },
  target: 'electron',
  externals: [
    nodeExternals(),
    (function () {
      var IGNORES = [
        'electron'
      ];
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style!css!sass', exclude: /node_modules/ },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader : 'file-loader'
      }
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  devtool: 'source-map',
};
