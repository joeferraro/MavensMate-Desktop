var remote = require('electron').remote;

module.exports = function(launcher) {
  $(function() {
    $(document).on('keydown', function(e) {
      if (e.metaKey && e.altKey && e.which === 73) {
        // cmd + option + k to open electron dev tools
        remote.getCurrentWindow().openDevTools();
        return false;
      } else if (e.metaKey && e.altKey && e.which === 75) {
        // cmd + option + i to open core dev tools
        var webview = document.querySelector('webview:not(.hide)');
        webview.openDevTools();
        return false;
      } else if (e.metaKey && e.which === 78) {
        // cmd + n to open app launcher
        launcher.show();
      } else if (e.metaKey && e.which === 82) {
        // ctrl + r to reload page
        var webview = document.querySelector('webview:not(.hide)');
        webview.reload();
        e.preventDefault();
      } else if (e.metaKey && e.which === 219) {
        // ctrl + [ to go back
        var webview = document.querySelector('webview:not(.hide)');
        webview.goBack();
      } else if (e.metaKey && e.which === 221) {
        // ctrl + ] to go forward
        var webview = document.querySelector('webview:not(.hide)');
        webview.goForward();
      } else if (e.which === 27) {
        launcher.hide();
      }
    });
  });
};