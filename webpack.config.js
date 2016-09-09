const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['webpack/hot/dev-server', './src/react/main.js']
  },
  output: {
    publicPath: 'http://localhost:8080/build',
    filename: 'bundle.js'
  },
  devServer: {
    hot: true,
    contentBase: './src/electron',
    publicPath: 'http://localhost:8080/build'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style!css!sass', exclude: /node_modules/ },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' },
      {
        test: /\.(svg)$/,
        loader: 'url?limit=1000000'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader : 'file-loader'
      }
    ]
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ]
};
