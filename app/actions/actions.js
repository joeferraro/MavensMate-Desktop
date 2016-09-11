'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addView = addView;
exports.updateView = updateView;
exports.destroyView = destroyView;
exports.showView = showView;
exports.showViewManager = showViewManager;
exports.hideViewManager = hideViewManager;
exports.showLoading = showLoading;
exports.hideLoading = hideLoading;
exports.showUpdateNotifier = showUpdateNotifier;
exports.hideUpdateNotifier = hideUpdateNotifier;
/*
 * action types
 */

var ADD_VIEW = exports.ADD_VIEW = 'ADD_VIEW';
var DESTROY_VIEW = exports.DESTROY_VIEW = 'DESTROY_VIEW';
var UPDATE_VIEW = exports.UPDATE_VIEW = 'UPDATE_VIEW';
var SHOW_VIEW = exports.SHOW_VIEW = 'SHOW_VIEW';
var SHOW_VIEW_MANAGER = exports.SHOW_VIEW_MANAGER = 'SHOW_VIEW_MANAGER';
var HIDE_VIEW_MANAGER = exports.HIDE_VIEW_MANAGER = 'HIDE_VIEW_MANAGER';
var SHOW_LOADING = exports.SHOW_LOADING = 'SHOW_LOADING';
var HIDE_LOADING = exports.HIDE_LOADING = 'HIDE_LOADING';
var SHOW_UPDATE_NOTIFIER = exports.SHOW_UPDATE_NOTIFIER = 'SHOW_UPDATE_NOTIFIER';
var HIDE_UPDATE_NOTIFIER = exports.HIDE_UPDATE_NOTIFIER = 'HIDE_UPDATE_NOTIFIER';

/*
 * action creators
 */

function addView(url, pid) {
  return { type: ADD_VIEW, url: url, pid: pid };
}

function updateView(obj) {
  return { type: UPDATE_VIEW, obj: obj };
}

function destroyView(id) {
  return { type: DESTROY_VIEW, id: id };
}

function showView(id) {
  return { type: SHOW_VIEW, id: id };
}

function showViewManager() {
  return { type: SHOW_VIEW_MANAGER };
}

function hideViewManager() {
  return { type: HIDE_VIEW_MANAGER };
}

function showLoading() {
  return { type: SHOW_LOADING };
}

function hideLoading() {
  return { type: HIDE_LOADING };
}

function showUpdateNotifier(releaseName, action) {
  return { type: SHOW_UPDATE_NOTIFIER, releaseName: releaseName, action: action };
}

function hideUpdateNotifier() {
  return { type: HIDE_UPDATE_NOTIFIER };
}
//# sourceMappingURL=actions.js.map
