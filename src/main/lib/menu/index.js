var electron  = require('electron');
var Menu      = electron.Menu;

module.exports = {
  init: function(attachWindow) {
    if (!Menu.getApplicationMenu()) {
      var template;
      if (process.platform === 'darwin') {
        template = require('./darwin')(attachWindow);
      } else if (process.platform === 'win32') {
        template = require('./win32')(attachWindow);
      } else {
        template = require('./linux')(attachWindow);
      }
      var menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
      return menu;
    }
  }
};