if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}

const {pool} = require('../DBconfig');

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
                  response.render('items', {"items" : results.rows});
               })
}

exports.fridge = function (request, response) {
   console.log("reaches here!!");
   var userid = localStorage.getItem('id');
   console.log(userid);
   var id = (userid-1)*3+1;
   console.log(id);
   localStorage.setItem('section', id);
   pool.query(`SELECT * FROM categories 
               FULL OUTER JOIN items ON categories.id=items.id
               WHERE userid=$1
               AND categories.id=$2`, [userid, id], (err, results)=>{
      if(err){
         throw err;
      }
      console.log(results.rows);
      response.render('items', {"items": results.rows});
   })

   /*console.log(data);
   //data['Sections'][0]['categories'][1]['items'].push(test);
   response.render('items', data);*/
}

exports.freezer = function (request, response) {
   console.log("reaches here!!");
   var userid = localStorage.getItem('id');
   console.log(userid);
   var id = (userid-1)*3+2;
   console.log(id);
   localStorage.setItem('section', id);
   pool.query(`SELECT * FROM categories 
               FULL OUTER JOIN items ON categories.id=items.id
               WHERE userid=$1
               AND categories.id=$2`, [userid, id], (err, results)=>{
      if(err){
         throw err;
      }
      console.log(results.rows);
      response.render('items', {"items": results.rows});
   })
}

exports.pantry = function (request, response) {
   console.log("reaches here!!");
   var userid = localStorage.getItem('id');
   console.log(userid);
   var id = (userid-1)*3+3;
   console.log(id);
   localStorage.setItem('section', id);
   pool.query(`SELECT * FROM categories 
               FULL OUTER JOIN items ON categories.id=items.id
               WHERE userid=$1
               AND categories.id=$2`, [userid, id], (err, results)=>{
      if(err){
         throw err;
      }
      console.log(results.rows);
      response.render('items', {"items": results.rows});
   })
}

exports.addItem = function (req, res) {
   console.log("adding item");
   let { itemName, category, expiration, notification, shared } = req.body;
   var section = localStorage.getItem('section');
   console.log(section)
   console.log(req.body);
   console.log(req.body.category)
   console.log(itemName, category, expiration, notification);
   pool.query(`INSERT INTO items (catid, itemname, expiration, notification, shared)
               VALUES ($1, $2, $3, $4, $5)`, 
               [category, itemName, expiration, notification, shared], (err, results)=>{
                  if(err){
                     throw err;
                  }
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

exports.viewAlt = function (request, response) {
	data['viewAlt'] = true;
	response.render('items', data);
}