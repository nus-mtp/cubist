import Qs from 'qs';
import Promise from 'bluebird';
import React from 'react';
import {ReduxRouter} from 'redux-router';
import {Provider} from 'react-redux';

import {Logger} from 'common';
import {getDataDependencies} from 'webapp/utils';

const DEBUG_ENV = 'app-render';

export default (routerState, store) => {
  const {components, location, params} = routerState;
  const query = Qs.parse(location.search);
  const dispatch = store.dispatch;

  return Promise.all(getDataDependencies(components, {dispatch, params, query}))
    .then(() => {
      return (
        <Provider store={store} key="provider">
          <ReduxRouter />
        </Provider>
      );
    })
    .catch((err) => {
      Logger.error('Fail to fetch all necessary data', DEBUG_ENV);
      return Promise.reject(err);
    });
};
