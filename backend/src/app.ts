import * as express from 'express';
import * as session from 'express-session';
const cors = require('cors');
import * as bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(session({secret: "Shh, its a secret!"}));

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
