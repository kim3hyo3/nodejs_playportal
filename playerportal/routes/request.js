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

router.get('/', function(req, res, next) {
  console.log(req.session.loginid);
  if (req.session.loginid === undefined || req.session.loginid === "") {
    res.redirect('/');
  } else if (req.session.loginid !== undefined) {
    pool.getConnection(function(err,connection) {
      // SELECT id_request, title, content, date_format(regdate,'%Y-%m-%d %H:%i:%s')
      connection.query('SELECT id_request, title, content, date_format(regdate,\'%Y-%m-%d %H:%i\') AS regdate, hit, member.m_name, member.m_type, type.type_name ' +
        'FROM request ' +
        'INNER join member on request.m_cd = member.m_cd ' +
        'INNER join type on request.type_cd = type.type_cd;',
        function (err, rows) {
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
  var type_cd =  req.body.type_cd;
  var title = req.body.title;
  var content = req.body.content;
  var m_cd = req.body.m_cd;
  var reqData = [type_cd, title, content, m_cd];

  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForInsertRequest = "INSERT INTO request(type_cd, title, content, m_cd) values(?,?,?,?);";
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
