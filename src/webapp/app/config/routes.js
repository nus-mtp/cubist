import React from 'react';
import {Route, IndexRoute} from 'react-router';

import {Root, Home, Public} from 'webapp/app/views';

export default (
  <Route component={Root}>
    <Route path="/" component={Public} >
      <IndexRoute component={Home} />
    </Route>
  </Route>
);
