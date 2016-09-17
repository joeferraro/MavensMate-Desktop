var electron      = require('electron');
var app           = electron.app;
var autoUpdater   = electron.autoUpdater;
var ipcMain       = electron.ipcMain;
var os            = require('os');
var util          = require('./util');
var nslog         = require('nslog');

const UPDATE_SERVER_HOST = 'mavensmate-app-auto-updater.herokuapp.com'

function AppUpdater(window, config) {
  var self = this;
  if (util.isDev()) {
      return;
  }

  this.window = window;

  var version = app.getVersion();
  var channel = config.get('mm_beta_channel', false) ? 'beta' : 'stable';

  autoUpdater.addListener('update-available', function (event) {
    console.log('A new update is available');
    nslog('An update is available from channel: '+channel);
  });
  autoUpdater.addListener('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateURL) {
    if (util.isMac()) {
      nslog('Update from channel '+channel+' is ready to install on quit: '+updateURL);
    }
    self._notify(releaseName);
  });
  autoUpdater.addListener('error', function (error) {
    console.log(error);
    nslog('Error updating from channel '+channel+': '+error.message);
  });
  autoUpdater.addListener('checking-for-update', function (event) {
    console.log('checking-for-update in channel: '+channel);
    nslog('Checking for update in channel: '+channel);
  });
  autoUpdater.addListener('update-not-available', function () {
    console.log('update-not-available for channel: '+channel);
    nslog('Update not available for channel: '+channel);
    // if beta user, autoupdater checks beta channel first, if an update isn't available in the beta channel, we look for an update in the stable channel
    if (channel === 'beta') {
      console.log('updater checking stable channel');
      nslog('updater checking stable channel');
      channel = 'stable';
      autoUpdater.setFeedURL('https://' + UPDATE_SERVER_HOST + '/update/channel/'+ channel + '/' + os.platform() + '_' + os.arch() + '/' + version);
      autoUpdater.checkForUpdates();
    }
  });

  ipcMain.on('quit-and-install', function() {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.setFeedURL('https://' + UPDATE_SERVER_HOST + '/update/channel/' + channel + '/' + os.platform() + '_' + os.arch() + '/' + version);
  autoUpdater.checkForUpdates();
}

AppUpdater.prototype._notify = function(releaseName) {
  if (util.isLinux() || util.isWindows()) {
    this.window.webContents.send('show-update-notifier', releaseName, 'download');
  } else if (util.isMac()) {
    this.window.webContents.send('show-update-notifier', releaseName, 'quit');
  }
  app.dock.bounce('informational');
}

module.exports = AppUpdater;