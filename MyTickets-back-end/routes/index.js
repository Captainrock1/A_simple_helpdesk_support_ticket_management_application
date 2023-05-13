var express = require('express');
var router = express.Router();
var database = require('../database');
const cookieSession = require("cookie-session");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
  }));

const ifNotLoggedin = (req, res, next) => {
  if(!req.session.isLoggedIn){
        return res.render('login',{message:'notLogin'});
  }
  next();
}
const ifLoggedin = (req, res, next) => {
    if (req.session.isLoggedIn) {
       return res.redirect('/');
    }
    next();
}

/* GET Home page. */
router.get('/', ifNotLoggedin, (req,res,next) => {
    database.execute('SELECT `username`,`role` FROM `user_data` WHERE userID = ?', [req.session.userID])
    .then(([rows]) => {
      const listTicketQuery =
      `SELECT ticket_data.ticketID,
              user_data.userID,
              ticket_data.title,
              ticket_data.description,
              ticket_data.created_by_date,
              ticket_status.statusID,
              ticket_status.status,
              ticket_status.latest_update_date,
              user_data.username,
              user_data.email,
              user_data.phone
      FROM ticket_data
      JOIN ticket_status ON ticket_data.ticketID = ticket_status.ticketID
      JOIN user_data ON ticket_data.contactID = user_data.userID
      ORDER BY ticket_status.latest_update_date ASC`;
      database.execute(listTicketQuery)
      .then(([listTicketResults]) => {
        res.render('home', {
          username: rows[0].username,
          role: rows[0].role,
          action: 'list',
          ticketList: listTicketResults
        });
      });
    });
});// END OF ROOT PAGE

/* GET Create ticket page. */
router.get('/new_ticket', ifNotLoggedin, (req,res,next) => {
    database.execute('SELECT `username`,`role` FROM `user_data` WHERE userID = ?', [req.session.userID])
    .then(([rows]) => {
        res.render('home', {
            username: rows[0].username,
            role: rows[0].role,
            action:'create_ticket'
        });
      })
    .catch(err => {
        if (err) {
          res.redirect('/');
          console.log(err);
        }
      });
  });// END OF CREATE TICKET PAGE
  
  router.post('/create_ticket', ifNotLoggedin, (req,res,next) => {
    const ticketTitle = req.body.ticketTitle;
    const ticketDescription = req.body.ticketDescription;
    const ticketQuery = 'INSERT INTO ticket_data (contactID, title, description) VALUES (?, ?, ?)';
    const statusQuery = 'INSERT INTO ticket_status (ticketID, status) VALUES (?, ?)';
    database.execute('SELECT `userID` FROM `user_data` WHERE `userID` = ?',[req.session.userID])
    .then(([results]) => {
        const contactID = results[0].userID;
        database.execute(ticketQuery, [contactID, ticketTitle, ticketDescription])
        .then(([ticketResults]) => {
            const checkQuery = 'SELECT `ticketID` FROM `ticket_data` WHERE contactID = ? ORDER BY `created_by_date` DESC'
            database.execute(checkQuery, [contactID])
            .then(([checkResults]) => {
                const ticketID = checkResults[0].ticketID;
                database.execute(statusQuery, [ticketID, 'pending'])
                .then(([statusResults]) => {
                    res.redirect('/new_ticket');
                });
            });   
        });
    });
  });

  router.get('/setting', ifNotLoggedin, (req,res,next) => {
    database.execute('SELECT `username`,`role` FROM `user_data` WHERE userID = ?', [req.session.userID])
    .then(([rows]) => {
    const allSelectQuery =
      `SELECT ticket_data.ticketID,
              user_data.userID,
              ticket_data.title,
              ticket_data.description,
              ticket_data.created_by_date,
              ticket_status.statusID,
              ticket_status.status,
              ticket_status.latest_update_date,
              user_data.username,
              user_data.email,
              user_data.phone
      FROM ticket_data
      JOIN ticket_status ON ticket_data.ticketID = ticket_status.ticketID
      JOIN user_data ON ticket_data.contactID = user_data.userID
      ORDER BY ticket_data.created_by_date ASC`;
      database.execute(allSelectQuery).then(([results]) => {
        res.render('home', {
          username: rows[0].username,
          role: rows[0].role,
          tickets: results,
          action: 'setting'
        });
      });
    });
  });

  router.get('/edit_ticket/:ticketID', ifNotLoggedin, (req,res,next) => {
    database.execute('SELECT `username`,`role` FROM `user_data` WHERE userID = ?', [req.session.userID])
    .then(([rows]) => {
    const ticketID = req.params.ticketID;
    const selectTicketQuery =
      `SELECT ticket_data.ticketID,
              user_data.userID,
              ticket_data.title,
              ticket_data.description,
              ticket_data.created_by_date,
              ticket_status.statusID,
              ticket_status.status,
              ticket_status.latest_update_date,
              user_data.username,
              user_data.email,
              user_data.phone
      FROM ticket_data
      JOIN ticket_status ON ticket_data.ticketID = ticket_status.ticketID
      JOIN user_data ON ticket_data.contactID = user_data.userID
      WHERE ticket_data.ticketID = ${ticketID}`;
      database.execute(selectTicketQuery).then(([results]) => {
        res.render('home', {
          username: rows[0].username,
          role: rows[0].role,
          ticket: results[0],
          action: 'update_status'
        });
      });
    });
  });

  router.post('/filter-by-status', ifNotLoggedin, (req,res,next) => {
    database.execute('SELECT `username`,`role` FROM `user_data` WHERE userID = ?', [req.session.userID])
    .then(([rows]) => {
      const ticketStatus = req.body.status;
      if (ticketStatus == "") {
        res.redirect(`/`);
      } else {
        const filterTicketQuery =
        `SELECT ticket_data.ticketID,
                user_data.userID,
                ticket_data.title,
                ticket_data.description,
                ticket_data.created_by_date,
                ticket_status.statusID,
                ticket_status.status,
                ticket_status.latest_update_date,
                user_data.username,
                user_data.email,
                user_data.phone
        FROM ticket_data
        JOIN ticket_status ON ticket_data.ticketID = ticket_status.ticketID
        JOIN user_data ON ticket_data.contactID = user_data.userID
        WHERE ticket_status.status = '${ticketStatus}' ORDER BY ticket_status.latest_update_date ASC`;
        database.execute(filterTicketQuery)
        .then(([filterTicketResults]) => {
          res.render('home', {
            username: rows[0].username,
            role: rows[0].role,
            action: 'filter_list',
            ticketList: filterTicketResults
          });
        });
      }
    });
  });

  router.post('/update_status/:ticketID', ifNotLoggedin, (req,res,next) => {
    const ticketID = req.params.ticketID;
    var ticketStatus = req.body.status;
    database.execute("SELECT `status` FROM `ticket_status` WHERE `ticketID`=?",[ticketID])
    .then(([rows]) => {
      if(ticketStatus == 'pending') { 
        ticketStatus = 'pending';
      } else if(ticketStatus == 'accepted') {
        ticketStatus = 'accepted';
      } else if(ticketStatus == 'resolved') {
        ticketStatus = 'resolved';
      } else if(ticketStatus == 'rejected') {
        ticketStatus = 'rejected';
      } else {
        ticketStatus = rows[0].status;
      }
      const ticketQuery = `UPDATE ticket_status SET status = "${ticketStatus}" WHERE ticketID = "${ticketID}"`;
      database.execute(ticketQuery).then(([results]) => {
        res.redirect(`/setting`);
      });
    });
  });

/* GET Login page. */
router.get('/register', function(request, response, next){
  response.render('register', {title:'Register Menu', message:request.flash('fail')});
});

router.post('/', ifLoggedin, [
  body('username').custom((value) => {
      return database.execute('SELECT username FROM user_data WHERE username=?', [value])
      .then(([rows]) => {
          if(rows.length == 1){
              return true;
              
          }
          return Promise.reject('ไม่สามารถทำการเข้าสู่ระบบ ด้วยบัญชีที่ไม่เคยทำการสมัครสมาชิก!');
          
      });
  }),
  body('password','รหัสผ่านไม่สามารถมีค่าว่างได้!').trim().not().isEmpty(),
], (req, res, next) => {
  const validation_result = validationResult(req);
  const {password, username} = req.body;
  if(validation_result.isEmpty()){
      
    database.execute('SELECT * FROM `user_data` WHERE `username`=?',[username])
      .then(([rows]) => {
          bcrypt.compare(password, rows[0].password).then(compare_result => {
              if(compare_result === true){
                  req.session.isLoggedIn = true;
                  req.session.userID = rows[0].userID;
                  res.redirect('/');
              }
              else{
                  res.render('login',{
                    login_err: ['รหัสผ่านไม่ถูกต้อง!'],
                    message:'loginError'
                  });
              }
          })
          .catch(err => {
              if (err) throw err;
          });


      }).catch(err => {
          if (err) throw err;
      });
  }
  else{
      let allErrors = validation_result.errors.map((error) => {
          return error.msg;
      });
      // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
      res.render('login',{
        login_err: allErrors,
        message:'loginError'
      });
  }
});
// END OF LOGIN PAGE

// REGISTER PAGE
router.post('/register', ifLoggedin, 
// post data validation(using express-validator)
[
    body('email','อีเมลไม่ตรงตามรูปแบบของอีเมลสำหรับใช้งาน! ').isEmail().custom((value) => {
        return database.execute('SELECT `email` FROM `user_data` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('อีเมลนี้เคยมีการใช้งานในการสมัครสมาชิกแล้ว! ');
            }
            return true;
        });
    }),
    body('username').custom((value) => {
        return database.execute('SELECT username FROM user_data WHERE username=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('ชื่อผู้ใช้นี้เคยมีการใช้งานในการสมัครสมาชิกแล้ว! '); 
            }
            return true;    
        });
    }),
    body('username','ชื่อผู้ใช้ไม่สามารถมีค่าว่างได้! ').trim().not().isEmpty(),
    body('password','รหัสผ่านไม่ตรงตามรูปแบบเงื่อนไขที่กำหนด! ').trim().matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    body('phone', 'เบอร์มือถือไม่ตรงตามรูปแบบเงื่อนไขที่กำหนด!').trim().matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/),

],// end of post data validation
(req,res,next) => {
    const validation_result = validationResult(req);
    const {username, password, email, phone} = req.body;
    const status_success = "ยินดีด้วย! บัญชีสมาชิกของคุณถูกสร้างขึ้นสำเร็จแล้ว";
    const status_fail = "เสียใจด้วย! คุณไม่สามารถสมัครบัญชีสมาชิกได้ด้วยสาเหตุความผิดบางประการ";
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcryptjs)
        bcrypt.hash(password, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            database.execute('INSERT INTO `user_data`(`username`,`email`,`password`,`phone`,`role`) VALUES(?,?,?,?,?)',[username, email, hash_pass, phone,'user'])
            .then(result => {
                res.render('login',{
                    login_success: status_success,
                    message:'loginSuccess'
                  });
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        res.render('register',{
            message:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE

// LOGOUT
router.get('/logout',(req,res)=>{
  //session destroy
  req.session = null;
  res.render('login',{
    message: 'logout',
    logout_success: ['ขอบคุณสำหรับการเลือกใช้บริการจากทางเว็บไซต์ของเรา พวกเราหวังว่าว่าคุณจะกลับมาใช้บริการของเราอีกครั้งในโอกาสหน้า!']
});
});
// END OF LOGOUT

module.exports = router;