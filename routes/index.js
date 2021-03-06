var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'Rycgar123!',
  database:'plma',
  multipleStatements: true
});
connection.connect();
/* GET home page. */
router.get('/view', function(req, res, next) {
  if(!req.session.isLogined) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  connection.query('SELECT * FROM user', function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    res.render('index', { admin: req.session, page:'view', name:'상벌점 조회', users: results});
  });
});
router.get('/apply', function(req, res, next) {
  if(!req.session.isLogined) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  connection.query('SELECT * FROM reason WHERE dpc = 0', function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    res.render('index', { admin: req.session, title: 'Express', page:'apply', name:'상벌점 조회', reasons: results});
  });
});
router.get('/student', function(req, res, next) {
  if(!req.session.isLogined) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  connection.query('SELECT * FROM user', function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    res.render('index', { admin: req.session, title: 'Express', page:'student', name:'상벌점 조회', data: results});
  });
});
router.get('/teacher', function(req, res, next) {
  if(!req.session.isLogined) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  connection.query('SELECT * FROM teacher', function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    res.render('index', { admin: req.session, title: 'Express', page:'teacher', name:'상벌점 조회', data: results});
  });
});
router.get('/', function(req, res, next) {
  if(req.session.isLogined) {
    res.statusCode = 302;
    res.setHeader('Location', '/view');
    return res.end();
  }
  connection.query('SELECT id, name, job FROM teacher WHERE dpc = 0', function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    res.render('login', {data: results});
  });
  

});
router.get('/history', function(req, res, next) {
  if(!req.session.isLogined) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  var resultsTeacher=[], resultsUser=[], resultsReason=[];
  connection.query('SELECT * FROM teacher', function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    for(var i=0; i<results.length; i++) {
      resultsTeacher[results[i].id] = results[i];
    }
    connection.query('SELECT * FROM user', function (error, results, fields) {
      if (error) {
        console.log(error);
      } 
      for(var i=0; i<results.length; i++) {
        resultsUser[results[i].stuid] = results[i];
      }
      connection.query('SELECT * FROM reason', function (error, results, fields) {
        if (error) {
          console.log(error);
        } 
        for(var i=0; i<results.length; i++) {
          resultsReason[results[i].id] = results[i];
        }
        connection.query('SELECT * FROM history', function (error, results, fields) {
          if (error) {
            console.log(error);
          } 
          res.render('index', { admin: req.session, title: 'Express', page:'history', name:'상벌점 조회', data: results, teacherData: resultsTeacher, userData: resultsUser, reasonData: resultsReason});
        });
      });
    });
  });
  
});
router.get('/reason', function(req, res, next) {
  if(!req.session.isLogined) {
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  connection.query('SELECT * FROM reason', function (error, results, fields) {
    if (error) {
      console.log(error);
    } 
    res.render('index', { admin: req.session, title: 'Express', page:'reason', name:'상벌점 조회', data: results});
  });
});
module.exports = router;
