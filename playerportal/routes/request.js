var express = require('express');
var router = express.Router();

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
  console.log('1');
  res.redirect('/request/list/1');
});
*/
/*router.get('/list/:page', function (req, res, next) {
});*/

router.get('/', function(req, res, next) {
  console.log(req.session.loginid);
  if (req.session.loginid === undefined || req.session.loginid === "") {
    res.redirect('/');
  } else if (req.session.loginid !== undefined) {
    pool.getConnection(function(err,connection) {
      connection.query('SELECT id_request, type, title, content, date_format(regdate,\'%Y-%m-%d %H:%i:%s\') AS regdate, hit, member.m_name\n' +
        'from request\n' +
        'INNER join member on member.m_cd = request.m_cd;', function (err, rows) {
        if (err) console.error("err : " + err);
        // console.log("rows : " + JSON.stringify(rows));
        res.render('request/list', {token: req.session.loginid, rows: rows});
        connection.release();
      });
    });
  }
});

router.post('/write', function(req, res, next){
  console.log(req.body);
  var type =  req.body.type;
  var title = req.body.title;
  var content = req.body.content;
  var m_cd = req.body.m_cd;
  var reqData = [type, title, content, m_cd];

  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForInsertRequest = "INSERT INTO request(type, title, content, m_cd) values(?,?,?,?);";
    connection.query(sqlForInsertRequest, reqData, function (err, rows) {
      if (err) console.error("err : " + err);
      // console.log("rows : " + JSON.stringify(rows));
      res.redirect('/request');
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

router.post('/edit', function(req, res, next){
  console.log(req.body);
  var id_request = req.body.id_request;
  var type =  req.body.type;
  var title = req.body.title;
  var content = req.body.content;
  var reqData = [id_request, type, title, content, id_request];
  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForEditRequest = "UPDATE request set id_request=?, type=?, title=?, content=?, editdate=now() WHERE id_request=?;";
    connection.query(sqlForEditRequest, reqData, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.redirect('/request');
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

module.exports = router;
