import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {match} from 'redux-router/server';
import createLocation from 'history/lib/createLocation';
import Promise from 'bluebird';

import {Logger, ClientError} from 'common';
import routes from 'webapp/app/config/routes';
import appRender from 'webapp/app/config/render';
import ApiClient from 'webapp/app/config/api';
import redux from 'webapp/app/config/redux';
import HtmlDocument from 'webapp/app/views/HtmlDocument';

const DEBUG_ENV = 'server-render';

// Load Assets JSON only once in production mode
let assets;
if (process.env.NODE_ENV !== 'development') {
  assets = require('../webpack-stats.json');
}

const render = function(req, res, next) {
  // Initialize API Interface for server
  const apiClient = new ApiClient(req);
  // Initialize Redux Store
  const store = redux(apiClient);
  // Get location from the page request
  const location = createLocation(req.path, req.query);

  return new Promise((resolve, reject) => {
    store.dispatch(
      match(req.originalUrl, (error, redirectLocation, routerState) => {
        if (error) {
          return reject(error);
        } else if (!routerState) {
          return reject(new ClientError('Router state is null'));
        } else if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else {
          resolve(routerState);
        }
      })
    );
  })
  .then((routerState) => {
    return appRender(routerState, store);
  })
  .then((component) => {
    const componentMarkup = ReactDOMServer.renderToString(component);
    const redirectPath = store.getState().RequestStore.get('redirect');
    if (redirectPath) {
      Logger.info('Redirect on server: ' + redirectPath, DEBUG_ENV);
      res.redirect(redirectPath);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      assets = require('../webpack-stats.json');
      delete require.cache[require.resolve('../webpack-stats.json')];
    }
    const html = ReactDOMServer.renderToStaticMarkup(
      <HtmlDocument
        title="Xfers Prototype"
        markup={componentMarkup}
        store={JSON.stringify(store.getState())}
        script={assets.script}
        css={assets.css}
      />
    );
    const doctype = '<!DOCTYPE html>';
    res.send(doctype + html);
  })
  .catch((err) => {
    if (err) {
      Logger.error(err, DEBUG_ENV);
    }
    next(err);
  });
};

export default (app) => {
  app.use(render);
};
