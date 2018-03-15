var express = require('express'),
    // run express server
    app = express(),
    // store sensitive information with dotenv
    dotenv = require('dotenv').config(),
    // parse messages and display as JSON
    bodyParser = require('body-parser'),
    // templating engine
    engines = require('consolidate'),
    // require object data modeling
    mongoose = require('mongoose');

// setup app configuration
var appConfig = function(app) {
  // serve static files, assets, css, javascript in public directory
  app.use(express.static(__dirname + '/public'));
  // set directory of views templates
  app.set('views', __dirname + '/views');
  // sete engine template to nunjucks
  app.engine('html', engines.nunjucks);
  // convert data to be easily transferred through the web
  app.use(bodyParser.urlencoded({ extended: true}));
  // parse/analyze incoming data as json object
  app.use(bodyParser.json());
}(app);

var routes = require('./routes/routes.js')(app);

// set up heroku env PORT || local
var port = process.env.PORT || 27017;
// listen for connection at port
var server = app.listen(port, function() {
  // log port number
  console.log("Express server is listening on port %s.", port);
});
