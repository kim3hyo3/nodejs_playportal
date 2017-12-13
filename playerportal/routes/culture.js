var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  console.log(req.session.loginid);
  pool.getConnection(function (err, connection) {
    var query = 'SELECT member.m_name, culturelife_m.grant, culturelife_m.use, culturelife_m.extinction, culturelife_m.balance FROM culturelife_m INNER JOIN member ON member.m_cd = culturelife_m.m_cd;';
    connection.query(query, function (err, rows, fields) {
      // console.log('전체문생비보기'+rows);
      /*if (err) {
        console.error('SELECT ERROR', err);
        return;
      }
      if (rows) {
        console.log('rows[0].grant is: ', rows[0].grant);
        console.log('SELECT count :', rows.length);
        rows.forEach(function (i) {
          console.log('SELECT i :', i);
        });
      }*/
      /*for(var i = 0; i < rows.length; i++){
        console.log(rows[i].grant);
      }*/
      res.render('culture/cltr_list', {token: req.session.loginid, cultureData: rows});
      connection.release();
    });
  });
});

module.exports = router;
