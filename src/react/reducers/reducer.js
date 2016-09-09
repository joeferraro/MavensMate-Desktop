import {
  ADD_VIEW, SHOW_VIEW, DESTROY_VIEW, UPDATE_VIEW, SHOW_VIEW_MANAGER, HIDE_VIEW_MANAGER } from '../actions/actions'
const uuid = require('node-uuid');

const inititalState = {
  viewManager: {
    show: true
  },
  views: []
};

function views(state = [], action) {
  console.log('views reducer', state, action);
  switch (action.type) {
    case ADD_VIEW:
      let url = action.url || 'http://localhost:56248/app/home'
      return [
        ...state,
        {
          id: uuid.v1(),
          show: true,
          url: url
        }
      ]
    case UPDATE_VIEW:
      console.log('UPDATING VIEW ....', action);
      return state.map((view, index) => {
        console.log(view.id, action.obj.id);
        if (view.id === action.obj.id) {
          console.log('found a matching view!', view);
          return Object.assign({}, view, {
            url: action.obj.url,
            pid: action.obj.pid,
            title: action.obj.title,
            projectName: action.obj.projectName,
            sldsIconClassName: action.obj.sldsIconClassName,
            sldsIconName: action.obj.sldsIconName,
            sldsSprite: action.obj.sldsSprite
          })
        }
        return view
      })
    case SHOW_VIEW:
      return state.map((view, index) => {
        return Object.assign({}, view, {
          show: view.id === action.id ? true : false
        })
      })
    case DESTROY_VIEW:
      return state.map((view, index) => {
        if (index === action.index) {
          return Object.assign({}, view, {
            completed: !view.completed
          })
        }
        return view
      })
    case DESTROY_VIEW:
      return state.map((view, index) => {
        if (index === action.index) {
          return Object.assign({}, view, {
            completed: !view.completed
          })
        }
        return view
      })
    default:
      return state
  }
}

function app(state = inititalState, action) {
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
    case ADD_VIEW:
    case UPDATE_VIEW:
    case SHOW_VIEW:
    case DESTROY_VIEW:
      return Object.assign({}, state, {
        views: views(state.views, action)
      })
    default:
      return state;
  }
}

export default app;
