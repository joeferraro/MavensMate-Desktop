'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var ViewManager = function (_Component) {
  _inherits(ViewManager, _Component);

  function ViewManager(props) {
    _classCallCheck(this, ViewManager);

    var _this = _possibleConstructorReturn(this, (ViewManager.__proto__ || Object.getPrototypeOf(ViewManager)).call(this, props));

    _this._handleKeyDown = _this._handleKeyDown.bind(_this);
    _this._addView = _this._addView.bind(_this);
    _this._showView = _this._showView.bind(_this);
    _this._destroyView = _this._destroyView.bind(_this);
    _this._hide = _this._hide.bind(_this);
    _this._boxClasses = _this._boxClasses.bind(_this);
    return _this;
  }

  _createClass(ViewManager, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('keydown', this._handleKeyDown, false);
    }
  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(e) {
      if (e.which === 27) {
        this._hide();
      }
    }
  }, {
    key: '_hide',
    value: function _hide() {
      this.props.dispatch(actions.hideViewManager());
    }
  }, {
    key: '_modalClasses',
    value: function _modalClasses() {
      var classNames = ['slds-modal', 'slds-modal--large', 'slds-fade-in-open'];
      if (!this.props.viewManager.show) {
        classNames.push('slds-hide');
      }
      return classNames.join(' ');
    }
  }, {
    key: '_backdropClasses',
    value: function _backdropClasses() {
      return this.props.viewManager.show ? 'slds-backdrop slds-backdrop--open' : 'slds-backdrop';
    }
  }, {
    key: '_projectViews',
    value: function _projectViews() {
      return this.props.views.reduce(function (obj, v) {
        if (v.pid && !obj[v.pid]) obj[v.pid] = [];
        if (v.pid) obj[v.pid].push(v);
        return obj;
      }, {});
    }
  }, {
    key: '_otherViews',
    value: function _otherViews() {
      var arr = [];
      for (var v in this.props.views) {
        if (!this.props.views[v].pid) arr.push(this.props.views[v]);
      }
      return arr;
    }
  }, {
    key: '_showView',
    value: function _showView(view) {
      var dispatch = this.props.dispatch;

      dispatch(actions.showView(view.id));
      dispatch(actions.hideViewManager());
    }
  }, {
    key: '_destroyView',
    value: function _destroyView(view) {
      var dispatch = this.props.dispatch;

      var id = view.id;
      dispatch(actions.destroyView(id));
    }
  }, {
    key: '_addView',
    value: function _addView(pid) {
      console.log('adding view: ', pid);
      var dispatch = this.props.dispatch;

      if (pid) {
        var url = 'http://localhost:56248/app/project/' + pid + '?pid=' + pid;
        dispatch(actions.addView(url, pid));
      } else {
        dispatch(actions.addView());
      }
    }
  }, {
    key: '_boxClasses',
    value: function _boxClasses(view) {
      var classNames = ['view-manager-box', 'slds-box', 'slds-box--small', 'slds-theme--shade', 'slds-text-align--center'];
      if (view.show) {
        classNames.push('active');
      }
      if (view.status === 'operation:stopped') {
        classNames.push('has-information');
      }
      return classNames.join(' ');
    }
  }, {
    key: '_renderOtherTiles',
    value: function _renderOtherTiles() {
      var _this2 = this;

      var dispatch = this.props.dispatch;

      var tiles = [];
      var otherViews = this._otherViews();

      if (otherViews.length > 0) {
        var _loop = function _loop(i) {
          var view = otherViews[i];
          tiles.push(_react2.default.createElement(
            'div',
            { key: view.id, className: 'view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large' },
            _react2.default.createElement(
              'a',
              { onClick: function onClick() {
                  return _this2._showView(view);
                }, className: "view-manager-box slds-box slds-box--small slds-theme--shade slds-text-align--center " + (view.show ? 'active ' : ''), href: 'javascript:void(0);' },
              _react2.default.createElement(
                'div',
                { className: 'uiBlock' },
                _react2.default.createElement(
                  'div',
                  { className: 'view-manager-icon' },
                  _react2.default.createElement(
                    'span',
                    { className: "slds-icon_container " + view.sldsIconClassName },
                    _react2.default.createElement(
                      'svg',
                      { 'aria-hidden': true, className: 'slds-icon slds-icon--large' },
                      _react2.default.createElement('use', { xlinkHref: "styles/lds/assets/icons/" + view.sldsSprite + "/svg/symbols.svg#" + view.sldsIconName })
                    ),
                    _react2.default.createElement('span', { className: 'slds-assistive-text' })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'view-manager-body' },
                  _react2.default.createElement(
                    'div',
                    { className: 'slds-section__title slds-truncate' },
                    view.title
                  )
                )
              )
            ),
            _react2.default.createElement(
              'a',
              { className: "view-manager-tile-close slds-button slds-button--icon " + (otherViews.length === 1 ? 'last-tile' : ''), href: 'javascript:void(0);', onClick: function onClick() {
                  return _this2._destroyView(view);
                } },
              _react2.default.createElement(
                'svg',
                { 'aria-hidden': true, className: 'slds-button__icon slds-button__icon--large' },
                _react2.default.createElement('use', { xlinkHref: 'styles/lds/assets/icons/utility-sprite/svg/symbols.svg#close' })
              ),
              _react2.default.createElement(
                'span',
                { className: 'slds-assistive-text' },
                'Settings'
              )
            )
          ));
        };

        for (var i in otherViews) {
          _loop(i);
        }
      }

      return tiles;
    }
  }, {
    key: '_renderProjectTiles',
    value: function _renderProjectTiles() {
      var _this3 = this;

      var dispatch = this.props.dispatch;

      var projectTileElements = [];

      var projectViews = this._projectViews();

      console.log('rendering project tiles ...', projectViews);

      var _loop2 = function _loop2(pid) {
        var thisProjectViews = projectViews[pid];
        console.log('thisProjectViews', thisProjectViews);
        projectTileElements.push(_react2.default.createElement(
          'div',
          { className: 'slds-text-heading--medium slds-m-bottom--medium' },
          thisProjectViews[0].projectName
        ));

        tiles = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop3 = function _loop3() {
            var view = _step.value;

            tiles.push(_react2.default.createElement(
              'div',
              { key: view.id, className: "view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large " + (view.status === 'operation:running' ? 'view-manager-tile-running' : '') },
              _react2.default.createElement(
                'a',
                { onClick: function onClick() {
                    return _this3._showView(view);
                  }, className: _this3._boxClasses(view), href: 'javascript:void(0);' },
                _react2.default.createElement(
                  'div',
                  { className: 'uiBlock' },
                  _react2.default.createElement(
                    'div',
                    { className: 'view-manager-icon' },
                    _react2.default.createElement(
                      'span',
                      { className: "slds-icon_container " + view.sldsIconClassName },
                      _react2.default.createElement(
                        'svg',
                        { 'aria-hidden': true, className: 'slds-icon slds-icon--large' },
                        _react2.default.createElement('use', { xlinkHref: "styles/lds/assets/icons/" + view.sldsSprite + "/svg/symbols.svg#" + view.sldsIconName })
                      ),
                      _react2.default.createElement('span', { className: 'slds-assistive-text' })
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'view-manager-body' },
                    _react2.default.createElement(
                      'div',
                      { className: 'slds-section__title slds-truncate' },
                      view.title
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'a',
                { className: 'view-manager-tile-close slds-button slds-button--icon', href: 'javascript:void(0);', onClick: function onClick() {
                    return _this3._destroyView(view);
                  } },
                _react2.default.createElement(
                  'svg',
                  { 'aria-hidden': true, className: 'slds-button__icon slds-button__icon--large' },
                  _react2.default.createElement('use', { xlinkHref: 'styles/lds/assets/icons/utility-sprite/svg/symbols.svg#close' })
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'slds-assistive-text' },
                  'Destroy View'
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'slds-spinner--brand slds-spinner slds-spinner--small tile-running-indicator', role: 'alert' },
                _react2.default.createElement(
                  'span',
                  { className: 'slds-assistive-text' },
                  'Loading'
                ),
                _react2.default.createElement('div', { className: 'slds-spinner__dot-a' }),
                _react2.default.createElement('div', { className: 'slds-spinner__dot-b' })
              )
            ));
          };

          for (var _iterator = thisProjectViews[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop3();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        projectTileElements.push(_react2.default.createElement(
          'div',
          { className: 'slds-grid slds-wrap slds-grid--pull-padded' },
          _react2.default.createElement(
            'div',
            { className: 'view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large' },
            _react2.default.createElement(
              'a',
              { onClick: function onClick() {
                  return _this3._addView(pid);
                }, className: 'view-manager-box slds-box slds-box--small slds-theme--shade slds-text-align--center', href: 'javascript:void(0);' },
              _react2.default.createElement(
                'div',
                { className: 'uiBlock' },
                _react2.default.createElement(
                  'div',
                  { className: 'view-manager-icon' },
                  _react2.default.createElement(
                    'span',
                    { className: 'slds-button slds-button--icon' },
                    _react2.default.createElement(
                      'svg',
                      { 'aria-hidden': true, className: 'slds-button__icon slds-icon--large' },
                      _react2.default.createElement('use', { xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: 'styles/lds/assets/icons/utility-sprite/svg/symbols.svg#add' })
                    ),
                    _react2.default.createElement('span', { className: 'slds-assistive-text' })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'view-manager-body' },
                  _react2.default.createElement(
                    'div',
                    { className: 'slds-section__title slds-truncate' },
                    'Add View'
                  )
                )
              )
            )
          ),
          tiles
        ));
      };

      for (var pid in projectViews) {
        var tiles;

        _loop2(pid);
      }
      return projectTileElements;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { 'aria-hidden': true, role: 'dialog', className: this._modalClasses() },
          _react2.default.createElement(
            'div',
            { className: 'slds-modal__container' },
            _react2.default.createElement(
              'div',
              { className: 'slds-modal__header' },
              _react2.default.createElement(
                'h2',
                { className: 'slds-text-heading--medium modal-header-align-left' },
                _react2.default.createElement(
                  'div',
                  { className: 'appLauncherModalHeader slds-grid slds-grid--vertical-align-center slds-text-body--regular' },
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'span',
                      { className: 'slds-icon_container', title: 'description of icon when needed' },
                      _react2.default.createElement(
                        'svg',
                        { 'aria-hidden': true, className: 'slds-icon slds-icon-text-default' },
                        _react2.default.createElement('use', { xlinkHref: 'styles/lds/assets/icons/utility-sprite/svg/symbols.svg#apps' })
                      ),
                      _react2.default.createElement(
                        'span',
                        { className: 'slds-assistive-text' },
                        'Description of icon'
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'slds-text-heading--medium slds-col--padded ' },
                    _react2.default.createElement(
                      'h2',
                      null,
                      'View Manager'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'button',
                { className: 'slds-button slds-button--icon-inverse slds-modal__close', 'data-aljs-dismiss': 'modal', onClick: function onClick() {
                    return _this4._hide();
                  } },
                _react2.default.createElement(
                  'svg',
                  { 'aria-hidden': true, className: 'slds-button__icon slds-button__icon--large' },
                  _react2.default.createElement('use', { xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: 'styles/lds/assets/icons/action-sprite/svg/symbols.svg#close' })
                ),
                _react2.default.createElement(
                  'span',
                  { className: 'slds-assistive-text' },
                  'Close'
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'slds-modal__content slds-p-around--medium' },
              _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                  'div',
                  { className: 'app-launcher' },
                  Object.keys(this._projectViews()).length > 0 && this._renderProjectTiles(),
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'div',
                      { className: 'slds-text-heading--medium slds-m-bottom--medium' },
                      'Other Views'
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'slds-grid slds-wrap slds-grid--pull-padded' },
                      _react2.default.createElement(
                        'div',
                        { className: 'view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large' },
                        _react2.default.createElement(
                          'a',
                          { onClick: function onClick() {
                              return _this4._addView();
                            }, className: 'view-manager-box slds-box slds-box--small slds-theme--shade slds-text-align--center', href: 'javascript:void(0);' },
                          _react2.default.createElement(
                            'div',
                            { className: 'uiBlock' },
                            _react2.default.createElement(
                              'div',
                              { className: 'view-manager-icon' },
                              _react2.default.createElement(
                                'span',
                                { className: 'slds-button slds-button--icon' },
                                _react2.default.createElement(
                                  'svg',
                                  { 'aria-hidden': true, className: 'slds-button__icon slds-icon--large' },
                                  _react2.default.createElement('use', { xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: 'styles/lds/assets/icons/utility-sprite/svg/symbols.svg#add' })
                                ),
                                _react2.default.createElement('span', { className: 'slds-assistive-text' })
                              )
                            ),
                            _react2.default.createElement(
                              'div',
                              { className: 'view-manager-body' },
                              _react2.default.createElement(
                                'div',
                                { className: 'slds-section__title slds-truncate' },
                                'Add View'
                              )
                            )
                          )
                        )
                      ),
                      this._renderOtherTiles()
                    )
                  )
                )
              )
            )
          )
        ),
        _react2.default.createElement('div', { className: this._backdropClasses() })
      );
    }
  }]);

  return ViewManager;
}(_react.Component);

function select(state) {
  return state;
}

exports.default = (0, _reactRedux.connect)(select)(ViewManager);
//# sourceMappingURL=ViewManager.js.map
