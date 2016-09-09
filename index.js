/* eslint strict: 0 */
'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 600,
    'auto-hide-menu-bar': true
  });

  // Remove 'public' part when deploying
  // win.loadUrl(`file://${__dirname}/index.html`);
  win.loadUrl(`file://${__dirname}/app/index.html`);
  win.openDevTools();
  win.on('closed', onClosed);

  return win;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate-with-no-open-windows', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});