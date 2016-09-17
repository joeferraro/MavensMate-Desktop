var path            = require('path');
var electron        = require('electron');
var app             = electron.app;
var Tray            = electron.Tray;
var Menu            = electron.Menu;

var toggleOpenAtLogin = function() {
  app.setLoginItemSettings({
    openAtLogin: app.getLoginItemSettings().openAtLogin ? false : true
  });
};

module.exports = {
  init: function(config) {
    var trayIcon;
    if (process.platform === 'darwin') {
      trayIcon = new Tray(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon.png'));
      trayIcon.setPressedImage(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon-white.png'));
    } else if (process.platform === 'win32') {
      trayIcon = new Tray(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon-white.png'));
    } else {
      trayIcon = new Tray(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon.png'));
    }
    var contextMenu = Menu.buildFromTemplate([
      {
        label: 'MavensMate v'+app.getVersion(),
        type: 'normal'
      },
      {
        label: 'Start on Launch',
        type: 'checkbox',
        click: function() { toggleOpenAtLogin() },
        checked: app.getLoginItemSettings().openAtLogin
      },
      {
        label: 'Install Beta Releases',
        type: 'checkbox',
        click: function() {
          config.set('mm_beta_channel', !config.get('mm_beta_channel', false));
          config.save();
        },
        checked: config.get('mm_beta_channel', false)
      },
      {
        label: 'Quit MavensMate',
        type: 'normal',
        click: function() { app.quit(); }
      }
    ]);
    trayIcon.setToolTip('MavensMate');
    trayIcon.setContextMenu(contextMenu);
    return trayIcon;
  }
};