if(window.require)
{
  console.log('preload.js');
  var preload = {};
  preload.remote = remote;
  preload.ipc = require('ipc');
  preload.bwId = remote.getCurrentBrowserWindow().id;
  //console.log('Current Browser Window Id: ' + preload.bwId);  
}
else
  console.log('preload.js - require is undefined');