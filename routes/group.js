const { pool } = require('../DBconfig');
 
exports.view = function (request, response) {
   var groupid = localStorage.getItem('groupid');
   pool.query(`SELECT name, inviteid FROM users
               WHERE groupid = $1`, [groupid], (err, results) => {
                  if(err){
                     throw err;
                  }
                  console.log(results.rows);
                  response.render('group', {'group' : results.rows});
               })
};

exports.invite = function (request, response) {
   var { email } = request.body;
   var groupid = localStorage.getItem('groupid');
   let msg;
   var result;
   console.log(email);
   pool.query(`SELECT id, groupid FROM users WHERE email = $1`, [email], (err, results) => {
      if(err){
         throw err;
      }
      console.log(results.rows.length);
      if(results.rows.length <= 0) {
         msg = {message: "Email does not exist"};
         pool.query(`SELECT name FROM users
               WHERE groupid = $1`, [groupid], (err, results) => {
                  if(err){
                     throw err;
                  }
                  console.log(results.rows);
                  results.rows.push(msg)
                  console.log("Updated object");
                  console.log(results.rows);
                  response.render('group', {'group' : results.rows});
               })
      } else {
         console.log(results.rows);
         pool.query(`UPDATE users SET inviteid = $1 WHERE id = $2`, [groupid, results.rows[0].id], (err, results) => {
            if(err){
               throw err;
            }
            msg = {message: "Invite successfully sent"};
            pool.query(`SELECT name FROM users
               WHERE groupid = $1`, [groupid], (err, results) => {
                  if(err){
                     throw err;
                  }
                  console.log(results.rows);
                  results.rows.push(msg)
                  console.log("Updated object");
                  console.log(results.rows);
                  response.render('group', {'group' : results.rows});
               })
         })
      }
   })
}

exports.respond = function (request, response) {
   console.log("RESPONDING TO INVITE");
   var res = request.body.response;
   var userid = localStorage.getItem('userid');
   console.log(userid);
   console.log(res);
   if (res == "Accept") {
      pool.query(`SELECT inviteid FROM users WHERE id = $1`, [userid], (err, results) => {
         if (err) {
            throw err;
         }
         console.log(results.rows);
         pool.query(`UPDATE users SET groupid = $1 WHERE id = $2`, [results.rows[0].inviteid, userid], (err, results) => {
            if (err) {
               throw err;
            }
         });
      });
   } else if (res == "Decline") {

   }
   pool.query(`UPDATE users SET inviteid = NULL WHERE id = $1`, [userid], (err, results) => {
      if (err) {
         throw err;
      }
      response.redirect('/group');
   })
}

function renderPage(msg) {
   console.log("function");
   var groupid = localStorage.getItem('groupid');
   pool.query(`SELECT name FROM users
               WHERE groupid = $1`, [groupid], (err, results) => {
                  if(err){
                     throw err;
                  }
                  console.log(results.rows);
                  results.rows.push(msg)
                  console.log("Updated object");
                  console.log(results.rows);
                  return results.rows;
               })
}