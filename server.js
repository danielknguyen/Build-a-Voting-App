var express = require('express'),
    // store sensitive information with dotenv
    dotenv = require('dotenv').config(),
    // parse messages and display as JSON
    bodyParser = require('body-parser'),
    // templating engine
    engines = require('consolidate'),
    app = express(),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

// setup app configuration
var appConfig = function() {
  // serve static files, assets, css, javascript in public directory
  app.use(express.static(__dirname + '/public'));
  // set directory of views templates
  app.set('views', __dirname + '/views');
  // sete engine template to nunjucks
  app.engine('html', engines.nunjucks);
  // convert data to be easily transferred through the web
  app.use(bodyParser.urlencoded({ extended: true}));
  // parse/analyze incoming data as json object
  app.use(bodyParser.json()); // gets information from forms
  app.use(morgan('dev')); // log every request in console
  app.use(cookieParser(process.env.SESSION_KEY)); // read cookies needed for auth

  app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      url: process.env.MONGOLAB_URL,
      callback({
        collection: 'session'
        ttl: 86400,
        autoRemove: 'native'
      })
    })
    // cookie: {
    //   secure: false,
    //   maxAge: 30000
    //  }
  }));

  app.use(flash()); // use connect-flash for flash messages stored in session

  // set success and error variables on every request
  app.use(function(req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });

}();

var routes = require('./routes/routes.js')(app, flash);
// set up heroku env PORT || local
var port = process.env.PORT || 27017;
// listen for connection at port
var server = app.listen(port, function() {
  // log port number
  console.log("Express server is listening on port %s.", port);
});
