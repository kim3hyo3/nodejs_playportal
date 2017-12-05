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
    connection.query('SELECT id_request, type, title, content, m_cd, date_format(regdate,\'%Y-%m-%d %H:%i:%s\') AS regdate, hit from request;', function (err, rows) {
      if (err) console.error("err : " + err);
      // console.log("rows : " + JSON.stringify(rows));
      res.render('request/list', {token: req.session.username, rows: rows});
      connection.release();
    });
  });
});

router.post('/write', function(req, res, next){
  console.log(req.body);
  var type =  req.body.type;
  var title = req.body.title;
  var content = req.body.content;
  var reqData = [type, title, content];

  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForInsertRequest = "INSERT INTO request(type, title, content) values(?,?,?);";
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
