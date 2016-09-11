'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reduxDevtools = require('redux-devtools');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducer = require('../reducers/reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _DevTools = require('../containers/DevTools');

var _DevTools2 = _interopRequireDefault(_DevTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default), _DevTools2.default.instrument(), (0, _reduxDevtools.persistState)(window.location.href.match(/[?&]debug_session=([^&]+)\b/)))(_redux.createStore);

function configureStore(initialState) {
  var store = finalCreateStore(_reducer2.default, initialState);

  if (module.hot) {
    module.hot.accept('../reducers/reducer', function () {
      return store.replaceReducer(require('../reducers/reducer').default);
    });
  }

  return store;
}
//# sourceMappingURL=configureStore.js.map
