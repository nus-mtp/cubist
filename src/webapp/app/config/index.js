import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-router';

import ApiClient from './api';
import redux from './redux';
import routes from './routes';

const apiClient = new ApiClient();
const store = redux(apiClient, window.__data);

ReactDOM.render(
  <Provider store={store} key="provider">
    <ReduxRouter routes={routes} />
  </Provider>,
  document.getElementById('root')
);
