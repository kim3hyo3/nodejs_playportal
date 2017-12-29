var express = require('express');
var router = express.Router();

/* GET users listing. */

//글목록 보기
router.get('/', function (req, res, next) {
  pool.getConnection(function (err, connection) {
    // SELECT id_request, title, content, date_format(regdate,'%Y-%m-%d %H:%i:%s')
    connection.query('SELECT id_request, title, content, hit, date_format(regdate,\'%Y-%m-%d %H:%i\') AS regdate, ' +
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
    // res.render('request/rqst_list', {loginid : req.session.loginid, logincd : req.session.logincd, loginname : req.session.loginname, rows : rows, page : page, leng : Object.keys(rows).length-1, page_num: 10, pass: true});
      connection.release();
    });
  });
});

// original
router.post('/write', function(req, res, next){
  console.log(req.body);
  var title = req.body.title;
  var content = req.body.content;
  //session에서 logincd을 받아와서 m_cd에 넣음.
  var m_cd = req.session.logincd;
  var status_cd = req.body.status_cd;
  var type_cd = req.body.type_cd;

  var reqData01 = [title, content, m_cd, status_cd, type_cd];
  pool.getConnection(function (err, connection)
  {
    // Use the connection
    var sql01 = 'INSERT INTO request_board(title, content, m_cd, status_cd, type_id) values(?,?,?,?,\n' +
      '(SELECT task_type.type_id FROM task_type WHERE task_type.type_cd = ?))';
    connection.query(sql01, reqData01, function (err, rows) {
      if (err) console.error("err : " + err);
      // console.log("rows : " + JSON.stringify(rows));
      res.redirect('/request');
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

router.post('/edit', function (req, res, next) {
  console.log(req.body);
  var id_request = req.body.id_request;
  var title = req.body.title;
  var content = req.body.content;
  //session에서 logincd을 받아와서 m_cd에 넣음.
  var m_cd = req.session.logincd;
  var status_cd = req.body.status_cd;
  var type_cd = req.body.type_cd;
  var reqData = [id_request, title, content, m_cd, status_cd, type_cd, id_request];
  console.log(reqData);
  pool.getConnection(function (err, connection) {
    // Use the connection
    var sqlForEditRequest = "UPDATE request_board set id_request=?, title=?, content=?, m_cd=?, status_cd=?, type_cd=?, editdate=now() WHERE id_request=?;";
    connection.query(sqlForEditRequest, reqData, function (err, rows) {
      if (err) console.error("err : " + err);
      // console.log("rows : " + JSON.stringify(rows));
      res.redirect('/request');
      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

router.post('/delete', function (req, res, next) {
  console.log('deleteExperiment' + req.body.id_request);
  var id_request = req.body.id_request;
  pool.getConnection(function (err, connection) {
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

/* Read Page */

router.get('/read/:id_request',function (req,res,next) {
  /* GET 방식의 연결이므로 read 페이지 조회에 필요한 idx 값이 url 주소에 포함되어 전송됩니다.
   이 idx값을 참조하여 DB에서 해당하는 정보를 가지고 옵니다.
  * url에서 idx 값을 가져오기 위해 request 객체의 params 객체를 통해 idx값을 가지고 옵니다.*/
  var id_request = req.params.id_request;
  console.log("idx : "+id_request);
  /*
  * Node는 JSP에서 JDBC의 sql문 PreparedStatement 처리에서와 같이 sql문을 작성할 때
  * ? 를 활용한 편리한 쿼리문 작성을 지원합니다.
  * Node에서 참조해야할 인자값이 있을 때 ? 로 처리하고
  * []를 통해 리스트 객체를 만든 후 ? 의 순서대로 입력해주시면 자동으로 쿼리문에 삽입됩니다.
  * 아래에는 ?에 idx값이 자동으로 매핑되어 쿼리문을 실행합니다.
  * */
  /**/
  connection.beginTransaction(function(err){
    if(err) console.log(err);
    connection.query('update board set hit=hit+1 where idx=?', [id_request], function (err) {
      if(err) {
        /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
        console.log(err);
        connection.rollback(function () {
          console.error('rollback error1');
        })
      }
      connection.query('select idx,title,content,writer,hit,DATE_FORMAT(moddate, "%Y/%m/%d %T")' +
        ' as moddate,DATE_FORMAT(regdate, "%Y/%m/%d %T") as regdate from board where idx=?',[id_request],function(err,rows)
      {
        if(err) {
          /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
          console.log(err);
          connection.rollback(function () {
            console.error('rollback error2');
          })
        }
        else {
          connection.commit(function (err) {
            if(err) console.log(err);
            console.log("row : " + rows);
            res.render('read',{title:rows[0].title , rows : rows});
          })
        }
      })
    })
  })
})
module.exports = router;
