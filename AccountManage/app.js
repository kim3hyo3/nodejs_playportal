var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');

//Add liveServer npm module
//var liveServer = require("live-server");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//session
app.set('trust proxy', 1);// trust first proxy

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//try liveServer module fail log
/*
var params = {
  port: 8181, // Set the server port. Defaults to 8080. 
  host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
  root: "/", // Set root directory that's being served. Defaults to cwd. 
  open: false, // When false, it won't load your browser by default. 
  ignore: 'scss,my/templates', // comma-separated string for paths to ignore 
  file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
  wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec. 
  mount: [['/components', './node_modules']], // Mount a directory to a route. 
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots 
  middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack 
};
liveServer.start(params);
*/

module.exports = app;
