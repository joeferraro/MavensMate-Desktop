var remote = require('remote'),
  ipc = require('ipc'),
  path = remote.require('path'),
  shell = require('shell');

var TAB_ID_PREFIX = 'tab-',
  VIEW_WRAPPER_ID_PREFIX = 'view-wrapper',
  VIEW_ID_PREFIX = 'view-';
  // PRELOAD_FILE_PATH = path.join(__dirname, 'preload.js');
  // console.log(PRELOAD_FILE_PATH)
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
  var id = config.id || app.getTabId();
  var newTab = { id: id, title: config.title, url: config.url, active: false };

  Object.observe(newTab, app.tabRenderer);
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
  if (app.tab.list.length === 1) return;
  for (var i = 0; i < app.tab.list.length; i++) {
    if (app.tab.list[i].id === id) {
      var removedTab = app.tab.list.splice(i, 1);
      if (app.tab.selectedTab.id === id) {
        app.selectTab(app.tab.list[i-1].id);        
      }
      break;
    }
  }
};

app.closeView = function closeView(id) {
  //console.log('closeView', id);
  var view = document.getElementById(VIEW_ID_PREFIX + id);
  if (view)
    view.send('close');
};

app.viewStartedLoading = function viewStartedLoading(event) {
  //console.log(event.type, event.srcElement.id, event.srcElement.getId());
};

app.viewFinishedLoading = function viewFinishedLoading(event) {
  //console.log(event.type, event.srcElement.id, event.srcElement.getId());
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

ipc.on('toggleDevTools', function(msg) {
  //console.log('toggleDevTools on active webview');
  if (!app.tab.selectedTab)
    return;

  var webview = document.getElementById(VIEW_ID_PREFIX + app.tab.selectedTab.id);
  if (webview.isDevToolsOpened())
    webview.closeDevTools();
  else
    webview.openDevTools();
});

app.tabsArrayRenderer = function tabsArrayRenderer(changes) {
  var addIndices = [];  
  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];
    if (change.object == app.tab.list && change.type == 'splice') {
      if (change.removed.length > 0) {
        var removedCount = change.removed.length;
        for (var j = 0; j < removedCount; j++) {
          var removeIndex = change.index + j;
          var removeAddIndex = addIndices.indexOf(removeIndex);
          if (removeAddIndex >= 0) // to be added
            addIndices.splice(removeAddIndex, 1);
          else {// already exists
            // remove tab
            removeDomElement('tabs', TAB_ID_PREFIX + change.removed[j].id)
            // remove view
            removeDomElement('views', VIEW_ID_PREFIX + change.removed[j].id)
          }
        }
        for (var j = 0; j < addIndices.length; j++) {
          if (addIndices[j] > change.index)
            addIndices[j] -= removedCount;
        }
      }
      if (change.addedCount > 0) {
        for (var j = 0; j < change.addedCount; j++)
          addIndices.push(change.index + j);
      }
    }
  }
  // add remaining additions to DOM
  for (var i = 0; i < addIndices.length; i++) {
    var tab = app.tab.list[addIndices[i]];
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
      // preload: PRELOAD_FILE_PATH,
      nodeintegration: null
    };
    viewNodeAttributes.class = tab.active ? 'active' : '';

    function webViewFinishedLoading(evt) {
      var newWebView2 = document.getElementById(viewNodeAttributes.id);
      insertDomElement('tabs', 'li', tabNodeAttributes, ' <div class="title">'+newWebView2.getTitle().replace('MavensMate |', '')+'</div> <div class="octicon octicon-x close-icon" onclick="closeTab(\'' + tab.id + '\')"></div>');
      app.viewFinishedLoading(evt);
    }

    function webViewNewWindowHandler(e) {
      console.log('webViewNewWindowHandler', e);
      if (e.url.indexOf('localhost') > 0) {
        app.addTab({ id: '' , url: e.url });
      } else {
        shell.openExternal(e.url);
      }
    }

    //var wrapper = insertDomElement('views', 'div', viewWrapperNodeAttributes);
    var newWebView = insertDomElement('views', 'webview', viewNodeAttributes, null, [
      { eventName: 'did-start-loading', fn:  app.viewStartedLoading },
      { eventName: 'did-finish-load', fn:  webViewFinishedLoading },
      { eventName: 'close', fn:  app.viewClosing },
      { eventName: 'crashed', fn:  app.viewCrashed },
      { eventName: 'destroyed', fn:  app.viewDestroyed },
      { eventName: 'console-message', fn:  app.viewConsoleMessage },
      { eventName: 'new-window', fn:  webViewNewWindowHandler }
    ]);

  }
};
Array.observe(app.tab.list, app.tabsArrayRenderer);
app.tabRenderer = function tabRenderer(changes) {
  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];
    var tab = change.object;
    var tabNode = document.getElementById(TAB_ID_PREFIX + tab.id);
    var viewWrapperNode = document.getElementById(VIEW_ID_PREFIX + tab.id);
    if (change.type === 'update' && change.name === 'active') {
      if (tabNode) {
        if (tab[change.name])
          tabNode.classList.add('active');
        else
          tabNode.classList.remove('active');
      }
      if (viewWrapperNode) {
        if (tab[change.name])
          viewWrapperNode.classList.add('active');
        else
          viewWrapperNode.classList.remove('active');
      }
    }
  }
};