const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * Creating a new express app
 */
const app = express();

/**
 * Setting up CORS, such that it can work together with an Application at another domain / port
 */
app.use(cors({origin: [
  "http://localhost:4736"
], credentials: true}));

/**
 * For being able to read request bodies
 */
app.use(bodyParser.json());

/**
 * Initializing the session magic of express-session package
 */
app.use(session({
  secret: "Shh, its a secret!",
  resave: false,
  saveUninitialized: true
}));

/**
 * Some hardcoded users to make the demo work
 */
const appUsers = {
  'max@gmail.com': {
    email: 'max@gmail.com',
    name: 'Max Miller',
    pw: '1234' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  },
  'lily@gmail.com': {
    email: 'lily@gmail.com',
    name: 'Lily Walter',
    pw: '1235' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  }
};

/**
 * Simple session example from tutorials point, unrelated to rest of the application.
 */
app.get('/api', function(req, res){
  if(req.session.page_views){
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!");
  }
});

/**
 * Middleware to check that a payload is present
 */
const validatePayloadMiddleware = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You need a payload'
    });
  }
};

/**
 * Log the user in.
 * User needs to provide pw and email, this is then compared to the pw in the "database"
 * If pw and email match, the user is fetched and stored into the session.
 * Finally the user is returned from the request.
 */
app.post('/api/login', validatePayloadMiddleware, (req, res) => {
  const user = appUsers[req.body.email];
  if (user && user.pw === req.body.password) {
    const userWithoutPassword = {...user};
    delete userWithoutPassword.pw;
    req.session.user = userWithoutPassword;
    res.status(200).send({
      user: userWithoutPassword
    });
  } else {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
  }
});

/**
 * Check if user is logged in.
 */
app.get('/api/login', (req, res) => {
  req.session.user ? res.status(200).send({loggedIn: true}) : res.status(200).send({loggedIn: false});
});


/**
 * Listen on port 3000
 */
app.listen(3000, () => {
  console.log('Server listening on port 3000')
});
