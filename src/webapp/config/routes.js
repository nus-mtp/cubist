import React from 'react';
import {Route, IndexRoute} from 'react-router';

import {
  AppContainer,
  HomeContainer,
  ModelContainer,
  RootContainer,
  ErrorContainer
} from 'webapp/components';

export default (
  <Route component={RootContainer}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={HomeContainer} />
      <Route path="model/:modelId" component={ModelContainer} />
    </Route>
    <Route path="*" component={ErrorContainer} />
  </Route>
);
