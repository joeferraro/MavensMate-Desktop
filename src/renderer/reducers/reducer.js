import {
  SHOW_LOADING, HIDE_LOADING, ADD_VIEW, SHOW_VIEW, SHOW_ERROR,
  SHOW_UPDATE_NOTIFIER, HIDE_UPDATE_NOTIFIER, DESTROY_VIEW,
  UPDATE_VIEW, SHOW_VIEW_MANAGER, HIDE_VIEW_MANAGER
} from '../actions/actions';
const uuid = require('node-uuid');
const update = require('react-addons-update');

const initialState = {
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
  },
  mainProcess: {
    error: false,
    msg: ''
  }
};

function views(state = [], action) {
  console.log('views reducer', state, action);
  switch (action.type) {
    case ADD_VIEW:
      let url = action.url || 'http://localhost:56248/app/home'
      return [
        ...state.map((view, index) => {
          return Object.assign({}, view, {
            show: false
          })
        }),
        {
          id: uuid.v1(),
          show: true,
          url: url,
          pid: action.pid,
          sldsSprite: 'standard-sprite',
          sldsIconClassName: 'slds-icon-standard-generic-loading',
          sldsIconName: 'generic_loading'
        }
      ]
    case UPDATE_VIEW:
      return state.map((view, index) => {
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
          })
        }
        return view
      })
    case SHOW_VIEW:
      return state.map((view, index) => {
        return Object.assign({}, view, {
          show: view.id === action.id ? true : false,
          status: view.status === 'operation:stopped' ? 'none' : view.status
        })
      })
    case DESTROY_VIEW:
      function findView(view) {
        return view.id === action.id;
      }
      let view = state.find(findView);
      let viewIndex = state.findIndex(findView);
      console.log('attempting to close view', viewIndex, view);
      if (view.show && viewIndex !== 0 && !state[viewIndex-1].show)
        state[viewIndex-1].show = true;
      else if (view.show && viewIndex === 0 && state.length > 1 && !state[viewIndex+1].show)
        state[viewIndex+1].show = true;
      return update(state, {$splice: [[viewIndex, 1]]});
    default:
      return state
  }
}

function app(state = initialState, action) {
  switch (action.type) {
    case SHOW_VIEW_MANAGER:
      return Object.assign({}, state, {
        viewManager: {
          show: true
        }
      })
    case HIDE_VIEW_MANAGER:
      return Object.assign({}, state, {
        viewManager: {
          show: false
        }
      })
    case SHOW_ERROR:
      return Object.assign({}, state, {
        mainProcess: {
          error: true,
          msg: action.msg
        }
      })
    case ADD_VIEW:
    case UPDATE_VIEW:
    case SHOW_VIEW:
    case DESTROY_VIEW:
      return Object.assign({}, state, {
        views: views(state.views, action)
      })
    case SHOW_LOADING:
      return Object.assign({}, state, {
        loading: true
      })
    case HIDE_LOADING:
      return Object.assign({}, state, {
        loading: false
      })
    case SHOW_UPDATE_NOTIFIER:
      return Object.assign({}, state, {
        update: {
          show: true,
          action: action.action,
          releaseName: action.releaseName
        }
      })
    case HIDE_UPDATE_NOTIFIER:
      return Object.assign({}, state, {
        update: {
          show: false,
          action: '',
          releaseName: ''
        }
      })
    default:
      return state;
  }
}

export default app;
