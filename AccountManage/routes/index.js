var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '14231423',
  database : 'createdb'
});

//login_page
router.get('/', function(req, res, next) {
  res.render('login');
});

/*
개발-로그인-시나리오
post.('/') login.ejs에서 inputform에서 req.body로 받아온 입력정보를(구현)
DB에 있는 회원정보를 불러와서 검증하고 일치한다면(미구현)(db-table-구현)(연결-미구현)
단방향 암호화 시키고(미구현)
session에 담아서(구현)
로그인 유지한다(미확인)
*/

router.post('/main', function (req, res) {
  //console.log(req.body.username);
  /*
  login process
    if(mysql.db.userInfo==req.body.username){
    } else if{
    }
  */
  req.session.username = req.body.username;
  // se.password = req.body.password;
  if (req.session.username === null || req.session.username === "") {
    res.redirect('/', 'login');
  } else if (req.session.username !== null) {
    connection.connect();
    var select = 'SELECT site_title, site_content FROM view_site;';
    connection.query(select, function (err, rows, fields) {
      /*
      if (error) throw error;
      console.log('The solution is: ', results[0].site_title);
      */
      if (err) {
        console.error('SELECT ERROR', err);
        return;
      }
      if (rows) {
        console.log('The solution is: ', rows[0].site_title);
        console.log('SELECT count :', rows.length);
        rows.forEach(function (i) {
          console.log('SELECT i :', i);
        });
      }
      res.render('main', {token: req.session.username, siteList: rows});
    });
    connection.end();
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
  se = req.session;
  if(se.username){
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
  let userName = req.session.username;
  console.log(req.session);

  res.render('main', { token : userName });
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
