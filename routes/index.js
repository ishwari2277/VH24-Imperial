var express = require('express');
var router = express.Router();

const passport = require('passport');

const userModel = require('./users');
const UserDetails = require('./userdetails');


const localStrategy = require("passport-local");
const { path } = require('../app');
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
  next(); // Continue to the next middleware or route
}
/////////////////////////////////////////////////////////////////////////

router.get('/dashboard', isLoggedIn, function (req, res, next) {
  res.render('dashboard/dashboard', { path: '/dashboard' });
});

/////////////////////////////////////////////////////////////////////////
// USER INPUT SECION 
router.get('/details', isLoggedIn, function (req, res, next) {
  res.render('details', { path: '/details' });
});

router.post('/userdetails', async (req, res) => {
  try {
      // Create a new UserDetails entry
      const userDetails = new UserDetails({
          user: req.user._id, // Reference to the logged-in user
          name: req.body.name,
          education: req.body.education,
          salary: req.body.salary,
          age: req.body.age,
          medicalEmergencies: req.body.medicalEmergencies,
          medicalAllotments: req.body.medicalAllotments,
          workSector: req.body.workSector,
          jobSecurity: req.body.jobSecurity,
          familyMembers: req.body.familyMembers,
          otherExpenses: req.body.otherExpenses,
          riskTolerance: req.body.riskTolerance,
          goal: req.body.goal,
      });
      
      // Save UserDetails
      await userDetails.save();
      
      // Link userDetails with the user (if you need to)
      await userModel.findByIdAndUpdate(req.user._id, { userDetails: userDetails._id });

      req.session.successMessage = 'Form submitted successfully!';
      res.redirect('/');
  } catch (error) {
      console.error("Error occurred while saving user details:", error); // Log the actual error
      req.session.errorMessage = 'Form submission failed! ' + error.message; // Include error message
      res.redirect('/');
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////
// Dashboard Profile

// GET route for the user profile
// Assuming you have express-session or similar middleware to manage sessions
router.get('/dashboard-profile', async (req, res) => {
  try {
      const userId = req.user._id; // Assuming the logged-in user ID is stored in req.user
      const userdetails = await UserDetails.findOne({ userId }); // Find the user details by user ID
      
      // Render the profile page with user details
      res.render('dashboard/dashboard-profile', { userdetails, path:'dashboard/dashboard-profile' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

// POST route to update user details
router.post('/dashboard-profile/update', async (req, res) => {
  try {
      // Ensure user is logged in
      if (!req.user) {
          return res.status(401).send('User not authenticated'); // Handle unauthenticated user
      }

      const userId = req.user._id; // Get the logged-in user's ID

      // Check if user details already exist
      let userDetails = await UserDetails.findOne({ userId });

      if (userDetails) {
          // Update existing user details
          userDetails = await UserDetails.findByIdAndUpdate(userDetails._id, req.body, { new: true });
      } else {
          // Create new user details
          userDetails = new UserDetails({ userId, ...req.body });
          await userDetails.save();
      }

      // Redirect to profile page after updating/creating
      res.redirect('/dashboard/dashboard-profile'); // Correct usage of res.redirect
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});






module.exports = router;
