const {pool} = require('../DBconfig');

exports.view = function (request, response) {
   var id = localStorage.getItem('userid');
   pool.query(`SELECT * FROM shoppingLists
               INNER JOIN users ON shoppingLists.userid=users.id
               WHERE userid=$1`, [id], (err, results)=>{
                  if (err) {
                     throw err;
                  }
                  console.log(results.rows);
                  response.render('shoppingList', { 'list' :results.rows });
                  /*pool.query(`SELECT name FROM users
                     WHERE id=$1`, [id], (err, results) => {
                        if (err) {
                           throw err;
                        }
                        console.log(results.rows);
                        response.render('shoppingList', { 'list': list }, results.rows);
                     });*/
               });
};