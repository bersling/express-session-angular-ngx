import * as express from 'express';
import * as session from 'express-session';
const cors = require('cors');
import * as bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(session({secret: "Shh, its a secret!"}));

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

const validatePayloadMiddleware = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'You need a payload'
    });
  }
};

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
