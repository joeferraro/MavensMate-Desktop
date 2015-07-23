if (window.require) {
  console.log('preload.js');
  var preload = {};
  preload.remote = remote;
  preload.ipc = require('ipc');
  preload.bwId = remote.getCurrentBrowserWindow().id;
} else {
  console.log('preload.js - require is undefined');
}
