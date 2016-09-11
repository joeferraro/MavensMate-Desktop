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

var _WebView = require('./WebView');

var _WebView2 = _interopRequireDefault(_WebView);

var _redux = require('redux');

var _actions = require('../actions/actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UpdateNotifier = function (_Component) {
  _inherits(UpdateNotifier, _Component);

  function UpdateNotifier(props) {
    _classCallCheck(this, UpdateNotifier);

    var _this = _possibleConstructorReturn(this, (UpdateNotifier.__proto__ || Object.getPrototypeOf(UpdateNotifier)).call(this, props));

    _this._close = _this._close.bind(_this);
    return _this;
  }

  _createClass(UpdateNotifier, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('UpdateNotifier PROPS: ', this.props);
    }
  }, {
    key: '_quitAndInstall',
    value: function _quitAndInstall() {
      var electron = window.require('electron');
      var ipc = electron.ipcRenderer;
      ipc.send('quit-and-install');
    }
  }, {
    key: '_openUrl',
    value: function _openUrl() {
      var electron = window.require('electron');
      electron.shell.openExternal('https://github.com/joeferraro/MavensMate-Desktop/releases');
    }
  }, {
    key: '_close',
    value: function _close() {
      this.props.dispatch(actions.hideUpdateNotifier());
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: "slds-notify_container desktop-update-notifier " + (this.props.update.show ? 'show' : '') },
        _react2.default.createElement(
          'div',
          { className: 'slds-notify slds-notify--alert slds-theme--alert-texture', role: 'alert' },
          _react2.default.createElement(
            'button',
            { className: 'slds-button slds-notify__close slds-button--icon-inverse', onClick: function onClick() {
                return _this2._close();
              } },
            _react2.default.createElement(
              'svg',
              { 'aria-hidden': true, className: 'slds-button__icon' },
              _react2.default.createElement('use', { xlinkHref: 'styles/lds/assets/icons/utility-sprite/svg/symbols.svg#close' })
            ),
            _react2.default.createElement(
              'span',
              { className: 'slds-assistive-text' },
              'Close'
            )
          ),
          _react2.default.createElement(
            'span',
            { className: 'slds-assistive-text' },
            'Info'
          ),
          _react2.default.createElement(
            'h2',
            null,
            this.props.update.action === 'quit' && _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(
                'a',
                { href: 'javascript:void(0);', onClick: function onClick() {
                    return _this2._openUrl();
                  } },
                'Version ',
                this.props.update.releaseName
              ),
              ' is ready to install.  ',
              _react2.default.createElement(
                'a',
                { id: 'install', href: '#', onClick: function onClick() {
                    return _this2._quitAndInstall();
                  } },
                'Restart MavensMate'
              ),
              ' to upgrade.'
            ),
            this.props.update.action === 'download' && _react2.default.createElement(
              'span',
              null,
              'A new version (v',
              this.props.update.releaseName,
              ') of MavensMate is ',
              _react2.default.createElement(
                'a',
                { href: 'javascript:void(0);', onClick: function onClick() {
                    return _this2._openUrl();
                  } },
                'ready for download'
              ),
              '.'
            )
          )
        )
      );
    }
  }]);

  return UpdateNotifier;
}(_react.Component);

function select(state) {
  return state;
}

exports.default = (0, _reactRedux.connect)(select)(UpdateNotifier);
//# sourceMappingURL=UpdateNotifier.js.map
