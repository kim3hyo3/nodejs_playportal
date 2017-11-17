var express = require('express');
var router = express.Router();

//login_page
router.get('/', function(req, res, next) {
  res.render('login');
});

//log_login
//login.ejs에서 id, pass를 post로 받고 req.body로 받아서 (로그인 검증을 하고) 세션에 담아준다.
//로그인 검증 req.body를 mysql에 있는 person_id person_pass하고 비교후 일치 여부를 확인후 통고시켜준다 select inform validated
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

/*
link info를 받아와야하고
메인화면에 전체적인 포털을 보여주고 부분적으로 로그인이 가능하게 만들어야 한다
메인화면에 로그인 입력창이 필요하다. 부분적으로 들어갔을 경우
*/

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
