var electron      = require('electron');
var app           = electron.app;
var autoUpdater   = electron.autoUpdater;
var os            = require('os');
var util          = require('./util');
var nslog         = require('nslog');

const UPDATE_SERVER_HOST = 'mavensmate-app-auto-updater.herokuapp.com'

function AppUpdater(window, config) {
  var self = this;
  if (util.isDev()) {
      return;
  }
  if (os.platform() !== 'darwin') {
      return;
  }

  this.window = window;

  var version = app.getVersion();
  var channel = config.get('mm_beta_channel', false) ? 'beta' : 'stable';

  autoUpdater.addListener('update-available', function (event) {
    console.log('A new update is available');
    nslog('An update is available');
  });
  autoUpdater.addListener('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateURL) {
    self._notify('A new update is ready to install. Version ' + releaseName + ' is downloaded and will be automatically installed on quit.', updateURL);
    nslog('Update is ready to install on quit: '+updateURL);
  });
  autoUpdater.addListener('error', function (error) {
    console.log(error);
    nslog('Error updating: '+error.message);
  });
  autoUpdater.addListener('checking-for-update', function (event) {
    console.log('checking-for-update');
    nslog('Checking for update');
  });
  autoUpdater.addListener('update-not-available', function () {
    console.log('update-not-available');
    nslog('Update not available');
  });

  autoUpdater.setFeedURL('https://' + UPDATE_SERVER_HOST + '/update/' + os.platform() + '_' + os.arch() + '/' + version + '/' + channel);
  autoUpdater.checkForUpdates();
}

AppUpdater.prototype._notify = function(message, url) {
  this.window.webContents.send('needsUpdate', message, url);
}

module.exports = AppUpdater;
