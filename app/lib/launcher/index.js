var _                   = require('lodash');
var swig                = require('swig');
var MavensMateWebView   = require('../webview');

function Launcher(id) {
  this._webviews = [];
  this._id = id || 'app-launcher-modal';
  this._template = swig.compileFile('./lib/launcher/index.tpl.html');
  this._body = swig.compileFile('./lib/launcher/body.tpl.html');
}

Launcher.prototype.attach = function() {
  document.body.innerHTML += this._template({ id: this._id });
  this._$el = $('#'+this._id);
  this._$el.modal();
};

Launcher.prototype.show = function() {
  this.rerender();
  this._$el.modal('show');
};

Launcher.prototype.hide = function() {
  this._$el.modal('dismiss');
};

Launcher.prototype.rerender = function() {
  this.renderBody();
};

Launcher.prototype.renderBody = function() {
  var projects = {};
  var uncategorized = [];
  var projectIdToNameMap = {};

  var elements = document.querySelectorAll('#views webview');
  Array.prototype.forEach.call(elements, function(el, i) {
    if (el.getAttribute('data-pid')) {
      var pid = el.getAttribute('data-pid');
      if (!projects[pid]) {
        projects[pid] = [el];
      } else {
        projects[pid].push(el);
      }
      if (!projectIdToNameMap[pid]) {
        projectIdToNameMap[pid] = el.getAttribute('data-project-name');
      }
    } else {
      uncategorized.push(el);
    }
  });

  var html = this._body({
    projects: projects,
    uncategorized: uncategorized,
    projectIdToNameMap: projectIdToNameMap,
    launcher: this
  });

  this._$el.find('.slds-modal__content').html(html);
};

Launcher.prototype.showView = function(id) {
  console.log('showing web view...', id);
  $('#views > webview').removeClass('hide').addClass('hide');
  $('#'+id).removeClass('hide');
  this.hide();
};

Launcher.prototype.addView = function(url) {
  var webView = new MavensMateWebView(this);
  webView.attach(url);
  this._webviews.push(webView);
  this.showView(webView.id);
};

Launcher.prototype.destroyView = function(id) {
  var $viewToDelete = $('#'+id);
  if (!$viewToDelete.hasClass('hide') && $viewToDelete.prev() && $viewToDelete.prev().hasClass('hide'))
    $viewToDelete.prev().removeClass('hide');
  var parentNode = document.getElementById('views');
  var removeNode = document.getElementById(id);
  if (parentNode && removeNode)
    parentNode.removeChild(removeNode);
  this._webviews = _.remove(this._webviews, function(wv) {
    return wv.id !== id;
  });
  this.rerender();
};

var launcher = new Launcher();

$(function() {
  launcher.attach();
});

module.exports = launcher;