var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dateutil = require('date-utils');
const { check, validationResult } = require('express-validator');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const crypto = require('crypto');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session); 


var app = express();

var options ={                                              
  host: 'localhost',
  port: 3306,
  user:'root',
  password:'Rycgar123!',
  database:'plma'
};
var sessionStore = new MySQLStore(options);  
app.use(session({                                        
  secret:"rycgar123!",
  resave:false,
  saveUninitialized:true,
  store: sessionStore                                         
}))

const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'Rycgar123!',
  database:'plma',
  multipleStatements: true
});
connection.connect();

function isEmpty(value){
  if ( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
      return true
  } else return false
};
setInterval(function(){ 
  connection.end();

  setTimeout(function(){ consol.log("hi"); }, 2000);

  connection.connect();
}, 5000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/get_user', [check('grade').isInt({ min: 1, max: 3 }), check('class').isInt({ min: 1, max: 15 }), check('num').isInt({ min: 1, max: 50 }), check('mp').isInt(), check('lp').isInt(), check('mm').isInt(), check('lm').isInt(), check('ls').isInt(), check('ms').isInt()], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  var query = "SELECT * FROM user WHERE 1=1 ";
  if(req.body.grade) query += 'AND grade=' + req.body.grade;
  if(req.body.class) query += ' AND class=' + req.body.class;
  if(req.body.num) query += ' AND num=' + req.body.num;
  if(req.body.mp) query += ' AND plus >= ' + req.body.mp;
  if(req.body.lp) query += ' AND plus < ' + req.body.lp;
  if(req.body.mm) query += ' AND minus >= ' + req.body.mm;
  if(req.body.lm) query += ' AND minus < ' + req.body.lm;
  if(req.body.ls) query += ' AND plus-minus > ' + req.body.ls;
  if(req.body.ms) query += ' AND plus-minus <= ' + req.body.ms;
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
    }
    res.json(results);
  });
});

app.post('/submit_apply', [check('grade').isInt({ min: 1, max: 3 }), check('class').isInt({ min: 1, max: 15 }), check('num').isInt({ min: 1, max: 50 }), check('plus').isInt({ min: 0, max: 9999 }), check('minus').isInt({ min: 0, max: 9999 })], function(req, res){
  var newDate = new Date();
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("SELECT * FROM user WHERE grade = ? AND class = ? AND num = ?", [req.body.grade, req.body.class, req.body.num],function (error, userResults, fields) {
    if (error) {
      console.log(error);
    }
    if(isEmpty(userResults)) return res.status(410).end();
    connection.query("INSERT INTO history(date, teacher, user, beforeplus, beforeminus, afterplus, afterminus, reason) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [newDate.toFormat('YYYY-MM-DD HH24:MI:SS'), 1, userResults[0].stuid, userResults[0].plus, userResults[0].minus, userResults[0].plus*1 + req.body.plus*1, userResults[0].minus*1 + req.body.minus*1, req.body.reason],function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      connection.query("UPDATE user SET plus = plus + ?, minus = minus + ? WHERE grade = ? AND class = ? AND num = ?", [req.body.plus, req.body.minus, req.body.grade, req.body.class, req.body.num],function (error, results, fields) {
        if (error) {
          console.log(error);
        }
        console.log([req.body.plus, req.body.minus, req.body.grade, req.body.class, req.body.num]);
        res.end();
      });
    });
  });
});

app.post('/delete_history', [check('id').isInt({ min: 1, max: 1000000 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("DELETE FROM history WHERE id=?", [req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.json(results);
  });
});

app.post('/get_reasons', function(req, res){
  connection.query("SELECT * FROM reason", function (error, results, fields) {
    if (error) {
      console.log(error);
    }
    res.json(results);
  });
});

app.post('/add_reason', [check('plus').isInt(), check('minus').isInt()], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty() || isEmpty(req.body.title)) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("INSERT INTO reason(title, plus, minus) VALUES(?, ?, ?)", [req.body.title, req.body.plus, req.body.minus],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.status(200).end();
  });
});

app.post('/edit_reason', [check('id').isInt({ min: 1, max: 10000 }), check('plus').isInt({ min: 0, max: 1000 }), check('minus').isInt({ min: 0, max: 1000 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty() || isEmpty(req.body.title)) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("UPDATE reason SET title=?, plus=?, minus=? WHERE id=?", [req.body.title, req.body.plus, req.body.minus, req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.status(200).end();
  });
});

app.post('/get_reason', [check('id').isInt({ min: 1, max: 10000 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("SELECT * FROM reason WHERE id=?", [req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.json(results);
  });
});

app.post('/delete_reason', [check('id').isInt({ min: 1, max: 10000 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("UPDATE reason SET title=?, dpc=1 WHERE id=?", ['삭제된 사유', req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.json(results);
  });
});

app.post('/add_student', [check('stuid').isInt({ min: 1000, max: 9999 }), check('grade').isInt({ min: 1, max: 5 }), check('class').isInt({ min: 1, max: 15 }), check('num').isInt({ min: 1, max: 99 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty() || isEmpty(req.body.name)) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("INSERT INTO user(stuid, name, grade, class, num) VALUES(?, ?, ?, ?, ?)", [req.body.stuid, req.body.name, req.body.grade, req.body.class, req.body.num],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.status(200).end();
  });
});

app.post('/edit_student', [check('id').isInt(), check('stuid').isInt({ min: 1000, max: 9999 }), check('grade').isInt({ min: 1, max: 5 }), check('class').isInt({ min: 1, max: 15 }), check('num').isInt({ min: 1, max: 99 }), check('plus').isInt({ min: 0, max: 1000 }), check('minus').isInt({ min: 0, max: 1000 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty() || isEmpty(req.body.name)) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("UPDATE user SET stuid=?, name=?, grade=?, class=?, num=?, plus=?, minus=? WHERE id=?", [req.body.stuid, req.body.name, req.body.grade, req.body.class, req.body.num, req.body.plus, req.body.minus, req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.status(200).end();
  });
});

app.post('/get_student', [check('id').isInt()], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("SELECT * FROM user WHERE id=?", [req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.json(results);
  });
});

app.post('/delete_student', [check('id').isInt({ min: 1, max: 10000 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("UPDATE user SET name=?, grade=0, class=0, num=0, plus=0, minus=0, dpc=1 WHERE id=?", ['전출', req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.json(results);
  });
});

app.post('/add_teacher', [check('password').isAlphanumeric()], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty() || isEmpty(req.body.name) || isEmpty(req.body.job)) {
    return res.status(422).json({ errors: errors.array() })
  }
  var passwordHash = crypto.createHash('sha512').update(req.body.password).digest('base64');
  connection.query("INSERT INTO teacher(name, job, password) VALUES(?, ?, ?)", [req.body.name, req.body.job, passwordHash],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.status(200).end();
  });
});

app.post('/edit_teacher', [check('password').isAlphanumeric()], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty() || isEmpty(req.body.name) || isEmpty(req.body.job)) {
    return res.status(422).json({ errors: errors.array() })
  }
  var passwordHash = crypto.createHash('sha512').update(req.body.password).digest('base64');
  connection.query("UPDATE teacher SET name=?, job=?, password=? WHERE id=?", [req.body.name, req.body.job, passwordHash, req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.status(200).end();
  });
});

app.post('/delete_teacher', [check('id').isInt({ min: 1, max: 10000 })], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("UPDATE teacher SET name=?, dpc=1 WHERE id=?", ['삭제된 교사', req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.json(results);
  });
});

app.post('/get_teacher', [check('id').isInt()], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("SELECT * FROM teacher WHERE id=?", [req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    res.json(results);
  });
});

app.post('/login', [check('id').isInt(), check('password').isAlphanumeric()], function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  connection.query("SELECT * FROM teacher WHERE id=?", [req.body.id],function (error, results, fields) {
    if (error) {
      console.log(error);
      return res.status(500).json({ errors: error.code })
    }
    var passwordHash = crypto.createHash('sha512').update(req.body.password).digest('base64');
    if(results[0].password == passwordHash) { 
      req.session.uid = results[0].id;   
      req.session.name = results[0].name;      
      req.session.job = results[0].job;         
      req.session.isLogined = true; 
      req.session.save(function(){                               
        res.end();
      });
      
    }
    else res.status(423).end();
  });
});

app.post('/logout',  function(req, res){
  delete req.session.uid;
  delete req.session.isLogined;
  delete req.session.name;
  delete req.session.job;

  req.session.save(function(){
    res.end();
  });
  
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
