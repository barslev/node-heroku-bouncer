# node-heroku-bouncer

node-heroku-bouncer is an easy-to-use module for adding Heroku OAuth
authentication to express 4 apps.

## Install

```sh
$ npm install heroku-bouncer --save
```

## Use

node-heroku-bouncer assumes you've already added the express
[cookieParser][cookieParser] and [cookieSession][cookieSession] middlewares to
your app. To set it up, pass it your OAuth client ID and secret and another
secret used to encrypt your user's OAuth session data.

Use the `bouncer.middleware` object to set up middleware that will ensure that
your users are logged in (and redirect otherwise), and the `bouncer.routes`
object to add the OAuth-specific routes to your app:

```javascript
var express = require('express');
var app     = express();

app.use(require('cookie-parser')('your cookie secret'));
app.use(require('cookie-session')({
  secret: 'your session secret',
  cookie: {
    path    : '/',
    signed  : true,
    httpOnly: true,
    maxAge  : null
  }
}));

var bouncer = require('heroku-bouncer')({
  herokuOAuthID      : 'client-id',
  herokuOAuthSecret  : 'client-secret',
  herokuBouncerSecret: 'bouncer-secret'
});

app.use(bouncer.middleware);
app.use(bouncer.router);

app.get('/', function(req, res) {
  res.end('you are clearly logged in!');
});
```

After requests pass through `bouncer.middleware`, they'll have a
`heroku-bouncer` property on them:

```javascript
{
  token: 'user-api-token',
  id   : 'user-id',
  name : 'user-name',
  email: 'user-email'
}
```

To log a user out, send them to `/auth/heroku/logout`.

### Options

| Options | Required? | Default | Description |
|---------|-----------|---------|-------------|
| `herokuOAuthID` | Yes | n/a | The ID of your Heroku OAuth client |
| `herokuOAuthSecret` | Yes | n/a | The secret of your Heroku OAuth client |
| `herokuBouncerSecret` | Yes | n/a | A random string used to encrypt your user session data |
| `sessionSyncNonce` | No | `null` | The name of a nonce cookie to validate sessions against |
| `ignoreRoutes` | No | `[]` | An array of regular expressions to match routes to be ignored |
| `herokuAuthURL` | No | `"https://id.heroku.com"` | The location of the Heroku OAuth server |
| `herokaiOnly` | No | `false` | Whether or not to restrict the app to Herokai only |

## Test

```sh
$ npm test
```

[cookieParser]:  http://expressjs.com/3x/api.html#cookieParser
[cookieSession]: http://expressjs.com/3x/api.html#cookieSession
