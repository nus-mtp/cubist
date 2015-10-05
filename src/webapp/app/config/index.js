import Promise from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import {match, RoutingContext} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createLocation from 'history/lib/createLocation';
import {Provider} from 'react-redux';

import ApiClient from './api';
import redux from './redux';
import routes from './routes';
// import {RequestActions} from 'webapp/app/actions';

const history = createBrowserHistory();
const location = createLocation(document.location.pathname, document.location.search);
const apiClient = new ApiClient();
const store = redux(apiClient, window.__data);

new Promise((resolve, reject) => {
  match({routes, history, location}, (error, redirectLocation, renderProps) => {
    if (error) {
      return reject(error);
    }
    renderProps.history = history;
    resolve(
      <Provider store={store} key="provider">
        <RoutingContext {...renderProps}/>
      </Provider>
    );
  });
})
.then((component) => {
  ReactDOM.render(component, document.getElementById('root'));
})
.catch((error) => {
  console.error(error);
});

// store.dispatch(RequestActions.firstTime());
