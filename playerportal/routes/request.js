var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
  console.log('1');
  res.redirect('/request/list/1');
});

router.get('/list/:page', function (req, res, next) {
  pool.getConnection(function(err,connection) {
    connection.query('SELECT id_request, m_cd, title, content, date_format(modidate,\'%Y-%m-%d %H:%i:%s\') AS modidate, hit from request;', function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('request/list', {token: req.session.username, rows: rows});
      connection.release();
    });
  });
});

router.get('/detail/:id_request', function (req, res, next) {
  console.log("aaaaa"+req.params.id_request);
  var id_request = req.params.id_request;

  pool.getConnection(function(err,connection) {
  var query = 'SELECT '+id_request+', title, content, date_format(modidate,\'%Y-%m-%d %H:%i:%s\') AS modidate, hit from request where id_request;'
    connection.query(query, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('request/detail', {token: req.session.username, readItem: rows});
      connection.release();
    });
  });
});

router.post('/write', function(req, res, next){
  console.log(req.body);
  var password = req.body.password;
  var type =  req.body.type;
  var title = req.body.title;
  var content = req.body.content;
  var reqData = [password, type, title, content];

  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForInsertRequest = "insert into request(password, type, title, content) values(?,?,?,?);";
    connection.query(sqlForInsertRequest, reqData, function (err, rows) {
      if (err) console.error("err : " + err);
      // console.log("rows : " + JSON.stringify(rows));
      res.redirect('/request');
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});


module.exports = router;
