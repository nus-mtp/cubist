import React from 'react';
import {Route, IndexRoute} from 'react-router';

import {
  RootPage,
  HomePage,
  PublicPage,
  ModelPage
} from 'webapp/app/components';

export default (
  <Route component={RootPage}>
    <Route path="/" component={PublicPage} >
      <IndexRoute component={HomePage} />
      <Route path="/model/:modelId" component={ModelPage} />
    </Route>
  </Route>
);
