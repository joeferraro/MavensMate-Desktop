/* eslint strict: 0 */
'use strict';

var electron        = require('electron');
var app             = electron.app;

if (require('electron-squirrel-startup')) app.quit();

var Promise         = require('bluebird');
var path            = require('path');
var BrowserWindow   = electron.BrowserWindow;
var shell           = electron.shell;
var ipc             = electron.ipcMain;
var mavensmate      = require('mavensmate');
var AppUpdater      = require('./lib/updater');
var appTray         = require('./lib/tray');
var appMenu         = require('./lib/menu');

var mainWindow = null;
var server = null;
var serverConfig = null;
var appUpdater = null;
var menu = null;
var trayIcon = null;

var openUrlInNewTab = function(url) {
  console.log('openUrlInNewTab', url);
  var waitFor = !mainWindow ? attachMainWindow() : Promise.resolve();
  waitFor
    .then(function() {
      if (url.indexOf('localhost') >= 0) {
        // opens mavensmate ui in mavensmate-desktop chrome
        mainWindow.webContents.send('new-web-view', url);
        mainWindow.show();
      } else {
        // open external url in local browser
        shell.openExternal(url);
      }
    })
    .catch(function(err) {
      console.error('COuld not open url in new view ...', err);
    });
};

var startServer = function() {
  return new Promise(function(resolve, reject) {
    // adds tab to the main window (typically called from the core via windowOpener function passed to client)
    mavensmate
      .startServer({
        name: 'mavensmate-desktop',
        port: 56248,
        openWindowFn: openUrlInNewTab,
        mode: 'desktop',
        desktopVersion: require('./package.json').version,
        ipc: require('electron').ipcRenderer
      })
      .then(function(res) {
        server = res.server;
        serverConfig = res.config;
        resolve();
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

var stopServer = function() {
  return new Promise(function(resolve, reject) {
    mavensmate
      .stopServer()
      .then(function() {
        resolve();
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

// attaches the main window
var attachMainWindow = function() {
  return new Promise(function(resolve, reject) {
    try {
      console.log('attaching main application window');

      if (mainWindow) {
        // currently we only support a single window
        return resolve();
      }

      // Create the browser window.
      mainWindow = new BrowserWindow({
        width: 1000,
        height: 750,
        minWidth: 850,
        minHeight: 670,
        icon: path.join(__dirname, '..', 'resources', 'icon.png')
      });

      mainWindow.loadURL('file://' + __dirname + '/index.html');

      // mainWindow.openDevTools();

      mainWindow.webContents.on('did-finish-load', function() {

        if (!server) {
          startServer()
            .then(function() {
              mainWindow.webContents.send('new-web-view', 'http://localhost:56248/app/home');
              resolve();
            })
            .catch(function(err) {
              reject(err);
            });
        } else {
          mainWindow.webContents.send('new-web-view', 'http://localhost:56248/app/home');
          resolve();
        }

      });

      // Emitted when the window is closed.
      mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
      });

    } catch(err) {
      reject(err);
    }
  });
};

// mavensmate server can send messages to this process
// in this case, we take a click event on an icon in mavensmate server and
// display an app launcher in our UI, because we manage the webviews
ipc.on('show-view-manager', function() {
  console.log('showing view manager!');
  mainWindow.webContents.send('show-view-manager');
});

// used in development when we want to run the dev server inside electron
// press escape on the error screen to proceed
ipc.on('error:continue', function() {
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('new-web-view', 'http://localhost:56248/app/home');
  });
});

ipc.on('new-window', function() {
  attachMainWindow();
});

app.on('window-all-closed', () => {
  // don't quit app when all windows are closed, we want users to be able to run windowless
});

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  } else {
    attachMainWindow();
  }
});

if (shouldQuit) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// will check for updates against github releases and pass the result to setup
app.on('ready', function() {
  attachMainWindow()
    .then(function() {
      menu = appMenu.init(attachMainWindow);
      trayIcon = appTray.init(serverConfig);
      appUpdater = new AppUpdater(mainWindow, serverConfig);
    })
    .catch(function(err) {
      console.error('Error starting MavensMate: ', err);
      mainWindow.loadURL('file://' + __dirname + '/index.html');
      mainWindow.webContents.on('did-finish-load', function() {
        if (err.message.indexOf('56248') >= 0) {
          mainWindow.webContents.send('main-process-error', 'Another MavensMate Desktop instance running. Quit any other running instances of MavensMate Desktop to continue.');
        } else {
          mainWindow.webContents.send('main-process-error', err.message);
        }
      });
    });
});