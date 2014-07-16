'use strict';

var Promise     = require('bluebird');
var oAuthServer = require('../fixtures/mock-oauth-server');
var startClient = require('../fixtures/mock-oauth-client');

oAuthServer.listen();

module.exports = function(options) {
  var defaultOptions = {
    herokuOAuthID      : 'client-id',
    herokuOAuthSecret  : 'client-secret',
    herokuBouncerSecret: 'bouncer-secret',
    herokuAuthURL      : 'http://localhost:' + oAuthServer.address().port,
    ignoreRoutes       : [/^\/ignore/],
    herokaiOnly        : false
  };

  options = options || {};

  for (var key in defaultOptions) {
    if (!options.hasOwnProperty(key)) {
      options[key] = defaultOptions[key];
    }
  }

  var client = startClient(options);

  return new Promise(function(resolve) {
    client.listen(function() {
      oAuthServer.clientPort = client.address().port;
      client.serverPort      = oAuthServer.address().port;
      resolve([client, 'http://localhost:' + client.address().port]);
    });
  });
};
