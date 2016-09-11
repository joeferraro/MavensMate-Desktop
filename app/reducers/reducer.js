'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = require('../actions/actions');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var uuid = require('node-uuid');
var update = require('react-addons-update');

var initialState = {
  viewManager: {
    show: false
  },
  views: [],
  loading: false,
  showUpdateNotification: false,
  update: {
    show: false,
    action: '',
    releaseName: ''
  }
};

function views() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var action = arguments[1];

  console.log('views reducer', state, action);
  switch (action.type) {
    case _actions.ADD_VIEW:
      var url = action.url || 'http://localhost:56248/app/home';
      return [].concat(_toConsumableArray(state.map(function (view, index) {
        return Object.assign({}, view, {
          show: false
        });
      })), [{
        id: uuid.v1(),
        show: true,
        url: url,
        pid: action.pid,
        sldsSprite: 'standard-sprite',
        sldsIconClassName: 'slds-icon-standard-generic-loading',
        sldsIconName: 'generic_loading'
      }]);
    case _actions.UPDATE_VIEW:
      return state.map(function (view, index) {
        if (view.id === action.obj.id) {
          // we dont update url here because user could be navigating, which will change src value
          return Object.assign({}, view, {
            pid: action.obj.pid || view.pid,
            title: action.obj.title || view.title,
            projectName: action.obj.projectName || view.projectName,
            sldsIconClassName: action.obj.sldsIconClassName || view.sldsIconClassName,
            sldsIconName: action.obj.sldsIconName || view.sldsIconName,
            sldsSprite: action.obj.sldsSprite || view.sldsSprite,
            status: action.obj.status || view.status
          });
        }
        return view;
      });
    case _actions.SHOW_VIEW:
      return state.map(function (view, index) {
        return Object.assign({}, view, {
          show: view.id === action.id ? true : false,
          status: view.status === 'operation:stopped' ? 'none' : view.status
        });
      });
    case _actions.DESTROY_VIEW:
      var findView = function findView(view) {
        return view.id === action.id;
      };

      var view = state.find(findView);
      var viewIndex = state.findIndex(findView);
      console.log('attempting to close view', viewIndex, view);
      if (view.show && viewIndex !== 0 && !state[viewIndex - 1].show) state[viewIndex - 1].show = true;else if (view.show && viewIndex === 0 && state.length > 1 && !state[viewIndex + 1].show) state[viewIndex + 1].show = true;
      return update(state, { $splice: [[viewIndex, 1]] });
    default:
      return state;
  }
}

function app() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.SHOW_VIEW_MANAGER:
      return Object.assign({}, state, {
        viewManager: {
          show: true
        }
      });
    case _actions.HIDE_VIEW_MANAGER:
      return Object.assign({}, state, {
        viewManager: {
          show: false
        }
      });
    case _actions.ADD_VIEW:
    case _actions.UPDATE_VIEW:
    case _actions.SHOW_VIEW:
    case _actions.DESTROY_VIEW:
      return Object.assign({}, state, {
        views: views(state.views, action)
      });
    case _actions.SHOW_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case _actions.HIDE_LOADING:
      return Object.assign({}, state, {
        loading: false
      });
    case _actions.SHOW_UPDATE_NOTIFIER:
      return Object.assign({}, state, {
        update: {
          show: true,
          action: action.action,
          releaseName: action.releaseName
        }
      });
    case _actions.HIDE_UPDATE_NOTIFIER:
      return Object.assign({}, state, {
        update: {
          show: false,
          action: '',
          releaseName: ''
        }
      });
    default:
      return state;
  }
}

exports.default = app;
//# sourceMappingURL=reducer.js.map
