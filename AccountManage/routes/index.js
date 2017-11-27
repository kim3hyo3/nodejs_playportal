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
개발-로그인-시나리오
post.('/') login.ejs -> inputform -> post.('/main') -> req.body 받아온 입력정보를(구현)
DB에 있는 회원정보를 불러와서 검증하고 일치한다면(미구현)(db-table-구현)(연결-미구현)
단방향 암호화 시키고(미구현)
session에 담아서(구현)
로그인 유지한다(미확인)
*/

/*
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
    res.render('index/main', {token: logVal});
  }
});

router.post('/main/containlink', function (req, res, next) {
  console.log(req.body.containlink);
  var link = req.body.containlink;

  res.render('index/containlink', {token: req.session.username, link: link});
});

router.get('/culture', function (req, res, next) {
  console.log(req.session);

  //excel upload
  //
  if (typeof require !== 'undefined') XLSX = require('xlsx');

  var workbook = XLSX.readFile('culture_balance01.xlsx');

  /* DO SOMETHING WITH workbook HERE */
  //BringSheetName
  var first_sheet_name = workbook.SheetNames[0];
  console.log('01'+first_sheet_name);

  //settingAddressOfCell
  var address_of_cell = 'B1';

  /* Get worksheet */
  //
  var worksheet = workbook.Sheets[first_sheet_name];
  console.log(worksheet);

  /* Find desired cell */
  var desired_cell = worksheet[address_of_cell];
  console.log(desired_cell);

  /* Get the value */
  var desired_value = desired_cell.v;
  console.log('04'+desired_value);

  /* output format determined by filename */

  XLSX.writeFile(workbook, 'culture_balance01_out.xlsx');

  /* at this point, out.xlsx is a file that you can distribute */

  var select = 'SELECT site_title, site_content FROM view_site;';

  pool.getConnection(function(err,connection){
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
        console.log('rows[0].site_title is: ', rows[0].site_title);
        console.log('SELECT count :', rows.length);
        rows.forEach(function (i) {
          console.log('SELECT i :', i);
        });
      }
      res.render('index/culture', {token: req.session.username, siteList: rows});
      connection.release();
    });
  });
});

router.get('/table', function (req, res, next) {
  res.render('table', {title: 'Express'});
});

router.get('/table/nodeOne', function (req, res, next) {
  res.render('table_nodeOne', {title: 'Express'});
});

router.get('/table/nodeTwo', function (req, res, next) {
  res.render('table_nodeTwo', {title: 'Express'});
});


router.get('/attendence', function (req, res, next) {
  res.render('index/attendence');
});

router.post('/attendence', function (req, res, next) {
  app.post('/upload',upload.array('userfile',2), function(req, res) {
    var workbook_am = XLSX.readFile('upxls/1.xls');
    var workbook = XLSX.readFile('upxls/2.xls');

    var ws = []
    var sheet_am = workbook_am.SheetNames[0]; 
    ws[0] = workbook_am.Sheets[sheet_am];
    var sheet_pm = workbook.SheetNames[0]; 
    ws[1] = workbook.Sheets[sheet_pm];
    
    var aph = 'ABCDE';
    var i=0, j=0;
    
    /* 퇴근 */
    
    var arr_am = new Array();
    var name_am = new Array();
    var date_am = new Array();
    var time_am = new Array();
    arr_am.push(name_am, date_am, time_am);
    var arr_pm = new Array();
    var name_pm = new Array();
    var date_pm = new Array();
    var time_pm = new Array();
    arr_pm.push(name_pm, date_pm, time_pm);
    i = 0;
    for(k = 0; k < 2; k++) {
        for(i = 0; i < 3; i++) {
            j=0;
            while(1) {
                var cell = aph[i]+(j+1);
                var desCell = ws[k][cell];
                if(desCell) {
                    if(k == 0){     //k 가 0이면 오전
                        if(i == 0)
                            arr_am[i].push(desCell.v);
                        else
                            arr_am[i].push(desCell.w);
                        j++;
                    } else {
                        if(i == 0)
                            arr_pm[i].push(desCell.v);
                        else
                            arr_pm[i].push(desCell.w);
                        j++;
                    }
                } else { break;}
            }
        }
    }
    // ---------------------------여기까지 양쪽 이름 다 받음 ------------------------------
    
     
    arr_am = new Array();
    arr_pm = new Array();
    var year = 17;
    var month = 11;
    var a = req.body.day;
    var j = a;
    day = new Array();
    for(i = 0; i < 6; i++) {
        day.push(month+'/'+j+'/'+year)
        j++;
    }
    var newName = new Array();
    var newDate = new Array();
    var newTime_pm = new Array();
    var newTime_am = new Array();
    var name = new Array();
    
    for ( var i = 0 ; i < name_am.length; i++) {
        name.push(name_am[i]);
    }
    for ( var i = 0 ; i < name_pm.length; i++) {
        name.push(name_pm[i]);
    }
    
    name.sort(1);
    
    var na = '';
    for(var i = 0 ; i < name.length ; i++) {    //정렬한 이름을 6개로 저장
        if(na != name[i]) {
            na = name[i];
            for(j = 0 ; j < 6 ; j++) {
                newName.push(na);
            }
        }
    }
    for(var i = 0; i < (newName.length/6); i++) {   //한사람당 6일
        for(var j = 0 ; j < 6; j++){
            newDate.push(day[j]);
        }
    }
    
    i = 0;
    j = 0;
    while(i < newName.length) {
        if(newName[i] == name_pm[j] && newDate[i] == date_pm[j]) //뉴배열 i번째의 이름,날짜와 구배열 j번째의 이름,날짜가 같으면 구시간 j를 뉴시간 i에 저장
        {                                                   //하고 i 증가 j 증가    틀리면 i만 증가
            if(parseInt(time_pm[j]) < 7) {
                newTime_pm[i-1] = parseInt(time_pm[j])+24+time_pm[j].substring(time_pm[j].length,(time_pm[j].length-3)); //시에 24를 더하고 뒤 3글자를 붙인것을 전날에 저장
            }
            else {newTime_pm[i] = time_pm[j];}
            i++;
            j++;
            if(name_pm[j] == name_pm[j-1] && date_pm[j] == date_pm[j-1]) {  //같은날 두번찍으면 i감소
                i--;
            }
        } else { 
            newTime_pm[i] = '';
            i++; 
        }
    }
    
    //만약 퇴근시간이 6시 전이라면 전날 시간에 저장
    /* 출근 */
    i = 0;
    j = 0;
    while(i < newName.length) {
        if(newName[i] == name_am[j] && newDate[i] == date_am[j]) //뉴배열 i번째의 이름,날짜와 구배열 j번째의 이름,날짜가 같으면 구시간 j를 뉴시간 i에 저장
        {                                                   //하고 i 증가 j 증가    틀리면 i만 증가
            newTime_am[i] = time_am[j];
            i++;
            j++;
            if(name_am[j] == name_am[j-1] && date_am[j] == date_am[j-1]) {  //같은날 두번찍으면 i감소
                i--;
            }
        } else { 
            newTime_am[i] = '';
            i++; 
        }
    }
console.log(newName[1]+4);
    var day = new Array();
    for(i = 0; i < 6 ; i++) {
        day.push('20'+year+'-'+month+'-'+a)
        a++
    }
    j = 0;
    sql = 'insert into xls(name, date, gowork, offwork) values (?,?,?,?)'
    for(i = 0 ; i < newName.length ; i++) {
        conn.query(sql,[newName[i], day[j], newTime_am[i], newTime_pm[i]]);
        j++;
        if(j == 6) j=0;
    }
    console.log(newName[0]+5);
    res.redirect('/');
})
  res.render('attendence', {title: 'Express'});
});

module.exports = router;
