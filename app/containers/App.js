'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reactElectronWebview = require('react-electron-webview');

var _reactElectronWebview2 = _interopRequireDefault(_reactElectronWebview);

var _actions = require('../actions/actions');

var actions = _interopRequireWildcard(_actions);

var _Views = require('./Views');

var _Views2 = _interopRequireDefault(_Views);

var _ViewManager = require('./ViewManager');

var _ViewManager2 = _interopRequireDefault(_ViewManager);

var _Loading = require('./Loading');

var _Loading2 = _interopRequireDefault(_Loading);

var _UpdateNotifier = require('./UpdateNotifier');

var _UpdateNotifier2 = _interopRequireDefault(_UpdateNotifier);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('APP PROPS: ', this.props);

      var dispatch = this.props.dispatch;

      var electron = window.require('electron');
      var ipc = electron.ipcRenderer;
      var remote = electron.remote;

      ipc.on('new-web-view', function (evt, url) {
        dispatch(actions.addView(url));
      });

      ipc.on('show-view-manager', function (evt) {
        console.log('showing view manager');
        dispatch(actions.showViewManager());
      });

      ipc.on('show-update-notifier', function (evt, releaseName, action) {
        console.log('showing update notifier', releaseName, action);
        dispatch(actions.showUpdateNotifier(releaseName, action));
      });

      // dispatch(actions.showUpdateNotifier('0.0.12', 'quit'));

      window.addEventListener('keydown', _handleKeyDown, false);

      function _handleKeyDown(e) {
        console.log(e);
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
          dispatch(actions.showViewManager());
        } else if (e.metaKey && e.which === 82) {
          // ctrl + r to reload page
          // var webview = document.querySelector('webview:not(.hide)');
          // webview.reload();
          // e.preventDefault();
        } else if (e.metaKey && e.which === 219) {
          // ctrl + [ to go back
          var webview = document.querySelector('webview:not(.hide)');
          webview.goBack();
        } else if (e.metaKey && e.which === 221) {
          // ctrl + ] to go forward
          var webview = document.querySelector('webview:not(.hide)');
          webview.goForward();
        }
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      this.props.setForm({ name: e.target.value });
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      var name = this.refs.nameField.value.trim();
      this.props.addName({ name: name });
    }
  }, {
    key: 'render',
    value: function render() {
      var dispatch = this.props.dispatch;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Views2.default, (0, _redux.bindActionCreators)(actions, dispatch)),
        _react2.default.createElement(_ViewManager2.default, (0, _redux.bindActionCreators)(actions, dispatch)),
        _react2.default.createElement(_Loading2.default, (0, _redux.bindActionCreators)(actions, dispatch)),
        _react2.default.createElement(_UpdateNotifier2.default, (0, _redux.bindActionCreators)(actions, dispatch))
      );
    }
  }]);

  return App;
}(_react.Component);

function select(state) {
  return state;
}

exports.default = (0, _reactRedux.connect)(select)(App);
//# sourceMappingURL=App.js.map
