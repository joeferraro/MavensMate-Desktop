/*
 * action types
 */

export const ADD_VIEW = 'ADD_VIEW'
export const DESTROY_VIEW = 'DESTROY_VIEW'
export const UPDATE_VIEW = 'UPDATE_VIEW'
export const SHOW_VIEW = 'SHOW_VIEW'
export const SHOW_VIEW_MANAGER = 'SHOW_VIEW_MANAGER'
export const HIDE_VIEW_MANAGER = 'HIDE_VIEW_MANAGER'


/*
 * action creators
 */

export function addView(url) {
  return { type: ADD_VIEW, url }
}

export function updateView(obj) {
  return { type: UPDATE_VIEW, obj }
}

export function destroyView(id) {
  return { type: DESTROY_VIEW, id }
}

export function showView(id) {
  return { type: SHOW_VIEW, id }
}

export function showViewManager() {
  return { type: SHOW_VIEW_MANAGER }
}

export function hideViewManager() {
  return { type: HIDE_VIEW_MANAGER }
}