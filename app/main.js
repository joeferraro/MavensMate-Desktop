var app = require('app');  // Module to control application life.
var autoUpdater = require('auto-updater');
var path = require('path');
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// autoUpdater.setFeedUrl('http://mycompany.com/myapp/latest?version=' + app.getVersion());

// Report crashes to our server.
require('crash-reporter').start();

var openUrlInNewWindow = function(url) {
  var newWindow = new BrowserWindow({
    width: 1000, 
    height: 800,
    'min-width': 1000,
    'min-height': 800
  });
  newWindow.loadUrl(url);
  newWindow.show();
};

var openUrlInNewTab = function(url) {
  mainWindow.webContents.send('openTab', url);
  mainWindow.show();
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000, 
    height: 800,
    'min-width': 1000,
    'min-height': 800
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.webContents.on('did-finish-load', function() {
    // mainWindow.webContents.send('ping', 'whoooooooh!');
    // mainWindow.webContents.send('openTab', 'http://localhost:56248/app/home/index');

    var mavensmate = require('mavensmate');
    mavensmate
      .startServer({
        editor: 'sublime',
        port: 56248,
        windowOpener: openUrlInNewTab
      })
      .then(function() {
        mainWindow.webContents.send('openTab', 'http://localhost:56248/app/home/index');
      })
      .catch(function(err) {
        console.error(err);
        mainWindow.loadUrl('http://localhost:56248/app/error');
      });
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
});