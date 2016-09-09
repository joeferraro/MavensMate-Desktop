import { createSelector } from 'reselect'

const getViews = (state) => state.views

export const getProjectViews = createSelector(
  return getViews.reduce(function(obj, v) {
      if (!obj[v.pid]) obj[v.pid] = [];
      obj[v.pid].push(v);
      return obj;
  }, {});
)