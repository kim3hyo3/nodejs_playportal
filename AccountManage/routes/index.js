var express = require('express');
var router = express.Router();

//login_page
router.get('/', function(req, res, next) {
  res.render('login');
});

//log_login
//mysql 검증 부분 추가해줄 곳 select inform validated
//tmp_working SELECT id_name password 맞춰서 진행

router.post('/login', function (req, res) {
  console.log(req.body.username);

  /*connection.connect();

  var select = 'SELECT person_id FROM table_person WHERE name =?';

  connection.query(, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].person_id);
  });

  connection.end();

  if(==req.body.username){

  } else if{

  }*/

  sess = req.session;

  sess.username = req.body.username;
  // session.password = req.body.password;
  if (sess.username === null || sess.username === "") {
    res.redirect('/');
  } else if (sess.username !== null) {
    res.render('main', {token: sess.username} );
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
