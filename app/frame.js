var remote = require('electron').remote,
  ipc = require('electron').ipcRenderer,
  path = remote.require('path'),
  shell = require('electron').shell,
  lodash = require('lodash'),
  $ = require('jquery');

var WatchJS = require('watchjs')
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

var TAB_ID_PREFIX = 'tab-',
  VIEW_WRAPPER_ID_PREFIX = 'view-wrapper-',
  VIEW_ID_PREFIX = 'view-';
var app = { tab: { list: [], selectedTab: null } };

function insertDomElement(parent, type, attributes, innerHtml, eventListeners) {
  if (typeof parent == 'string')
    parent = document.getElementById(parent);
  if (!parent)
    return;

  var insert = document.createElement(type);
  if (attributes)
    for (var attribute in attributes)
      insert.setAttribute(attribute, attributes[attribute]);
  if (innerHtml && typeof innerHtml == 'string' && innerHtml.length > 0)
    insert.innerHTML = innerHtml;
  if (eventListeners && Array.isArray(eventListeners)) {
    for (var i = 0; i < eventListeners.length; i++)
      insert.addEventListener(eventListeners[i].eventName, eventListeners[i].fn);
  }
  parent.appendChild(insert);

  return insert;
}

function removeDomElement(parentId, nodeId) {
  var parentNode = document.getElementById(parentId);
  var removeNode = document.getElementById(nodeId);
  if (parentNode && removeNode)
    parentNode.removeChild(removeNode);
}

app.addTab = function addTab(config) {
  console.log('adding tab', config);
  var id = config.id || app.getTabId();
  var newTab = { id: id, title: config.title, url: config.url, active: false };
  watch(newTab, 'active', function(prop, action, newvalue, oldvalue) {
    console.log('tab active property changed');
    var tabNode = document.getElementById(TAB_ID_PREFIX + this.id);
    var viewWrapperNode = document.getElementById(VIEW_ID_PREFIX + this.id);
    if (tabNode) {
      if (this.active)
        tabNode.classList.add('active');
      else
        tabNode.classList.remove('active');
    }
    if (viewWrapperNode) {
      if (this.active)
        viewWrapperNode.classList.add('active');
      else
        viewWrapperNode.classList.remove('active');
    }
  });
  app.tab.list.push(newTab);
  app.selectTab(id);
};

app.selectTab = function selectTab(id) {
  console.log('selecting tab: '+id);
  if (app.tab.selectedTab)
    app.tab.selectedTab.active = false;
  for (var i = 0; i < app.tab.list.length; i++) {
    if (app.tab.list[i].id === id) {
      app.tab.list[i].active = true;
      app.tab.selectedTab = app.tab.list[i];
      break;
    }
  }
};

app.closeTab = function closeTab(id) {
  for (var i = 0; i < app.tab.list.length; i++) {
    if (app.tab.list[i].id === id) {
      var removedTab = app.tab.list.splice(i, 1);

      // remove tab
      removeDomElement('tabs', TAB_ID_PREFIX + id)
      // remove view
      removeDomElement('views', VIEW_WRAPPER_ID_PREFIX + id)

      // if there is more than 1 tab remaining, select the closest tab
      if (app.tab.list.length > 0) {
        if (app.tab.selectedTab.id === id) {
          app.selectTab(app.tab.list[i-1].id);
        }
      }
      break;
    }
  }

  // if this is the last tab, close the main window
  if (app.tab.list.length === 0) {
    ipc.send('last-tab-closed');
  }
};

app.closeView = function closeView(id) {
  //console.log('closeView', id);
  var view = document.getElementById(VIEW_ID_PREFIX + id);
  if (view)
    view.send('close');
};

app.viewStartedLoading = function viewStartedLoading(event) {
  // console.log('viewStartedLoading');
  // console.log(event.type, event.srcElement.id, event.srcElement.getId());
};

app.viewFinishedLoading = function viewFinishedLoading(event) {
  console.log('viewFinishedLoading');
  // console.log(event.type, event.srcElement.id, event.srcElement.getId());
};

app.viewClosing = function viewClosing(event) {
  //console.log(event.type, event.srcElement.id);
  var id = event.srcElement.id.substring(VIEW_ID_PREFIX.length);
  app.closeTab(id);
};

app.viewCrashed = function viewCrashed(event) {
  console.log(event.type, event.srcElement.id);
};

app.viewDestroyed = function viewDestroyed(event) {
  //console.log(event.type, event.srcElement.id);
};

app.viewConsoleMessage = function viewConsoleMessage(event) {
  if (event.message == 'Uncaught ReferenceError: require is not defined')
    console.log(JSON.stringify({ msg: event.message, webViewId: event.srcElement.id, consoleLine: event.line, consoleSource: event.sourceId }));
  else
    console.log(event.type + ' ' + event.srcElement.id + ': ' + event.message);
};

app.getTabId = function(length) {
  var chars = 'abcdefghiklmnopqrstuvwxyz';
  length = length ? length : 18;
  var string = '';
  for (var i = 0; i < length; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    string += chars.substring(randomNumber, randomNumber + 1);
  }
  return string;
};

ipc.on('toggleDevTools', function(evt, msg) {
  if (!app.tab.selectedTab)
    return;

  var webview = document.getElementById(VIEW_ID_PREFIX + app.tab.selectedTab.id);
  if (webview.isDevToolsOpened())
    webview.closeDevTools();
  else
    webview.openDevTools();
});

watch(app.tab, 'list', function(prop, action, newValue, oldValue) {
  console.log('app.tab.list changed!!');
  console.log(prop);
  console.log(action);
  console.log(newValue);
  console.log(oldValue);

 if (action === 'push') {
    _.each(newValue, function(tab) {
      console.log('tab is: ', tab);
      var tabNodeAttributes = {
        id: TAB_ID_PREFIX + tab.id,
        onclick: 'app.selectTab(\'' + tab.id + '\')'
      };
      tabNodeAttributes.class = tab.active ? 'tab active' : 'tab';
      var viewWrapperNodeAttributes = {
        id: VIEW_WRAPPER_ID_PREFIX + tab.id,
      };
      //viewWrapperNodeAttributes.class = tab.selected ? 'view-wrapper selected' : 'view-wrapper';
      var viewNodeAttributes = {
        id: VIEW_ID_PREFIX + tab.id,
        src: tab.url,
        nodeintegration: null
      };
      viewNodeAttributes.class = tab.active ? 'active' : '';

      function webViewFinishedLoading(evt) {
        console.log('web view finished loading!');

        var tabTitle = document.getElementById(viewNodeAttributes.id).getTitle().replace('MavensMate |', '');
        $('li#tab-'+tab.id+' div.title').html(tabTitle);

        // fade out loading webview
        $('#'+VIEW_ID_PREFIX + tab.id + '-loading').fadeOut( 200, function() {
          // remove loading webview from DOM
          removeDomElement(viewWrapperNodeAttributes.id, VIEW_ID_PREFIX + tab.id + '-loading');

          // notify app view finished loading
          app.viewFinishedLoading(evt);
        });
      }

      function webViewStartedLoading(evt) {
        console.log('web view started loading ...');
        // console.log(evt);
      }

      function webViewNewWindowHandler(e) {
        if (e.url.indexOf('localhost') > 0) {
          app.addTab({ id: '' , url: e.url });
        } else {
          shell.openExternal(e.url);
        }
      }

      insertDomElement(
        'tabs',
        'li',
        tabNodeAttributes,
        ' <div class="title">Loading...</div> <div class="octicon octicon-x close-icon" onclick="closeTab(\'' + tab.id + '\')"></div>'
      );

      var wrapper = insertDomElement('views', 'div', viewWrapperNodeAttributes);
      var loadingWebView = insertDomElement(viewWrapperNodeAttributes.id, 'webview', {
          id: VIEW_ID_PREFIX + tab.id + '-loading',
          src: 'file://' + __dirname + '/loading.html',
          class: 'webViewLoading'
        }, null, [

      ]);
      var newWebView = insertDomElement(viewWrapperNodeAttributes.id, 'webview', viewNodeAttributes, null, [
        { eventName: 'did-start-loading', fn:  webViewStartedLoading },
        { eventName: 'did-finish-load', fn:  webViewFinishedLoading },
        { eventName: 'close', fn:  app.viewClosing },
        { eventName: 'crashed', fn:  app.viewCrashed },
        { eventName: 'destroyed', fn:  app.viewDestroyed },
        { eventName: 'console-message', fn:  app.viewConsoleMessage },
        { eventName: 'new-window', fn:  webViewNewWindowHandler }
      ]);
    });
  }

});