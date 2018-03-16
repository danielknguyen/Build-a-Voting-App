var routes = function(app) {

  app.get('/', function(req, res) {

    res.render('index.html');
  });

  app.get('/polls', function(req, res) {

    res.render('polls.html')
  });

  app.get('/register', function(req, res) {

    res.render('register.html');
  });

  app.get('/login', function(req, res) {

    res.render('login.html');
  });
};

module.exports = routes;
