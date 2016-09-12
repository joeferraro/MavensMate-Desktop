var AutoLaunch      = require('auto-launch');
var path            = require('path');
var electron        = require('electron');
var app             = electron.app;
var Tray            = electron.Tray;
var Menu            = electron.Menu;

var trayIcon;
var isStartAtLaunch = false;
var installPrereleases = false;

var getStartupPath = function() {
  if (process.platform === 'darwin') {
    return path.join(app.getAppPath(), '..', '..', '..');
  } else if (process.platform === 'win32') {
    return app.getAppPath();
  } else {
    return app.getAppPath();
  }
};

var appLauncher = new AutoLaunch({
  name: 'MavensMate',
  isHidden: true,
  path: getStartupPath()
});

var toggleStartAtLaunch = function() {
  appLauncher.isEnabled()
    .then(function(enabled) {
      if (isStartAtLaunch) {
        return appLauncher.disable();
      } else {
        return appLauncher.enable();
      }
    })
    .then(function(res){
      isStartAtLaunch = !isStartAtLaunch;
    })
    .catch(function(err) {
      console.log('could not toggleStartAtLaunch', err);
    });
};

module.exports = {
  init: function(config) {
    return new Promise(function(resolve, reject) {
      appLauncher.isEnabled()
        .then(function(enabled) {
          if (enabled) {
            isStartAtLaunch = enabled;
          }
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
              click: function() { toggleStartAtLaunch() },
              checked: isStartAtLaunch
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
          resolve(trayIcon);
        })
        .catch(function(err) {
          console.log('could not attach tray', err);
          reject(err);
        });
    });
  }
};