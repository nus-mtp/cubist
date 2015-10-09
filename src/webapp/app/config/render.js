import Qs from 'qs';
import Promise from 'bluebird';
import React from 'react';
import {RoutingContext} from 'react-router';
import {Provider} from 'react-redux';

import {Logger} from 'common';

const DEBUG_ENV = 'app-render';

const getFetchDataFunction = (component) => {
  return component.WrappedComponent ?
    getFetchDataFunction(component.WrappedComponent) :
    component.fetchData;
};

export default (renderProps, store) => {
  const {components, location, params} = renderProps;
  const query = Qs.parse(location.search);
  const dispatch = store.dispatch;

  const promises = components
    .filter((component) => getFetchDataFunction(component))
    .map((component) => getFetchDataFunction(component))
    .map((fetchFunction) => fetchFunction({dispatch, params, query}));

  return Promise.all(promises)
    .then(() => {
      return (
        <Provider store={store} key="provider">
          <RoutingContext {...renderProps}/>
        </Provider>
      );
    })
    .catch((err) => {
      Logger.error('Fail to fetch all necessary data', DEBUG_ENV);
      return Promise.reject(err);
    });
};
