
if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}

var data = require('../itemsList.json');
const {pool} = require('../DBconfig');

exports.view = function (request, response) {
   pool.query(`SELECT * FROM categories WHERE userid = $1`, [request.user.id], (err, results) => {
      if (err) {
         throw err;
      }
      console.log(results.rows);
      localStorage.setItem('userid', request.user.id);
      response.render('sections', {"sections" : results.rows});
   })
	//console.log(data);
	//response.render('sections', data);
};