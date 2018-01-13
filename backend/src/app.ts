import * as express from 'express';
import * as session from 'express-session';
const cors = require('cors');
import * as bodyParser from 'body-parser';

const app = express();
app.use(cors({origin: [
  "http://localhost:4736",
  /\.tsmean\.com$/
], credentials: true}));
app.use(bodyParser.json());

app.use(session({
  secret: "Shh, its a secret!"
}));

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
const accountBalances = {
  'max@gmail.com': 53762,
  'lily@gmail.com': 4826
};
const getBalance = (email: string) => {
  return accountBalances[email];
};

const validatePayloadMiddleware = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You need a payload'
    });
  }
};

app.get('/api/login', (req, res) => {
  req.session.user ? res.status(200).send({loggedIn: true}) : res.status(200).send({loggedIn: false});
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Could not log out.');
    } else {
      res.status(200).send({});
    }
  });
});

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

const authMiddleware = (req, res, next) => {
  console.log(req.session.user);
  if(req.session && req.session.user) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You must be logged in.'
    });
  }
};

app.get('/api/balance', authMiddleware, (req, res) => {
  const user = req.session.user;
  const balance = getBalance(user.email);
  if (balance) {
    res.status(200).send({
      balance: balance
    })
  } else {
    res.status(403).send({
      errorMessage: 'Access Denied.'
    });
  }
});

/* Unused
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    const userWithoutPassword = req.session.user;
    res.status(200).send({
      user: userWithoutPassword
    });
  } else {
    res.status(403).send({
      errorMessage: 'Permission denied!'
    });
  }
});*/

app.get('/api', function(req, res){
  if(req.session.page_views){
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!");
  }
});

app.listen(3000);
