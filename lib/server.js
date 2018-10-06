const http = require('http');
//const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

const server = {};

// server.httpsServerOptions = {
//     'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
//     'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
// };

// server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
//     server.unifiedServer(req, res);
// });

server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

server.unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const query = parsedUrl.query;
  const headers = req.headers;
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer +=decoder.end();
    const chosenHandler = typeof server.router[trimmedPath] !== 'undefined' ?
      server.router[trimmedPath] : handlers.notFound;
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : query,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };
    chosenHandler(data, (statusCode=200, payload={}) => {
      const payloadString = JSON.stringify(payload);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      if (statusCode === 200) {
        debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} -> ${statusCode}`);
      } else {
        debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} -> ${statusCode}`);
      }
    });
  });
}

server.router = {
  'users' : handlers.users,
  'tokens' : hanlders.tokens,
  'orders' : hanlders.orders,
  'pay' : handlers.pay
};

server.init = () => {
  server.httpServer.listen(config.httpPort, (err) => {
    if (err) {
      return debug(err);
    }
    console.log('\x1b[36m%s\x1b[0m', `Listening on port ${config.httpPort}`);
  });
  // server.httpsServer.listen(config.httpsPort, (err) => {
  //     if (err) {
  //         return debug(err);
  //     }
  //     console.log('\x1b[35m%s\x1b[0m', `Listineing on port ${config.httpsPort}`);
  // });
}

module.exports = server;