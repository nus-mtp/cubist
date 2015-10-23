import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
let createHistory;
let reduxReactRouter;
if (process.env.BROWSER) {
  createHistory = require('history/lib/createBrowserHistory');
  reduxReactRouter = require('redux-router').reduxReactRouter;
} else {
  createHistory = require('history/lib/createMemoryHistory');
  reduxReactRouter = require('redux-router/server').reduxReactRouter;
}

import {logMiddleware, createPromiseMiddleware, transitionMiddleware} from 'webapp/app/middlewares';
import routes from './routes';
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
    middlewares.push(transitionMiddleware);
    middlewares.push(logMiddleware);
  }

  return compose(
    applyMiddleware(...middlewares),
    reduxReactRouter({
      routes,
      createHistory
    })
  )(createStore)(reducer, initialData);
};
