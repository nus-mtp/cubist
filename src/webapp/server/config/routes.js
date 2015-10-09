import httpProxy from 'http-proxy';
import settings from './settings';

// Create proxy server to redirect API request to API server
const apiProxy = httpProxy.createProxyServer({
  target: 'http://localhost:' + settings.API_PORT
});

export default function(app) {
  app.use('/api', (req, res) => {
    apiProxy.web(req, res);
  });
}
