
import * as axios from "axios";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as csrf from "csurf";
import * as express from "express";
import * as helmet from "helmet";
import * as serveStatic from "serve-static";

// const logger = require('morgan');


// Resources
const examples = require('./examples');

// Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');

// Set Up Express Server
const app = express();
const jsonParser = bodyParser.json();

const csrfProtection = csrf({ cookie: true });

const TCL_BACKEND_PATH = 'http://localhost:8001/api/process';
const STATIC_PATH = __dirname + '/public/';

// Adjust HTTP header setting for security
//  - Enables: dnsPrefetchControl, framegurd, hidePoweredBy, hsts, isNoOpen, xssFilter
//  - Disabled: contentSecurityPolicy, HTTP Public Key Pinning, noCache
app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(errorHandler);

// ToDo: Change to render initial state into HTML using template
app.use(serveStatic(STATIC_PATH, { index: ["index.html"] }));

app.use('/api/*', (req, res, next) => {
  res.set('Content-Type', 'application/json');
  next();
});


app.get('/api/token', csrfProtection, (req, res) => {
  res.status(200);
  res.send({ csrfToken: req.csrfToken() });
});


app.post('/api/process', jsonParser, csrfProtection, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const body = JSON.stringify({
    input: req.body.input,
    formatString: req.body.formatString,
  });
  console.log(body);
  return axios.post(TCL_BACKEND_PATH, `${body}\n`)
    .then(apiRes => {
      console.log(apiRes.data);
      res.status(200);
      res.send(apiRes.data);
    });
});


app.get('/api/examples/:example', (req, res) => {
  const example = examples[req.params.example];
  if (!example) {
    res.status(404);
    res.send({ error: 'Example Not Found' });
  }
  res.status(200);
  res.send(example);
});

app.listen(process.env.PORT || '3000');

console.log('server started');
