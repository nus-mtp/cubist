import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import {Provider} from 'react-redux';

import ApiClient from './api';
import redux from './redux';
import routes from './routes';
// import {RequestActions} from 'webapp/app/actions';

const history = createHistory();
const apiClient = new ApiClient();
const store = redux(apiClient, window.__data);

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router history={history} children={routes}/>
  </Provider>,
  document.getElementById('root')
);

// store.dispatch(RequestActions.firstTime());
