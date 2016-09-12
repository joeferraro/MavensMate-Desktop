var electron        = require('electron');
var app             = electron.app;
var ipc             = electron.ipcMain;

module.exports = function(attachWindow) {
  return [
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
          label: 'Toggle MavensMate Server Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+K';
            else
              return 'Ctrl+Shift+K';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.webContents.send('toggle-server-developer-tools');
            }
          }
        },
        {
          label: 'Toggle MavensMate Desktop Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.webContents.send('toggle-desktop-developer-tools');
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
          label: 'Submit a GitHub Issue',
          click: function() { require('electron').shell.openExternal('https://github.com/joeferraro/MavensMate/issues') }
        },
        {
          label: 'Learn More',
          click: function() { require('electron').shell.openExternal('http://mavensmate.com') }
        }
      ]
    }
  ];
}