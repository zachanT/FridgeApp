/**
 working tutorials: https://youtu.be/-RCnNyD0L-s?t=1512
 https://youtu.be/vxu1RrR0vbw?t=1221


/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
const bcrypt = require('bcrypt');
const {pool} = require('./DBconfig');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passportConfig');
initializePassport(passport);

var login = require('./routes/login');
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

var app = express();

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

app.use(flash());
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', sections.view);
app.get('/addSection', addSection.addSection);
app.get('/items', items.view);
app.get('/addItem', addItem.addItem);
app.get('/deleteItem', deleteItem.deleteItem);
app.get('/addCategory', addCategory.addCategory);
app.get('/group', group.view);
app.get('/addMember', addMember.addMember);
app.get('/shoppingList', shoppingList.view);
app.get('/login', login.view);
app.get('/register', register.view);
app.get('/addToList', addToList.addToList);

app.post('/register', (req, res) => {

})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});