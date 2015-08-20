var app = require('app');  // Module to control application life.
var autoUpdater = require('auto-updater');
var path = require('path');
var Menu = require('menu');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var mavensmate = require('mavensmate');
var shell = require('shell');
var gitHubReleases = require('./github');

// TODO: (issue #8)
// autoUpdater.setFeedUrl('http://mycompany.com/myapp/latest?version=' + app.getVersion());

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;
var mavensMateServer = null;
var applicationMenu = null;

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
          label: 'Help',
          submenu: [
            {
              label: 'Learn More',
              click: function() { require('shell').openExternal('http://mavensmate.com') }
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
          ]
        },
        {
          label: 'Help',
          submenu: [
            {
              label: 'Learn More',
              click: function() { require('shell').openExternal('http://mavensmate.com') }
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
var attachMainWindow = function(updateCheckResult, restartServer) {
  console.log('attaching main application window');
  console.log('update check result: ', updateCheckResult);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100, 
    height: 800,
    'min-width': 1100,
    'min-height': 800,
    icon: path.join(__dirname, 'resources', 'icon.png')
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.webContents.on('did-finish-load', function() {
    if (mavensMateServer && restartServer && mavensMateServer.stop) { // happens when app is restarted
      mavensMateServer.stop();
      mavensMateServer = null;
    }
    if (!mavensMateServer) {
      // either app just opened or was reloaded
      mavensmate
        .startServer({
          name: 'mavensmate-app',
          port: 56248,
          windowOpener: openUrlInNewTab
        })
        .then(function(server) {
          mavensMateServer = server;
          if (updateCheckResult && updateCheckResult.needsUpdate) {
            mainWindow.webContents.send('needsUpdate', updateCheckResult);
          }
          mainWindow.webContents.send('openTab', 'http://localhost:56248/app/home/index');
        })
        .catch(function(err) {
          console.error(err);
          mainWindow.loadUrl('http://localhost:56248/app/error');
        });
    } else {
      // app window was closed, now it's being opened again
      mainWindow.webContents.send('openTab', 'http://localhost:56248/app/home/index');
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
};

// unused?
var openUrlInNewWindow = function(url) {
  var newWindow = new BrowserWindow({
    width: 1100, 
    height: 800,
    'min-width': 1100,
    'min-height': 800,
    icon: path.join(__dirname, 'resources', 'icon.png')
  });
  newWindow.loadUrl(url);
  newWindow.show();
};

// adds tab to the main window (typically called from the core via windowOpener function passed to client)
var openUrlInNewTab = function(url) {
  if (!mainWindow) {
    attachMainWindow(null, false);
  }
  if (url.indexOf('localhost') >= 0) {
    mainWindow.webContents.send('openTab', url);
    mainWindow.show();
  } else {
    shell.openExternal(url);
  }
};

// Quit when all windows are closed on platforms other than OSX, as per platform guidelines
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// will check for updates against github releases and pass the result to setup
app.on('ready', function() {  
  // check for update
  var options = {
    repo: 'joeferraro/mavensmate-app',
    currentVersion: app.getVersion()
  };
  var updateChecker = new gitHubReleases(options);
  updateChecker.check()
    .then(function(updateCheckResult) {
      setup(updateCheckResult);
    })
    .catch(function(err) {
      console.error(err);
      setup();
    });
});

// attaches the app menu and instantiates and attaches the app's main window 
var setup = function(updateCheckResult) {
  attachAppMenu();
  attachMainWindow(updateCheckResult);
}