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
  init: function(config, attachMainWindow) {
    var trayIcon;
    if (process.platform === 'darwin') {
      trayIcon = new Tray(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon.png'));
      trayIcon.setPressedImage(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon-white.png'));
    } else if (process.platform === 'win32') {
      trayIcon = new Tray(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon-white.png'));
    } else {
      trayIcon = new Tray(path.join(__dirname, '..', '..', 'resources', 'tray', 'osx', 'icon.png'));
    }
    var systemTrayTemplate = [
      {
        label: 'MavensMate v'+app.getVersion(),
        type: 'normal'
      },
      {
        label: 'Show MavensMate',
        type: 'normal',
        click: function() { attachMainWindow().then(() => { app.focus(); }); }
      },
      {
        label: 'Open at Login',
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
      }
    ];

    if (process.platform === 'win32') {
      systemTrayTemplate.push({
        label: 'Hide From Taskbar',
        type: 'checkbox',
        click: function() {
          config.set('mm_windows_skip_taskbar', !config.get('mm_windows_skip_taskbar', false));
          config.save();
        },
        checked: config.get('mm_windows_skip_taskbar', false)
      });
    }

    if (process.platform === 'darwin') {
      systemTrayTemplate.push({
        label: 'Hide from Dock',
        type: 'checkbox',
        click: function() {
          var hideFromDock = !config.get('mm_macos_hide_from_dock');
          if (hideFromDock)
            app.dock.hide();
          else
            app.dock.show();
          config.set('mm_macos_hide_from_dock', hideFromDock, false);
          config.save();
        },
        checked: config.get('mm_macos_hide_from_dock', false)
      });
    }

    systemTrayTemplate.push({
      label: 'Quit MavensMate',
      type: 'normal',
      click: function() { app.quit(); }
    });
    var contextMenu = Menu.buildFromTemplate(systemTrayTemplate);
    trayIcon.setToolTip('MavensMate');
    trayIcon.setContextMenu(contextMenu);
    return trayIcon;
  }
};