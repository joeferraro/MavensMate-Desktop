var ipc     = require('electron').ipcRenderer;
var shell   = require('electron').shell;
var swig    = require('swig');

var Notification = function() {
  var self = this;
  self._template = swig.compileFile('./lib/updater/notification.tpl.html');
  self._message = swig.compileFile('./lib/updater/message.tpl.html');

  ipc.on('update-available', function(evt, releaseName, actionRequired) {
    self.show(releaseName, actionRequired);
  });

  $(function() {
    $('body').notification();
    document.body.innerHTML += self._template();
    setTimeout(function() {
      self.show('foo', 'download');
    }, 3000);
  });
}

Notification.prototype.show = function(releaseName, actionRequired) {
  console.log('showing update notification', releaseName, actionRequired)
  var msg = this._message({ releaseName: releaseName, actionRequired: actionRequired });
  console.log(msg)
  $('#update-toast h2').html(msg);
  $('#update-toast').notification('show');
};

module.exports = new Notification();