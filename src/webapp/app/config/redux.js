import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {logger, createPromiseMiddleware} from 'webapp/app/middlewares';
import reducers from 'webapp/app/reducers';

const reducer = combineReducers(reducers);

/**
 * Initialize Redux Store and all applied middlewares
 * @param  {Object} apiClient   [API Interface to be used by promise middleware]
 * @param  {Object} initialData [Initial data for the Store]
 * @return {Object}             [the single Redux store]
 */
export default (apiClient, initialData = {}) => {
  const middlewares = [thunk, createPromiseMiddleware(apiClient)];
  // If this is in client side, add logger middleware
  if (process.env.BROWSER) {
    middlewares.push(logger);
  }

  return applyMiddleware(...middlewares)(createStore)(reducer, initialData);
};
