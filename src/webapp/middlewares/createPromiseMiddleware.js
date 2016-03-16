import Promise from 'bluebird';

import { Constants } from 'common';

/**
 * Promise middleware to handle promise actions.
 * Need API Client interface to initialize
 */
export default (apiClient) => {
  return store => next => action => {
    const { promise, ...rest } = action;
    const { ServerStore, RequestStore } = store.getState();
    const navigateId = RequestStore.get('navigateId');

    // If there is no promise, go to next middleware
    if (!promise) {
      return next(action);
    }
    // If this is in browser and in the initial rendering phase, ignore the action
    if (process.env.BROWSER) {
      if (ServerStore.get('firstTime')) {
        return null;
      }
    }

    // Create the promise action in pending state
    next({ ...rest, promiseState: Constants.PROMISE_STATE_PENDING });

    return promise(apiClient)
      .then((res) => {
        // Create the promise action in success state
        if (navigateId) {
          next({ ...rest, res, navigateId, promiseState: Constants.PROMISE_STATE_NAVIGATE });
        } else {
          next({ ...rest, res, promiseState: Constants.PROMISE_STATE_SUCCESS });
        }

        return res.body;
      })
      .catch((res) => {
        // Create the promise  action in the failure state
        next({ ...rest, res, promiseState: Constants.PROMISE_STATE_FAILURE });
        // Return a new reject promise if this is server side
        if (!process.env.BROWSER) {
          return Promise.reject(res.body);
        }
      });
  };
};
