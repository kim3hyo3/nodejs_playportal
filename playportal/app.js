var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var request = require('./routes/request');
var culture = require('./routes/culture');
var playdocs = require('./routes/playdocs');

var mysql = require('mysql');
var configdb = require('./configdb.json');

pool = mysql.createPool({
  host     : configdb.host,
  user     : configdb.user,
  password : configdb.password,
  database : configdb.database
});

const ejsLint = require('ejs-lint');

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

/*const secret = config('server.sessionHash');
const secureCookie = config('server.secureCookie');*/

//session
app.use(session({
  /*genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },*/
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1200000
    // maxAge: 180000 3분,
  }
}));

// 로그인 검증 로직
exports.loginValidate = function (req, res, next) {
  console.log('Validate!! go to login');
  if (req.session.loginid !== undefined) {
  //통과-세션에 로그인 아이디가 있으면 진행
    //console.log('loginValidate 11111 success'+JSON.stringify(req.session));
    res.set({
      'Expires': 0, // For backward compatibility with HTTP/1.0
      'Cache-Control': 'private, no-cache, no-store, must-revalidate'
    });
    next();
  }else if (req.session.loginid === undefined || req.session.loginid === "") {
  //실패-세션에 로그인 아이디가 없으면 에러
    //console.log('loginValidate 00000 error');
    res.redirect('/');
  }
};

app.use('/', index);

//original
app.use('/request', loginValidate, request);
// 게시판 보기 '/'

//modify
/*app.get('/request', function(req, res, next){
  res.redirect('/request/list/1')
});

app.get('/request/list/:page', request.boardList, function(req, res, next){
  page = req.body.param;
  boardList(page);
});*/

app.use('/culture', loginValidate, culture);
app.use('/playdocs', loginValidate, playdocs);

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

module.exports = app;
