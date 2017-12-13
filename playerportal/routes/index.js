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

//login_page
router.get('/', function (req, res, next) {
  res.render('index/login');
});

//router.get('/main', [dfdfd], function (req, res) {
router.get('/main', function (req, res, next) {
  console.log(req.session.loginid);
  res.render('index/main', {token: req.session.loginid});
});

router.post('/main', function (req, res, next) {
  console.log(req.body.username);
  pool.getConnection(function(err, connection) {
/*SQL injection을 방지하기 위한 Preparing Queries
var inserts = ['m_id', 'm_password', 'm_id', mid];
var sql = 'SELECT ??, ?? from member where ?? = ?';
sql = connection.format(sql, inserts);*/
// sql = 'SELECT m_id, m_password from member where m_id = "'+mid+'"';
    mid = req.body.username;
    mpassword = req.body.password;
    connection.query('SELECT m_id, m_cd, m_password from member where m_id = ?', [mid], function (err, rows, fields) {
     console.log('rows.length '+rows.length);
     //통과구문
     if (rows.length !== 0) {
        console.log('question id '+mid);
        console.log('question password '+mpassword);
        console.log('m_id '+rows[0].m_id);
        console.log('m_cd '+rows[0].m_cd);
        console.log('m_password '+rows[0].m_password);
        //통과로직
        if (rows[0].m_id === mid && rows[0].m_password === mpassword) {
          //sql로 받아온 m_id를 session.loginid에 넣음. m_cd도 같이 넣음.
          req.session.loginid = rows[0].m_id;
          req.session.logincd = rows[0].m_cd;
          console.log(req.session);
          res.render('index/main', {loginid: req.session.loginid},{logincd: req.session.logincd});
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
router.get('/attendence', function (req, res, next) {
  res.render('attendence', {title: 'Express'});
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

    /!* 퇴근 *!/
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
    /!* 출근 *!/
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
});*/


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
