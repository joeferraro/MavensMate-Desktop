var electron      = require('electron');
var app           = electron.app;
var autoUpdater   = electron.autoUpdater;
var os            = require('os');
var util          = require('./util');

const UPDATE_SERVER_HOST = 'mavensmate-app-auto-updater.herokuapp.com'

function AppUpdater(window) {

  if (util.isDev()) {
      return;
  }
  if (os.platform() !== 'darwin') {
      return;
  }

  this.window = window;

  var version = app.getVersion();

  autoUpdater.addListener('update-available', function (event) {
    console.log('A new update is available');
  });
  autoUpdater.addListener('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateURL) {
    this._notify('A new update is ready to install. Version ' + releaseName + ' is downloaded and will be automatically installed on Quit', updateURL);
  });
  autoUpdater.addListener('error', function (error) {
    console.log(error);
  });
  autoUpdater.addListener('checking-for-update', function (event) {
    console.log('checking-for-update');
  });
  autoUpdater.addListener('update-not-available', function () {
    console.log('update-not-available');
  });

  autoUpdater.setFeedURL('https://' + UPDATE_SERVER_HOST + '/update/' + os.platform() + '_' + os.arch() + '/' + version);
  autoUpdater.checkForUpdates();
}

AppUpdater.prototype._notify = function(message, url) {
  this.window.webContents.send('needsUpdate', message, url);
}

module.exports = AppUpdater;
