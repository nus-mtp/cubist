import superagent from 'superagent-bluebird-promise';
import Qs from 'qs';
import _ from 'lodash';

import Settings from 'webapp/server/config/settings';

/**
 * API Client is the interface for interacting with the API server
 */
class ApiClient {
  /**
   * Constructor of class APIClient
   * @param  {Object} req [initial request to copy cookies if it is in server]
   */
  constructor(req) {
    // Initialize 4 main HTTP Methods: GET, POST, PUT, DELETE
    ['get', 'post', 'put', 'delete'].forEach((method) => {
      this[method] = (path, options) => {
        const request = superagent[method](this.formatUrl(path));
        // If this is server side, copy cookie from the provided request
        if (!process.env.BROWSER) {
          if (req.get('cookie')) {
            request.set('cookie', req.get('cookie'));
          }
        }
        // Check for queries
        if (options && options.query) {
          request.query(Qs.stringify(options.query));
        }
        // Check for body data
        if (options && options.body) {
          request.send(options.body);
        }
        // Check for multipart requests
        if (options && options.attachments) {
          options.attachments.forEach((attachment) => {
            request.attach(attachment.field, attachment.file, attachment.file.name);
          });
        }
        if (options && options.fields) {
          _.forIn(options.fields, (value, key) => {
            request.field(key, value);
          });
        }

        return request.promise();
      };
    });
  }

  formatUrl(path) {
    // If this is server side, the request URL needs to be specified explicitly
    if (!process.env.BROWSER) {
      return 'http://localhost:' + Settings.API_PORT + path;
    }
    return '/api' + path;
  }
}

export default ApiClient;
