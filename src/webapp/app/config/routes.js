import React from 'react';
import {Route} from 'react-router';

import {Root, Home} from 'webapp/app/views';

export default (
  <Route component={Root}>
    <Route path="*" component={Home} />
  </Route>
);
