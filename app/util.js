var electron = require('electron');

var exports = module.exports = {};

exports.isDev = function() {
  return electron.app.getAppPath().includes('/node_modules/electron-prebuilt/')
}