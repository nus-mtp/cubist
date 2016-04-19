import { ROUTER_DID_CHANGE } from 'redux-router/lib/constants';
import { batchActions } from 'redux-batched-actions';

import { getDataDependencies, compareLocations } from 'webapp/utils';
import { NAVIGATE_START, NAVIGATE_COMPLETE } from 'webapp/actions/types';

export default store => next => action => {
  const { getState, dispatch } = store;
  if (action.type !== ROUTER_DID_CHANGE) {
    return next(action);
  }
  const { router } = getState();

  if (router && compareLocations(router.location, action.payload.location)) {
    return next(action);
  }

  const { components, location, params } = action.payload;
  const query = location.query;

  next({ type: NAVIGATE_START });
  // TODO: Add action to handle request pending and request failure
  return Promise.all(getDataDependencies(components, { dispatch, query, params }))
    .then(() => {
      const { RequestStore } = getState();
      const actions = RequestStore
        .get('navigateMap')
        .get(RequestStore.get('navigateId'))
        .toJS();
      dispatch(batchActions([
        ...actions,
        { type: NAVIGATE_COMPLETE },
        action
      ]));
      // Scroll to top after transition
      window.scrollTo(0, 0);
    });
};
