var express = require('express');
var router = express.Router();

/*
//login-scenario 1st-outline
//로그인-시나리오
post.('/') login.ejs -> inputform -> post.('/main') -> req.body 받아온 입력정보를(구현)
DB에 있는 회원정보를 불러와서 검증하고 일치한다면(구현01-db_table_구현02-연결_구현)
단방향 암호화 시키고(미구현)
session에 담아서(구현)
로그인 유지한다(구현)

//login-process 2nd-outline
입력받은 req.body.username 하고 db-id 를 대조 해보고 일치하면 불러온다음
req.body.username, password 하고 db-id, db-password 를 대조 해보고
일치하면 db-result를 req.session.id에 넣어 세션을 유지한다.
*/

// 로그인 검증 로직
loginValidate = function (req, res, next) {
  console.log('Validate!! go to login');
  if (req.session.loginid !== undefined) {
    //통과-세션에 로그인 아이디가 있으면 진행
    console.log('loginValidate 11111 success'+JSON.stringify(req.session));
    res.set({
      'Expires': 0, // For backward compatibility with HTTP/1.0
      'Cache-Control': 'private, no-cache, no-store, must-revalidate'
    });
    next();
  }else if (req.session.loginid === undefined || req.session.loginid === "") {
    //실패-세션에 로그인 아이디가 없으면 에러
    console.log('loginValidate 00000 error');
    res.redirect('/');
  }
};

//login_page
router.get('/', function (req, res, next) {
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.render('index/login');
});

router.get('/main', loginValidate, function (req, res, next) {
  console.log('main loginid'+req.session.loginid);
  res.render('index/main', {loginid: req.session.loginid, logincd: req.session.logincd, loginname: req.session.loginname});
});

router.post('/main', function (req, res, next) {
  pool.getConnection(function(err, connection) {
/*SQL injection을 방지하기 위한 Preparing Queries
var inserts = ['m_id', 'm_password', 'm_id', mid];
var sql = 'SELECT ??, ?? from member where ?? = ?';
sql = connection.format(sql, inserts);*/
// sql = 'SELECT m_id, m_password from member where m_id = "'+mid+'"';
    mid = req.body.username;
    mpassword = req.body.password;
    connection.query('SELECT m_id, m_cd, m_name, m_password from member where m_id = ?', [mid], function (err, rows, fields) {
     //통과로직
     if (rows.length !== 0) {
        console.log('select mid '+mid);
        console.log('select mpassword '+mpassword);
        console.log('m_id '+rows[0].m_id);
        console.log('m_cd '+rows[0].m_cd);
        console.log('m_name '+rows[0].m_name);
        console.log('m_password '+rows[0].m_password);
        //통과로직
        if (rows[0].m_id === mid && rows[0].m_password === mpassword) {
          //sql로 받아온 m_id를 session.loginid에 넣음. m_cd도 같이 넣음. m_name도 같이 넣음.
          req.session.loginid = rows[0].m_id;
          req.session.logincd = rows[0].m_cd;
          req.session.loginname = rows[0].m_name;
          console.log('select after main');
          console.log(req.session);
          res.render('index/main', {loginid: req.session.loginid, logincd: req.session.logincd, loginname: req.session.loginname});
          connection.release();
        //실패로직
        } else if (rows[0].m_id !== mid || rows[0].m_password !== mpassword) {
          res.redirect('/');
          connection.release();
        }
      //실패로직
      } else if (rows.length === 0 || rows.length === "") {
        res.redirect('/');
        connection.release();
      }
    });
  });
});

//logout
router.get('/logout', function (req, res, next) {
  //login way
  if (req.session.loginid !== null) {
    req.session.destroy(function (err) {
      if (err) {
        console.log('here logout 000');
        console.log(err);
      } else {
        console.log('here logout 111');
        //orignal way
        res.redirect('/');
      }
    })
  } else {
    res.redirect('/');
  }
});

module.exports = router;

//1 way
// res.clearCookie(sid);
//2 way
// res.clearCookie('connect.sid', {
//   path: '/',
//   secure : true,
//   httpOnly: true
// });
//3 way
// https://mixmax.com/blog/chrome-back-button-cache-no-store
// res.setHeader('Cache-Control', 'no-cache, no-store'); // Added no-store
// res.redirect('/');
//4 way
// set response header *BEFORE* sending response body
// res.set({
//   'Expires': 0, // For backward compatibility with HTTP/1.0
//   'Cache-Control': 'private, no-cache, no-store, must-revalidate'
// });
//5 way
// res.send(
//   `<h1>authenticated user only can view this page</h1>
//   <p id="log">this page rendered at ${(new Date()).toString()}</p>
//   <script type="text/javascript">
//     window.addEventListener('pageshow', (event) => {
//       if(event.persisted) {
//         log.innerHTML += '<br><strong>(page loaded from bfcache)</strong>'
//         window.location.reload();
//       }
//     }
//   </script>`);
