import {ROUTER_DID_CHANGE} from 'redux-router/lib/constants';
import Qs from 'qs';

import {getDataDependencies, compareLocations} from 'webapp/utils';

export default ({getState, dispatch}) => next => action => {
  if (action.type !== ROUTER_DID_CHANGE) {
    return next(action);
  }

  const {router} = getState();
  if (!router || !compareLocations(router.location, action.payload.location)) {
    return next(action);
  }

  const {components, location, params} = action.payload;
  const query = Qs.parse(location.search);

  //TODO: Add action to handle request pending and request failure
  return Promise.all(getDataDependencies(components, {dispatch, query, params}))
    .then(() => next(action));
};
