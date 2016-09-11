'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _reactElectronWebview = require('react-electron-webview');

var _reactElectronWebview2 = _interopRequireDefault(_reactElectronWebview);

var _actions = require('../actions/actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebView = function (_Component) {
  _inherits(WebView, _Component);

  function WebView(props) {
    _classCallCheck(this, WebView);

    var _this = _possibleConstructorReturn(this, (WebView.__proto__ || Object.getPrototypeOf(WebView)).call(this, props));

    _this._onIpcMessage = _this._onIpcMessage.bind(_this);
    _this._onNewWindow = _this._onNewWindow.bind(_this);
    _this._didStartLoading = _this._didStartLoading.bind(_this);
    _this._didStopLoading = _this._didStopLoading.bind(_this);
    _this._didFinishLoad = _this._didFinishLoad.bind(_this);
    _this._loadingTimeout;
    return _this;
  }

  _createClass(WebView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('component mounted!!!');
      var element = _reactDom2.default.findDOMNode(this);
      element.setAttribute('nodeintegration', '');
      element.setAttribute('id', this.props.view.id);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var element = _reactDom2.default.findDOMNode(this);
      element.setAttribute('nodeintegration', '');
    }
  }, {
    key: '_isHidden',
    value: function _isHidden(v) {
      return v.show ? '' : 'hide';
    }
  }, {
    key: '_didStartLoading',
    value: function _didStartLoading() {
      var _this2 = this;

      console.log('webview start loading');
      if (this.props.view.show) {
        if (this._loadingTimeout) {
          clearTimeout(this._loadingTimeout);
        }
        this._loadingTimeout = setTimeout(function () {
          return _this2.props.dispatch(actions.showLoading());
        }, 1000);
      }
    }
  }, {
    key: '_didStopLoading',
    value: function _didStopLoading() {
      console.log('webview stop loading');
      if (this.props.view.show) {
        if (this._loadingTimeout) {
          clearTimeout(this._loadingTimeout);
        }
        this.props.dispatch(actions.hideLoading());
      }
    }
  }, {
    key: '_didFinishLoad',
    value: function _didFinishLoad() {
      console.log('webview finish load');
    }
  }, {
    key: '_onIpcMessage',
    value: function _onIpcMessage(evt) {
      var params = evt.args[0];
      console.log('new ipc message -->', evt, params);
      if (evt.channel === 'on-load') {
        this.props.dispatch(actions.updateView({
          id: this.props.view.id,
          pid: params.pid,
          title: params.title,
          projectName: params.projectName,
          sldsIconClassName: params.sldsIconClassName,
          sldsIconName: params.sldsIconName,
          sldsSprite: params.sldsSprite
        }));
      } else if (evt.channel === 'operation:running') {
        this.props.dispatch(actions.updateView({
          id: this.props.view.id,
          status: 'operation:running'
        }));
      } else if (evt.channel === 'operation:stopped') {
        this.props.dispatch(actions.updateView({
          id: this.props.view.id,
          status: 'operation:stopped'
        }));
      }
    }
  }, {
    key: '_onNewWindow',
    value: function _onNewWindow(e) {
      console.log('new window opened by webview', e);
      if (e.url.indexOf('localhost') > 0) {
        this.props.dispatch(actions.addView(e.url));
      } else {
        window.require('electron').shell.openExternal(e.url);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var view = this.props.view;
      return _react2.default.createElement(_reactElectronWebview2.default, {
        className: this._isHidden(view),
        didFinishLoad: this._didFinishLoad,
        didStartLoading: this._didStartLoading,
        didStopLoading: this._didStopLoading,
        newWindow: this._onNewWindow,
        ipcMessage: this._onIpcMessage,
        nodeintegration: true,
        key: view.id, src: view.url });
    }
  }]);

  return WebView;
}(_react.Component);

function select(state) {
  return state;
}

exports.default = (0, _reactRedux.connect)(select)(WebView);
//# sourceMappingURL=WebView.js.map
