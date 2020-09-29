const {pool} = require('../DBconfig');

exports.view = function (request, response) {
   var id = localStorage.getItem('groupid');
   pool.query(`SELECT * FROM shoppingLists
               INNER JOIN users ON shoppingLists.userid=users.id
               WHERE groupid=$1`, [id], (err, results)=>{
                  if (err) {
                     throw err;
                  }
                  console.log(results.rows);
                  var members = [];
                  for(var i = 0; i < results.rows.length; i++) {
                     members.push(results.rows[i].name);
                  }
                  Array.prototype.contains = function(v) {
                     for (var i = 0; i < this.length; i++) {
                        if (this[i] === v) return true;
                     }
                     return false;
                  };

                  Array.prototype.unique = function() {
                     var arr = [];
                     for (var i = 0; i < this.length; i++) {
                        if (!arr.contains(this[i])) {
                           arr.push(this[i]);
                        }
                     }
                     return arr;
                  }
                  members = members.unique();
                  var lists = {"lists": []};
                  for(var i = 0; i < members.length; i++) {
                     var list = {
                        "name": members[i],
                        "items": []
                     }
                     for(var j = 0; j < results.rows.length; j++) {
                        if(results.rows[j].name == members[i]){
                           list.items.push(results.rows[j]);
                        }
                     }
                     lists.lists.push(list);
                  }
                  console.log(lists);
                  response.render('shoppingList', lists);
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

exports.addToList = function (request, response) {
   var id = localStorage.getItem('userid');
   var itemName = request.body.itemName;
   console.log(id);
   console.log(itemName);
   pool.query(`INSERT INTO shoppingLists (userid, itemname, checked)
               VALUES($1, $2, FALSE)`, [id, itemName], (err, results) => {
                  if(err){
                     throw err;
                  }
                  response.redirect('/shoppingList');
               })
}