var express = require('express');
var router = express.Router();

//login_page
router.get('/', function (req, res, next) {
  res.render('index/login');
});

//log_logout
router.get('/logout', function (req, res, next) {
  //first login way
  /*if(session != null) {
    session = null;
    res.redirect('/');
  }else{
    res.redirect('/');
  }
  */
  //second login way
  if (req.session.username) {
    req.session.destroy(function (err) {
      if (err) {
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
//develope-login-scenario
개발-로그인-시나리오
post.('/') login.ejs -> inputform -> post.('/main') -> req.body 받아온 입력정보를(구현)
DB에 있는 회원정보를 불러와서 검증하고 일치한다면(미구현)(db-table-구현)(연결-미구현)
단방향 암호화 시키고(미구현)
session에 담아서(구현)
로그인 유지한다(미확인)
*/

/*
//mysql-apply-code
connection.connect();
var select = 'SELECT site_title, site_content FROM view_site;';
connection.query(select, function (err, rows, fields) {
  /!*
  if (error) throw error;
  console.log('The solution is: ', results[0].site_title);
  *!/
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
  // res.render('index/main', {token: req.session.username, siteList: rows});
});
connection.end();
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
  var logVal = req.session.username;
  // se.password = req.body.password;
  if (logVal === null || logVal === "") {
    res.redirect('/', 'login');
  } else if (logVal !== null) {
    res.render('index/main', {
      token: logVal
    });
  }
});

router.post('/main/containlink', function (req, res, next) {
  console.log(req.body.containlink);
  var link = req.body.containlink;

  res.render('index/containlink', {
    token: req.session.username,
    link: link
  });
});

router.get('/culture', function (req, res, next) {
  console.log(req.session);
  pool.getConnection(function (err, connection) {
    var select = 'SELECT member.m_name, culturelife.grant, culturelife.use, culturelife.extinction, culturelife.balance ' +
      'FROM culturelife INNER JOIN member ' +
      'ON culturelife.id_member = member.id_member;';
    connection.query(select, function (err, rows, fields) {
      console.log(rows);
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
      for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].grant);
      }
      res.render('index/culture', {
        token: req.session.username,
        cultureData: rows
      });
      connection.release();
    });
  });
});

router.get('/table', function (req, res, next) {
  res.render('table', {
    title: 'Express'
  });
});

router.get('/table/nodeOne', function (req, res, next) {
  res.render('table_nodeOne', {
    title: 'Express'
  });
});

router.get('/table/nodeTwo', function (req, res, next) {

  res.render('table_nodeTwo', {
    title: 'Express'
  });
});


router.get('/attendence', function (req, res, next) {
  pool.getConnection(function (err, connection) {
    var sql = "select *,DATE_FORMAT(date, '%y%m%d') as date from att where date > '2017-11' AND mode=1 order by name asc, date asc"
    connection.query(sql, function (err, am) {
      var sql = "select *,DATE_FORMAT(date, '%y%m%d') as date from att where date > '2017-11' AND mode=2 order by name asc, date asc"
      connection.query(sql, function (err, pm) {
        var cname = new Array();
        var name = new Array();
        for (var i = 0; i < am.length; i++) {
          cname.push(am[i].name);
        }
        for (var i = 0; i < pm.length; i++) {
          cname.push(pm[i].name);
        }
        cname.sort(1);
        var j=0;
        name.push(cname[0]);
        for (var i = 1; i < cname.length; i++) {
          if (name[j] != cname[i]) {
            name.push(cname[i]);
            j++;
          }
        }

        var mon = new Date(2017,11,0).getDate();
        var date = [];
        var day = 171101;
        for(var i = 0; i < mon; i++) {
          date.push((day+i).toString());
        }
        if(am[1].date === date[7]) { console.log(1)} else {console.log(am[1].date, date[7])}
 
        res.render('index/att', {
          on: am,
          off: pm,
          name: name
        });
      })
    })
  })
})

/*
  //excel upload
  if (typeof require !== 'undefined') XLSX = require('xlsx');

  var workbook = XLSX.readFile('culture_balance01.xlsx');

  /!* DO SOMETHING WITH workbook HERE *!/
  //BringSheetName
  var first_sheet_name = workbook.SheetNames[0];
  console.log('01'+first_sheet_name);

  //settingAddressOfCell
  var address_of_cell = 'B1';

  /!* Get worksheet *!/
  //
  var worksheet = workbook.Sheets[first_sheet_name];
  console.log(worksheet);

  /!* Find desired cell *!/
  var desired_cell = worksheet[address_of_cell];
  console.log(desired_cell);

  /!* Get the value *!/
  var desired_value = desired_cell.v;
  console.log('04'+desired_value);

  /!* output format determined by filename *!/

  XLSX.writeFile(workbook, 'culture_balance01_out.xlsx');

  /!* at this point, out.xlsx is a file that you can distribute *!/
*/

module.exports = router;
