var projectHelper   = require('./project-helper');
var uuid            = require('node-uuid');

function WebView(launcher) {
  this.launcher = launcher;
  this.id = uuid.v1();
  this.loadingTimeout;
}

/**
 * attaches a web view to the dom
 * @param  {String} url - url of the webview
 * @return {Nothing}
 */
WebView.prototype.attach = function(url) {
  console.log('[WebViewArray.attach] creating webview for url and placing in dom', url);
  var self = this;
  var newWebViewNode = document.createElement('webview');
  newWebViewNode.setAttribute('id', this.id);
  newWebViewNode.setAttribute('src', url);
  newWebViewNode.setAttribute('nodeintegration', null); // this is required so that our mavensmate-server view can use ipc

  newWebViewNode.addEventListener('ipc-message', function(evt) {
    console.log('new message from guest page', evt.channel, evt.args[0]);
    // we want to know when the guest page has loaded
    // so that we can update our internal index with the title of the page, icon, etc.
    if (evt.channel === 'on-load') {
      var params = evt.args[0];
      newWebViewNode.setAttribute('data-title', params.title);
      if (params.pid) {
        if (params.pid) {
          newWebViewNode.setAttribute('data-pid', params.pid);
          newWebViewNode.setAttribute('data-project-name', params.projectName);
        }
      }
      if (params.sldsIconClassName) {
        newWebViewNode.setAttribute('data-slds-icon-class-name', params.sldsIconClassName);
        newWebViewNode.setAttribute('data-slds-icon-name', params.sldsIconName);
        newWebViewNode.setAttribute('data-slds-sprite', params.sldsSprite);
      }
    }
    self.launcher.rerender();
  });

  newWebViewNode.addEventListener('did-start-loading', function() {
    if (!$(this).hasClass('hide')) {
      if (self.loadingTimeout) { clearTimeout(self.loadingTimeout); }
      self.loadingTimeout = setTimeout(function() {
        $('#global-loading').show();
      }, 1000);
    }
  });

  newWebViewNode.addEventListener('did-stop-loading', function() {
    if (!$(this).hasClass('hide')) {
      if (self.loadingTimeout) { clearTimeout(self.loadingTimeout); }
      $('#global-loading').hide();
    }
  });

  newWebViewNode.addEventListener('new-window', function(e) {
    console.log('new window opened by webview', e);
    if (e.url.indexOf('localhost') > 0) {
      launcher.addView(e.url); // we dont need to call launcher.rerender here because it will do so when the webview loads above ^^
    } else {
      shell.openExternal(e.url);
    }
  });

  var viewsDiv = document.getElementById('views');
  viewsDiv.appendChild(newWebViewNode);
};

module.exports = WebView;