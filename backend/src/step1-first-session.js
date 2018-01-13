const express = require('express');
const session = require('express-session');

/**
 * Creating a new express app
 */
const app = express();

/**
 * Initializing the session magic of express-session package
 */
app.use(session({
  secret: "Shh, its a secret!",
  resave: false,
  saveUninitialized: true
}));

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
 * Listen on port 3000
 */
app.listen(3000, () => {
  console.log('Server listening on port 3000')
});

