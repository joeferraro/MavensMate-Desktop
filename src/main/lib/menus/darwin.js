export default function template(app) {
  return [
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