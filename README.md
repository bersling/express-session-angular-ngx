# Sessions with Express and Angular 2,4,5,6 (ngx)

Creating sessions with express is easy. However, there are one or to pitfalls
to be aware of when using together with Angular. Here's a working example repo.

You can see how the backend was built step by step, since for each step there's a working .js file. Below the installation instructions, you'll find a short tutorial and a link to a youtube tutorial belonging to this repository.

## Installing the backend (expressjs, express-session, ...)

```
cd backend && npm install
```

then you can start the backend with

```
npm start
```

The backend is launched at http://localhost:3000.

## Installing the frontend (angular)

```
cd backend && npm install
```

then you can start the frontend with

```
npm start
```

The frontend is launched at http://localhost:4736/. The frontend requires the backend to run.

## Tutorial

Here's a written version of a tutorial. There's also a tutorial available on youtube at https://youtu.be/QgqO-3FAvds.


### Introduction

Sessions help you to identify returning users, so they don't have their login-credentials (username, password) on every request. Express actually makes this so simple, I first even didn't understand how it could work. Take this example (courtesy to tutorialspoint):

```
var express = require('express');
var session = require('express-session');

var app = express();

app.use(session({secret: "Shh, its a secret!"}));

app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});
app.listen(3000);
```

Now if you run it (`node filename.js`) and you open `localhost:3000`,
you'll see `Welcome to this page for the first time!` the first time and
when you refresh `You visited this page 2 times` and so on. Now let's say you've opened it in Chrome, now when you open `localhost:3000` in Firefox, the counter is reset to zero. As you can see, the `express-session` abstracts away which client makes the request, but tracks it under the hood.

What's happening under the hood, is that Express is creating a new cookie when a new browser makes a request. This cookie is then sent to the browser alongside the response. The browser stores this cookie and attaches it to the next request that it makes. That way, Express can identify the client and fetch it's session. Cool, huh?

### Getting it to work with Angular (ngx)

To get it to work with Angular, there are a few things you'll need to consider.

1. You'll need to enable CORS, since the server root url is not the same as the client's root url. This works as follows. Let's assume Angular is running on port 4736 (which is configured in package.json of frontend). Then you can enable CORS with:

    ```
    const app = express();
    app.use(cors({origin: [
      "http://localhost:4736"
    ], credentials: true}));
    ```

2. **Angular will not attach cookies to requests by default!** You'll need to include **{withCredentials: true}** into your request options!

    Example:
    ```
    getLogin() {
        this.http.get(environment.apiUrl + '/login', {
          withCredentials: true  // <=========== important!
        }).subscribe((resp: any) => {
          this.loggedIn.next(resp.loggedIn);
        }, (errorResp) => {
          this.toastr.error('Oops, something went wrong getting the logged in status')
        })
    }
    ```

    You'll need to include this to **all** requests where you want Express to be able to recognize your session. That means when you have some code like
    ```
    app.get('/api/foo', (req, res) => {
      ...
      req.session // doing something with the session
      ...
    });
    ```
    it's always accompanied with a {withCredentials: true} in Angular.


### Notes

- By default, express-session uses ApplicationMemory for session cache. This isn't suited for production. For more info, see https://github.com/expressjs/session.
- This tutorial doesn't use the secure flag of express-session, for production you should use it. It means https is necessary.
- There's also a tutorial for JWT with Express and Angular, see https://github.com/bersling/jwt-express-angular. However, I prefer classic express-session, see for example https://scotch.io/bar-talk/why-jwts-suck-as-session-tokens or http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/
- You'll find more info at https://www.tsmean.com/articles/authentication/express-session-angular/
