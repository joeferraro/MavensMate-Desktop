'use strict';

if (require('electron-squirrel-startup')) return;

var electron        = require('electron');
var app             = electron.app;
var Tray            = electron.Tray;
var Promise         = require('bluebird');
var path            = require('path');
var Menu            = electron.Menu;
var BrowserWindow   = electron.BrowserWindow;
var shell           = electron.shell;
var mavensmate      = require('mavensmate');
var ipc             = electron.ipcMain;
var AppUpdater      = require('./app-updater');
var AutoLaunch      = require('auto-launch');

var mainWindow = null;
var mavensMateApp = null;
var mavensMateServer = null;
var mavensMateConfig = null;
var mavensMateLogger = null;
var trayIcon;
var isStartAtLaunch = false;
var installPrereleases = false;
var openUrlInNewTab = null;

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

// attaches menu to application (edit, view, window, help, etc)
var attachAppMenu = function() {
  if (!Menu.getApplicationMenu()) {
    var template;
    if (process.platform == 'darwin') {
      template = [
        {
          label: 'MavensMate',
          submenu: [
            {
              label: 'MavensMate v'+app.getVersion()
            },
            {
              type: 'separator'
            },
            {
              label: 'Services',
              submenu: []
            },
            {
              type: 'separator'
            },
            {
              label: 'Hide MavensMate',
              accelerator: 'Command+H',
              selector: 'hide:'
            },
            {
              label: 'Hide Others',
              accelerator: 'Command+Shift+H',
              selector: 'hideOtherApplications:'
            },
            {
              label: 'Show All',
              selector: 'unhideAllApplications:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Quit',
              accelerator: 'Command+Q',
              click: function() { app.quit(); }
            },
          ]
        },
        {
          label: 'Edit',
          submenu: [
            {
              label: 'Undo',
              accelerator: 'Command+Z',
              selector: 'undo:'
            },
            {
              label: 'Redo',
              accelerator: 'Shift+Command+Z',
              selector: 'redo:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Cut',
              accelerator: 'Command+X',
              selector: 'cut:'
            },
            {
              label: 'Copy',
              accelerator: 'Command+C',
              selector: 'copy:'
            },
            {
              label: 'Paste',
              accelerator: 'Command+V',
              selector: 'paste:'
            },
            {
              label: 'Select All',
              accelerator: 'Command+A',
              selector: 'selectAll:'
            },
          ]
        },
        {
          label: 'Window',
          submenu: [
            {
              label: 'New Window',
              accelerator: 'Command+N',
              click: function() {
                if (!mainWindow) {
                  attachMainWindow(false, 'http://localhost:56248/app/home');
                }
              }
            },
            {
              label: 'Minimize',
              accelerator: 'Command+M',
              selector: 'performMiniaturize:'
            },
            {
              label: 'Close',
              accelerator: 'Command+W',
              selector: 'performClose:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Bring All to Front',
              selector: 'arrangeInFront:'
            },
          ]
        },
        {
          label: 'Advanced',
          submenu: [
            {
              label: 'Toggle Core Developer Tools',
              accelerator: (function() {
                if (process.platform === 'darwin')
                  return 'Alt+Command+K';
                else
                  return 'Ctrl+Shift+K';
              })(),
              click: function(item, focusedWindow) {
                if (focusedWindow) {
                  console.log(item);
                  console.log(focusedWindow);
                  // focusedWindow.toggleDevTools();
                  focusedWindow.webContents.send('webviewDevTools');
                }
              }
            },
            {
              label: 'Toggle Mavensmate Developer Tools',
              accelerator: (function() {
                if (process.platform === 'darwin')
                  return 'Alt+Command+I';
                else
                  return 'Ctrl+Shift+I';
              })(),
              click: function(item, focusedWindow) {
                if (focusedWindow) {
                  focusedWindow.toggleDevTools();
                }
              }
            }
          ]
        },
        {
          label: 'Help',
          submenu: [
            {
              label: 'MavensMate v'+app.getVersion()
            },
            {
              label: 'Check for Updates',
              click: function() { require('electron').shell.openExternal('https://github.com/joeferraro/MavensMate-Desktop/releases') }
            },
            {
              label: 'Learn More',
              click: function() { require('electron').shell.openExternal('http://mavensmate.com') }
            },
            {
              label: 'Submit a GitHub Issue',
              click: function() { require('electron').shell.openExternal('https://github.com/joeferraro/MavensMate/issues') }
            }
          ]
        }
      ];
    } else {
      template = [
        {
          label: '&File',
          submenu: [
            {
              label: '&Close',
              accelerator: 'Ctrl+W',
              click: function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                if (focusedWindow)
                  focusedWindow.close();
              }
            },
            {
              label: 'Quit',
              accelerator: 'Ctrl+Q',
              click: function() { app.quit(); }
            },
          ]
        },
        {
          label: 'Advanced',
          submenu: [
            {
              label: 'Toggle Core Developer Tools',
              accelerator: (function() {
                if (process.platform === 'darwin')
                  return 'Alt+Command+K';
                else
                  return 'Ctrl+Shift+K';
              })(),
              click: function(item, focusedWindow) {
                if (focusedWindow) {
                  console.log(item);
                  console.log(focusedWindow);
                  // focusedWindow.toggleDevTools();
                  focusedWindow.webContents.send('webviewDevTools');
                }
              }
            },
            {
              label: 'Toggle Mavensmate Developer Tools',
              accelerator: (function() {
                if (process.platform === 'darwin')
                  return 'Alt+Command+I';
                else
                  return 'Ctrl+Shift+I';
              })(),
              click: function(item, focusedWindow) {
                if (focusedWindow) {
                  focusedWindow.toggleDevTools();
                }
              }
            }
          ]
        },
        {
          label: 'Help',
          submenu: [
            {
              label: 'MavensMate v'+app.getVersion()
            },
            {
              label: 'Check for Updates',
              click: function() { require('electron').shell.openExternal('https://github.com/joeferraro/MavensMate-Desktop/releases') }
            },
            {
              label: 'Learn More',
              click: function() { require('electron').shell.openExternal('http://mavensmate.com') }
            },
            {
              label: 'Submit a GitHub Issue',
              click: function() { require('electron').shell.openExternal('https://github.com/joeferraro/MavensMate/issues') }
            }
          ]
        }
      ];
    }

    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
};

// attaches the main window
var attachMainWindow = function(restartServer, url) {
  return new Promise(function(resolve, reject) {
    try {
      console.log('attaching main application window');

      // adds tab to the main window (typically called from the core via windowOpener function passed to client)
      openUrlInNewTab = function(url) {
        console.log('OPENING URL IN NEW TABBBB', url);
        var waitFor = !mainWindow ? attachMainWindow() : Promise.resolve();

        waitFor
          .then(function() {
            if (url.indexOf('localhost') >= 0) {
              // opens mavensmate ui in mavensmate-app chrome
              mainWindow.webContents.send('openTab', url);
              mainWindow.show();
            } else {
              // open external url in local browser
              shell.openExternal(url);
            }
          })
          .catch(function(err) {
            console.error('COuld not open url in new tab ...', err);
          });
      };

      // Create the browser window.
      mainWindow = new BrowserWindow({
        width: 1000,
        height: 750,
        minWidth: 850,
        minHeight: 670,
        icon: path.join(__dirname, 'resources', 'icon.png')
      });

      // and load the index.html of the app.
      mainWindow.loadURL('file://' + __dirname + '/index.html');

      mainWindow.webContents.on('did-finish-load', function() {
        if (mavensmate.stop && restartServer) { // happens when app is restarted
          mavensMateServer.stop();
          mavensMateServer = null;
          mavensMateApp = null;
          mavensMateConfig = null;
          mavensMateLogger = null;
        }
        if (!mavensMateServer) {
          // we start the mm server, bc app was just started or was reloaded (typically during dev)
          mavensmate
            .startServer({
              name: 'mavensmate-app',
              port: 56248,
              openWindowFn: openUrlInNewTab
            })
            .then(function(res) {
              mavensMateApp = res.app;
              mavensMateServer = res.server;
              mavensMateConfig = res.config;
              mavensMateLogger = res.logger;
              console.log(mavensMateConfig.get('mm_workspace'));
              console.log('opening start url ...');
              mainWindow.webContents.send('openTab', 'http://localhost:56248/app/home');
              new AppUpdater(mainWindow, mavensMateConfig);
              resolve();
            })
            .catch(function(err) {
              console.error(err);
              mainWindow.webContents.send('openTab', 'http://localhost:56248/app/home');
              resolve();
            });
        } else {
          // app window was closed, now it's being opened again
          if (url) {
            mainWindow.webContents.send('openTab', url);
          }
          resolve();
        }
      });

      // Open the devtools.
      // mainWindow.openDevTools();

      // Emitted when the window is closed.
      mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
      });
    } catch(e) {
      reject(e);
    }
  });
};

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

var attachTray = function() {
  return new Promise(function(resolve, reject) {
    appLauncher.isEnabled()
      .then(function(enabled) {
        if (enabled) {
          isStartAtLaunch = enabled;
        }
        if (process.platform === 'darwin') {
          trayIcon = new Tray(path.join(__dirname, 'resources', 'tray', 'osx', 'icon.png'));
          trayIcon.setPressedImage(path.join(__dirname, 'resources', 'tray', 'osx', 'icon-white.png'));
        } else if (process.platform === 'win32') {
          trayIcon = new Tray(path.join(__dirname, 'resources', 'tray', 'osx', 'icon-white.png'));
        } else {
          trayIcon = new Tray(path.join(__dirname, 'resources', 'tray', 'osx', 'icon.png'));
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
              mavensMateConfig.set('mm_beta_channel', !mavensMateConfig.get('mm_beta_channel', false));
              mavensMateConfig.save();
            },
            checked: mavensMateConfig.get('mm_beta_channel', false)
          },
          {
            label: 'Quit MavensMate',
            type: 'normal',
            click: function() { app.quit(); }
          }
        ]);
        trayIcon.setToolTip('MavensMate');
        trayIcon.setContextMenu(contextMenu);
        resolve();
      })
      .catch(function(err) {
        console.log('could not attach tray', err);
        reject(err);
      });
  });
};

// when the last tab is closed, we close the entire browser window
ipc.on('last-tab-closed', function() {
  mainWindow.close();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// will check for updates against github releases and pass the result to setup
app.on('ready', function() {
  attachAppMenu();
  attachMainWindow()
    .then(function() {
      return attachTray();
    })
    .catch(function(err) {
      console.error('Error starting MavensMate: ', err);
    });
});