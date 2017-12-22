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

//글목록 보기
router.get('/', function(req, res, next) {
  pool.getConnection(function(err,connection) {
    // SELECT id_request, title, content, date_format(regdate,'%Y-%m-%d %H:%i:%s')
    connection.query('SELECT id_request, title, content, date_format(regdate,\'%Y-%m-%d %H:%i\') AS regdate, hit, ' +
      'member.m_name, member.m_type, ' +
      'task_type.type_cd, task_type.type_name, task_type.mng_name, ' +
      'task_status.status_name, task_status.status_option ' +
      'FROM request_board ' +
      'INNER join member on request_board.m_cd = member.m_cd ' +
      'INNER join task_type on request_board.type_id = task_type.type_id ' +
      'INNER join task_status on request_board.status_cd = task_status.status_cd ' +
      'ORDER BY id_request DESC;',
      function (err, rows) {
      if (err) console.error("err : " + err);
      //console.log("rows : " + JSON.stringify(rows));
      res.render('request/rqst_list', {loginid: req.session.loginid, logincd: req.session.logincd, loginname: req.session.loginname, rows: rows});
      connection.release();
    });
  });

  /*pool.getConnection(function(err,connection) {
    // SELECT id_request, title, content, date_format(regdate,'%Y-%m-%d %H:%i:%s')
    connection.query('SELECT id_request, title, content, date_format(regdate,\'%Y-%m-%d %H:%i\') AS regdate, hit, ' +
      'member.m_name, member.m_type, ' +
      'task_type.name_lg, task_type.name_md, task_type.name_sm, task_type.mng_name, ' +
      'task_status.status_name, task_status.status_option ' +
      'FROM request_board ' +
      'INNER join member on request_board.m_cd = member.m_cd ' +
      'INNER join task_type on request_board.type_id = task_type.type_id ' +
      'INNER join task_status on request_board.status_cd = task_status.status_cd ' +
      'ORDER BY id_request DESC;',
      function (err, rows) {
        if (err) console.error("err : " + err);
        // console.log("rows : " + JSON.stringify(rows));
        res.render('request/rqst_list', {loginid: req.session.loginid, logincd: req.session.logincd, loginname: req.session.loginname, rows: rows});
        connection.release();
      });
  });*/
});

router.post('/write', function(req, res, next){
  console.log(req.body);
  var type_cd =  req.body.type_cd;
  var title = req.body.title;
  var content = req.body.content;
  //session에서 logincd을 받아와서 m_cd에 넣음.
  var m_cd = req.session.logincd;
  var reqData = [type_cd, title, content, m_cd];

  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForInsertRequest = "INSERT INTO request_board(type_cd, title, content, m_cd) values(?,?,?,?);";
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
  var type_cd =  req.body.type_cd;
  var status_cd = req.body.status_cd;
  var title = req.body.title;
  var content = req.body.content;
  //session에서 logincd을 받아와서 m_cd에 넣음.
  var m_cd = req.session.logincd;
  var reqData = [id_request, type_cd, status_cd, title, content, m_cd, id_request];
  console.log(reqData);
  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForEditRequest = "UPDATE request_board set id_request=?, type_cd=?, status_cd=?, title=?, content=?, m_cd=?, editdate=now() WHERE id_request=?;";
    connection.query(sqlForEditRequest, reqData, function (err, rows) {
      if (err) console.error("err : " + err);
      // console.log("rows : " + JSON.stringify(rows));
      res.redirect('/request');
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

router.post('/delete', function(req, res, next){
  console.log('deleteExperiment'+req.body.id_request);
  var id_request = req.body.id_request;
  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sqlForDeleteRequest = "DELETE FROM request_board WHERE id_request=?;";
    connection.query(sqlForDeleteRequest, id_request, function (err, rows) {
      if (err)
        console.error("err : " + err);
      res.redirect('/request');
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

module.exports = router;
