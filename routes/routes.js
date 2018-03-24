var routes = function(app, flash) {

  var util = require('util');

  var User = require('../models/userSchema.js');

  var bcrypt = require('bcrypt-nodejs');

  app.get('/', function(req, res) {
    // check local object
    // console.log(res.locals)
    var user;

    if (req.session.user) {
      user = {
        user: titleCase(req.session.user.fname)
      }
    };

    res.render('index.html', user=user);
  });

  app.get('/polls', function(req, res) {
    var user;

    if (req.session.user) {
      user = {
        user: titleCase(req.session.user.fname)
      }
    };

    res.render('polls.html', user=user)
  });

  app.get('/register', function(req, res) {

    if (req.session.user) {
      req.flash('error', 'User must be logged out in order to register for a new account');
      res.redirect('/dashboard');
    } else {
      res.render('register.html', {
        error_message: req.flash('error'),
        success_message: req.flash('success')
      });
    }
  });

	app.post('/register', function(req, res) {

    var newUser;
    var fname = req.body.fname.toLowerCase();
    var lname = req.body.lname.toLowerCase();
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    var verifyPassword = req.body.verifyPassword;

    newUser = User();

    User.findOne({ 'email': email }, function(err, user) {
      // log error if unable to query from database
      if (err) {
        console.log(err);
      };
      // continue if user doesn't exist in database
      if (!user) {
        // check if password matches verified password
        if (password !== verifyPassword) {
          // console.log('Passwords do not match');

          req.flash('error', 'Passwords do not match');
          res.redirect('/register');
        } else {
          newUser.fname = fname;
          newUser.lname = lname;
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.created_at = Date();

          // save user to database
          newUser.save(function(err) {
            if (err) console.log(err);
          });

          // create session object
          var userSession = userSessionObject(newUser.fname, newUser._id);

          // assign user session to session object
          req.session.user = userSession;
          // console.log(req.session.user);

          // console.log('You are registered');
          req.flash('success', 'You are registered');
          res.redirect('/dashboard');
        };
        // if email exists in database
      } else {
        // console.log('Email already exists');

        req.flash('error', 'Email already exists');
        res.redirect('/register');
      };

    });

  });

  app.get('/login', function(req, res) {

    if (req.session.user) {
      req.flash('error', 'User already logged in');
      res.redirect('/dashboard');
    } else {
      res.render('login.html', {
        error_message: req.flash('error'),
        success_message: req.flash('success')
      });
    }
  });

  app.post('/login', function(req, res) {

    var newUser = new User();

    // console.log('this is the form details ' + util.inspect(req.body));
    var email = req.body.email;
    var password = req.body.password;

    // find email in db.
    User.findOne({ 'email': email }, function(err, user) {
      // if err throw err
      if (err) {
        throw err;
        // if user does not exist redirect to login page and display error
      } else if (!user) {
        req.flash('error', 'Incorrect email or does not exist');
        res.redirect('/login');
      } else {
        // Load hash from your password DB
        bcrypt.compare(password, user.password, function(err, result) {

          if (err) {
            throw err;
          };
          // if password is correct create session object and redirect to dashboard
          if (result === true) {
            var userSession = userSessionObject(user.fname, user._id);

            req.session.user = userSession;

            req.flash('success', 'You are logged in');
            res.redirect('/dashboard');
            // if password incorrect redirect back to login and display error message
          } else {
            req.flash('error', 'Password incorrect');
            res.redirect('/login');
          }
        });
      }

    });

  });

  app.get('/dashboard', isLoggedIn, function(req, res) {

    res.render('dashboard.html', {
        user : titleCase(req.session.user.fname), // get the user out of session and pass to template
        error_message: req.flash('error'),
        success_message: req.flash('success')
    });
  });

  app.get('/logout', function(req, res) {

    if (req.session.user) {
      req.session.destroy(function(err) {
        if (err) {
          next(err);
        } else {
          res.redirect('/login');
        }
      });
    };

  });

  app.get('/settings', isLoggedIn, function(req, res) {

    res.render('settings.html', {
        user : titleCase(req.session.user.fname),
        error_message: req.flash('error'),
        success_message: req.flash('success')
    })
  });

  app.post('/settings', isLoggedIn, function(req, res) {

    var user = new User();

    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;
    var verifyNewPassword = req.body.verifyNewPassword;

    User.findOne({ '_id': req.session.user.userId }, function(err, user) {

      if (err) {
        throw err;
      }
      // console.log(user);
      if (newPassword === verifyNewPassword) {

        bcrypt.compare(currentPassword, user.password, function(err, result) {

          if (err) {
            throw err;
          };

          // if password match hash in db change old password with new
          if (result === true) {

            user.password = user.generateHash(newPassword);

            user.save(function(err) {
              if (err) {
                throw err;
              } else {
                req.flash('success', 'Your password has successfully changed');
                res.redirect('/settings');
              }
            })
            // if does not match redirect to settings and display error message
          } else {
            req.flash('error', 'Current password was incorrect');
            res.redirect('/settings');
          }
        });

      } else {
        req.flash('error', 'New password did not match');
        res.redirect('/settings');
      }

    });

  });

};

// middleware to check if user is logged in
var isLoggedIn = function(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    req.flash('error', 'Login required');
    res.redirect('/login');
  }
};

// middleware to title case string
var titleCase = function(string) {
  var tempStr;
  for (var i = 0; i < string.length; i++) {
    tempStr = string[0].toUpperCase() + string.slice(1);
  };
  return tempStr;
};

// create session object
var userSessionObject = function(name, id) {
  return  {
    fname: name, // newUser.fname,
    userId: id // newUser._id
  };
};
module.exports = routes;
