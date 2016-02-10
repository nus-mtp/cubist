import React from 'react';
import { Route, IndexRoute } from 'react-router';

import {
  AppContainer,
  AuthorisationContainer,
  HomeContainer,
  LoginContainer,
  RegisterContainer,
  ResetPasswordContainer,
  ModelContainer,
  ModelEditContainer,
  UploadContainer,
  RootContainer,
  ErrorContainer
} from 'webapp/components';

export default (
  <Route component={ RootContainer }>
    <Route path="/" component={ AppContainer }>
      <IndexRoute component={ HomeContainer } />
      <Route path="model/:modelId" component={ ModelContainer } />
      <Route component={ AuthorisationContainer }>
        <Route path="upload" component={ UploadContainer } />
        <Route path="model/:modelId/edit" component={ ModelEditContainer } />
      </Route>
    </Route>
    <Route path="/login" component={ LoginContainer } />
    <Route path="/register" component={ RegisterContainer } />
    <Route path="/resetPassword" component={ ResetPasswordContainer } />
    <Route path="*" component={ ErrorContainer } />
  </Route>
);
