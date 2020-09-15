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