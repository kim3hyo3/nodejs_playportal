var express = require('express');
var router = express.Router();

var session = require('express-session');

var app = express();

//session
app.set('trust proxy', 1);// trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));

//login_page
router.get('/', function(req, res, next) {
  res.render('login');
});

//log_login
router.post('/login', function(req, res, next) {
    console.log(test);
    console.log(req.body.username);
    console.log(req.body.password);

    session.username = req.body.username;
    session.password = req.body.password;

    //mysql 검증 부분 추가해줄 곳 select inform validated
    //tmp insert id_name password 맞춰서 진행

    if (session.username == null || session.username == "") {
        res.redirect('/');
    } else if (session.username != null) {
        res.redirect('/main');
    }
});

//log_logout
router.get('/logout', function (req, res, next){
  //first login way
  /*if(session != null) {
    session = null;
    res.redirect('/');
  }else{
    res.redirect('/');
  }
  */
  //second login way
  sess = req.session;
  if(sess.username){
    req.session.destroy(function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect('/');
      }
    })
  } else {
    res.redirect('/');
  }
});

router.get('/main', function(req, res, next) {
    res.render('main', { title: 'Express' });
});

router.post('/main', function(req, res, next) {
    res.render('main', { title: 'Express' });
});

router.get('/table', function(req, res, next) {
    res.render('table', { title: 'Express' });
});

router.get('/table/nodeOne', function(req, res, next) {
    res.render('table_nodeOne', { title: 'Express' });
});

router.get('/table/nodeTwo', function(req, res, next) {
    res.render('table_nodeTwo', { title: 'Express' });
});

module.exports = router;
