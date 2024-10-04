var express = require('express');
var router = express.Router();

const passport = require('passport');

const userModel = require('./users');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
// Route to render the home page
router.get("/", (req, res) => {
  const successMessage = req.session.successMessage;
  const errorMessage = req.session.errorMessage;

  delete req.session.successMessage;
  delete req.session.errorMessage;

  // Pass the authenticated user (if any) to the template
  res.render("index", {
    successMessage,
    errorMessage,
    user: req.user // `req.user` contains the authenticated user object if logged in
  });
});


router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.get('/register', function (req, res, next) {
  res.render('register', { message: req.flash('error') });
});


// Authentication
router.post("/register", async function (req, res, next) {
  const userData = await new userModel({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
  });
  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
          req.session.successMessage = 'Registered successfully!';
          res.redirect("/");
      })
    })
})

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session.errorMessage = 'Invalid username or password.';
      return res.redirect('/');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.session.successMessage = 'Logged in successfully!';
      return res.redirect('/');
    });
  })(req, res, next);
});


router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.error("Error logging out:", err);
      req.session.errorMessage = 'Error logging out!';
    } else {
      req.session.successMessage = 'Logged out successfully!';
    }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user; // Make user available in views
    return next();
  }

  // If user is not authenticated, set an error message
  // req.session.errorMessage = 'Please log in to access this page.';
  next(); // Continue to the next middleware or route
}


module.exports = router;
