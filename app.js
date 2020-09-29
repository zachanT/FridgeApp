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
const cors = require('cors');
const crypto = require('crypto');
const webpush = require('web-push');

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

//Variables
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var addSection = require('./routes/addSection');
var items = require('./routes/items');
var addCategory = require('./routes/addCategory')
var group = require('./routes/group');
var addMember = require('./routes/addMember');
var shoppingList = require('./routes/shoppingList');
var sections = require('./routes/section');
var addToList = require('./routes/addToList');
var forgot = require('./routes/forgot');
var reset = require('./routes/reset');
var publicVapidKeys = 'BO2WyM2viPQsPp8cwRS7ulL7ANw07BQpsYkD_cLpmUPxYS2QPZW6Ilb-RDCiQLUM0josK97O8MlLDRwFj3LW89E';
var privateVapidKeys = 'BwHuUOcOmVYN5u4qSzVGPSozwOqUhar05nkB65LSLGs';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKeys, privateVapidKeys);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.methodOverride());
app.use(express.cookieParser('secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', checkNotAuthenticated, sections.view);
app.get('/addSection', checkNotAuthenticated, addSection.addSection);
app.get('/items', checkNotAuthenticated, items.view);
app.post('/addCategory', items.addCategory);
app.get('/group', checkNotAuthenticated, group.view);
app.get('/addMember', addMember.addMember);
app.get('/shoppingList', checkNotAuthenticated, shoppingList.view);
app.get('/login', checkAuthenticated, login.view);
app.get('/register', checkAuthenticated, register.view);
app.get('/addToList', addToList.addToList);
app.get('/logout', logout.logout);
app.get('/forgot', forgot.view);
app.get('/reset/:token', reset.view);

app.post('/items', items.view);
app.post('/addItem', items.addItem);
app.post('/group', group.invite);
app.post('/', checkNotAuthenticated, addSection.addSection);
app.post('/shoppingList', shoppingList.addToList);
app.post('/forgot', forgot.forgotpw);
app.post('/reset/:token', reset.resetpw);
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
app.post('/subscribe', (req, res) => {
   const subscription = req.body;
   localStorage.setItem('subscription', JSON.stringify(req.body));
   res.status(201).json({});
   /*const payload = JSON.stringify({ title : ('Push test ')});
   console.log(subscription.endpoint);
   webpush.sendNotification(subscription, payload).catch(err => console.error(err));*/
});

app.post('/login', passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
}), function(req, res){
   console.log(req.user);
});

//Update tables
/*app.put('/items/:id', async(req, res) => {
   const {id} = req.params;
   pool.query(`UPDATE items SET columnstoupdate = $1
               WHERE itemid=$2`, [stuff, id], (err, results) = {
      if(err) {
         throw err;
      }

   })
})*/
app.post('/invited', group.respond);

//Delete from tables
app.delete('/items', async (req, res) => {
   let result = {};
   try {
      console.log("DELETE");
      var id = req.body.id;
      console.log(id);

      result.success = await deleteItem(id);
      
   } catch(e) {
      result.success = false;
   } finally {
      res.setHeader("content-type", "application/json")
      res.send(JSON.stringify(result))
      //res.redirect('/items');
   }
  
})

/*app.delete('/items/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const deleted = await pool.query(`DELETE FROM items WHERE itemid=$1`, [id]);
      
   } catch (err) {
      console.log(err.message);
   }
})*/

app.delete('/shoppingList', async (req, res) => {
   let result = {};
   try {
      console.log("DELETE");
      var id = req.body.id;
      console.log(id);

      result.success = await deleteListItem(id);
      
   } catch(e) {
      result.success = false;
   } finally {
      res.setHeader("content-type", "application/json")
      res.send(JSON.stringify(result))
   }
})

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

function deleteItem(id) {
   pool.query(`DELETE FROM items WHERE itemid=$1`, [id], (err, results) => {
      if(err) {
         throw err;
         return false;
      }
      return true;
   })
}

function deleteListItem(id) {
   pool.query(`DELETE FROM shoppinglists WHERE listid=$1`, [id], (err, results) => {
      if(err) {
         throw err;
         return false;
      }
      return true;
   })
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});