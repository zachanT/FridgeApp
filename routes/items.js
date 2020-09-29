if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}

const schedule = require('node-schedule');
const {pool} = require('../DBconfig');
const webpush = require('web-push');

exports.view = function (request, response) {
   console.log("view");
   var userid = localStorage.getItem('userid');
   var groupid = localStorage.getItem('groupid');
   let {id} = request.body;
   if(id){
      localStorage.setItem('sectid', id);
   } else {
      id = localStorage.getItem('sectid');
   }
   console.log(request.body);
   console.log(id); //name, id, category, itemname, expiration, notification, quantity, units, shared
   pool.query(`SELECT * FROM categories 
               FULL OUTER JOIN items ON categories.id=items.catid
               WHERE userid=$1
               AND categories.parentid=$2`, [groupid, id], (err, results)=>{  //ORDER BY expiration ASC;
                  if(err){
                     throw err;
                  }
                  console.log(results.rows);
                  var categories = [];
                  for(var i = 0; i < results.rows.length; i++) {
                     categories.push(results.rows[i].name);
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
                  categories = categories.unique();
                  console.log(categories);
                  var allItems = {"allItems": []};
                  for (i = 0; i < categories.length; i++) {
                     var category = {
                        "name": categories[i],
                        "items": []
                     }
                     for (var j = 0; j < results.rows.length; j++) {
                        if (results.rows[j].name == categories[i]) {
                           category.items.push(results.rows[j]);
                        }
                     }
                     allItems.allItems.push(category);
                  }
                  console.log(allItems);
                  response.render('items', allItems);
               })

}

exports.addItem = function (req, res) {
   console.log("adding item");
   let { itemName, category, expiration, notification, shared } = req.body;
   var section = localStorage.getItem('section');
   pool.query(`INSERT INTO items (catid, itemname, expiration, notification, shared)
               VALUES ($1, $2, $3, $4, $5)`, 
               [category, itemName, expiration, notification, shared], (err, results)=>{
                  if(err){
                     throw err;
                  }
                  var sub = JSON.parse( localStorage.getItem('subscription'));
                  var date = new Date(notification);
                  var j = schedule.scheduleJob(date, function(){
                     const payload = JSON.stringify({ title : (itemName + ' expires on ' + expiration)});
                     webpush.sendNotification(sub, payload).catch(err => console.error(err))
                  });
                  res.redirect('/items');
               })
}

exports.addCategory = function (req, res) {
   let { catName } = req.body;
   console.log(catName);
   pool.query(`INSERT INTO categories (userid, name, parentid, category)
               VALUES ($1, $2, $3, TRUE)`, 
               [localStorage.getItem('id'), catName, localStorage.getItem('section')], (err, results)=>{
                  if(err){
                     throw err;
                  }
                  res.redirect('/items');
               })
}