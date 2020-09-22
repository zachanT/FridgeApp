const { pool } = require('../DBconfig');
 
exports.view = function (request, response) {
   var groupid = localStorage.getItem('groupid');
   pool.query(`SELECT name FROM users
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
         //response.render('group', {msg});
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