var electron  = require('electron');
var os        = require('os');

var exports = module.exports = {};

exports.isDev = function() {
  return electron.app.getAppPath().includes('/node_modules/electron-prebuilt/')
}

exports.isWindows = function() {
  return os.platform() === 'win32';
};

exports.isLinux = function() {
  return os.platform() === 'linux';
};

exports.isMac = function() {
  return os.platform() === 'darwin';
};