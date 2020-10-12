
if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}

const {pool} = require('../DBconfig');

exports.view = function (request, response) {
   pool.query(`SELECT * FROM categories WHERE userid = $1`, [request.user.groupid], (err, results) => {
      if (err) {
         throw err;
      }
      console.log(results.rows);
      console.log("Test here: ")
      console.log(request.user.groupid)
      console.log(request.user.id)
      localStorage.setItem('groupid', request.user.groupid);
      localStorage.setItem('userid', request.user.id);
      response.render('sections', {"sections" : results.rows});
   })
};