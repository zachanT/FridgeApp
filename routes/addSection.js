const {pool} = require('../DBconfig');

exports.addSection = function(request, response) {
   
   console.log(request.user.userid);
   console.log(typeof request.query.sectionName);

   pool.query(`INSERT INTO categories (userid, name, parentid)
               VALUES ($1, $2, $3)`, [request.user.id, request.query.sectionName, 0], (err, results)=>{
                  if (err) {
                     throw err;
                  }
                  console.log(results.rows);
                  response.redirect('/');
               });
}