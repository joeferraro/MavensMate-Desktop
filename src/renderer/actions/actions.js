/*
 * action types
 */

export const ADD_VIEW = 'ADD_VIEW'
export const DESTROY_VIEW = 'DESTROY_VIEW'
export const UPDATE_VIEW = 'UPDATE_VIEW'
export const SHOW_VIEW = 'SHOW_VIEW'
export const SHOW_VIEW_MANAGER = 'SHOW_VIEW_MANAGER'
export const HIDE_VIEW_MANAGER = 'HIDE_VIEW_MANAGER'
export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'
export const SHOW_UPDATE_NOTIFIER = 'SHOW_UPDATE_NOTIFIER'
export const HIDE_UPDATE_NOTIFIER = 'HIDE_UPDATE_NOTIFIER'

/*
 * action creators
 */

export function addView(url, pid) {
  return { type: ADD_VIEW, url, pid }
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

export function showLoading() {
  return { type: SHOW_LOADING }
}

export function hideLoading() {
  return { type: HIDE_LOADING }
}

export function showUpdateNotifier(releaseName, action) {
  return { type: SHOW_UPDATE_NOTIFIER, releaseName, action }
}

export function hideUpdateNotifier() {
  return { type: HIDE_UPDATE_NOTIFIER }
}