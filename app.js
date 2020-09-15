/**
 working tutorials: https://youtu.be/-RCnNyD0L-s?t=1512
 https://youtu.be/vxu1RrR0vbw?t=1221
 Start: 1:58:48

 Option 1: Keep trying to figure out how to send section id to know what was clicked
 Option 2: Have seperate routes for different sections and only have a FIXED number of sections (Fridge, Freezer, Pantry)
 Option 3: No sections, all items in one spot.

/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');
var express = require('express');
var handlebars = require('express3-handlebars');
var app = express();
const {pool} = require('./DBconfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}

require("dotenv").config();

const initializePassport = require('./passportConfig');
initializePassport(passport);

app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var addSection = require('./routes/addSection');
var items = require('./routes/items');
var addItem = require('./routes/addItem');
var deleteItem = require('./routes/deleteItem');
var addCategory = require('./routes/addCategory')
var group = require('./routes/group');
var addMember = require('./routes/addMember');
var shoppingList = require('./routes/shoppingList');
var sections = require('./routes/section');
var addToList = require('./routes/addToList');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', checkNotAuthenticated, sections.view);
app.get('/addSection', checkNotAuthenticated, addSection.addSection);
app.get('/items', checkNotAuthenticated, items.view);
app.get('/deleteItem', deleteItem.deleteItem);
app.post('/addCategory', items.addCategory);
app.get('/group', checkNotAuthenticated, group.view);
app.get('/addMember', addMember.addMember);
app.get('/shoppingList', checkNotAuthenticated, shoppingList.view);
app.get('/login', checkAuthenticated, login.view);
app.get('/register', checkAuthenticated, register.view);
app.get('/addToList', addToList.addToList);
app.get('/logout', logout.logout);

app.post('/Fridge', items.fridge);
app.post('/Freezer', items.freezer);
app.post('/Pantry', items.pantry);
app.post('/items', items.view);
app.post('/addItem', items.addItem);
app.post('/', checkNotAuthenticated, addSection.addSection);
app.post('/register', async (req, res) => {
   let { name, email, password, cpassword} = req.body;

   console.log(name, email, password, cpassword);

   let errors = [];
   
   if(!name || !email || !password || !cpassword) {
      errors.push({message: "Please enter all fields"});
   }

   if(password.length < 6){
      errors.push({message: "Password is too short!"});
   }

   if(password != cpassword){
      errors.push({message: "Passwords don't match!"});
   }

   if(errors.length > 0) {
      res.render('register', {errors});
   } else {
      let hashedPW = await bcrypt.hash(password, 10);
      
      pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result)=>{
         if(err){
            throw err;
         }
         
         if(result.rows.length > 0) {
            errors.push({message: "Email already registered!"});
            res.render('register', {errors});
         } else {
            pool.query(
               `INSERT INTO users (name, email, password)
               VALUES($1, $2, $3)
               RETURNING id, password`, [name, email, hashedPW], (err, results)=>{
                  if(err){
                     throw err;
                  }
                  console.log(results.rows[0]);
                  console.log(results.rows[0].id);
                  pool.query(`INSERT INTO categories (userid, name, parentid)
                              VALUES($1,'Fridge',0),
                                    ($1,'Freezer',0),
                                    ($1,'Pantry',0)`, [results.rows[0].id], (err, results)=>{
                                       if(err){
                                          throw err;
                                       }

                                    })
                  req.flash('success_msg', "Account Registered");
                  res.redirect('/login');
               }
           )
         }
      })
   }
});

app.post('/login', passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
}), function(req, res){
   console.log(req.user);
});

/*var i = 0;
var retrieved = localStorage.getItem('ids');
var ids = JSON.parse(retrieved);
console.log(ids);
for(var key in ids){
   app.post(('/'+key), (req,res) => {
      pool.query(`SELECT * FROM categories 
               FULL OUTER JOIN items ON categories.id=items.id
               WHERE id=$1`, [key], (err, results)=>{
                  if(err){
                     throw err;
                  }
                  console.log(localStorage.getItem('id'));
                  console.log(results.rows);
                  response.render('items', {"items": results.rows});
               })
   })
}
/*for(i = 0; i < ids.length; i++){
   app.post(('/'+ids[i]), (req,res) => {
      pool.query(`SELECT * FROM categories 
               FULL OUTER JOIN items ON categories.id=items.id
               WHERE id=$1`, [ids[i]], (err, results)=>{
                  if(err){
                     throw err;
                  }
                  console.log(localStorage.getItem('id'));
                  console.log(results.rows);
                  response.render('items', {"items": results.rows});
               })
   })
}*/

function checkAuthenticated(req, res, next){
   if(req.isAuthenticated()) {
      return res.redirect('/');
   }
   next();
}

function checkNotAuthenticated(req, res, next){
   if(req.isAuthenticated()) {
      return next();
   }
   res.redirect('/login');
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});