const LocalStrategy = require('passport-local').Strategy;
const {pool} = require('./DBconfig');
const bcrypt = require('bcrypt');

function initialize(passport) {
   const authenticateUser = (email, password, done) => {
      pool.query(`SELECT * FROM fridge WHERE emai = $1`, [email], (err, result)=>{
         if(err) {
            throw err;
         }
         console.log(result.rows);
         if(result.rows.length > 0) {
            const user = result.rows[0];

            bcrypt.compare(password, user.password, (err, isMatch)=>{
               if(err){
                  throw err;
               }

               if(isMatch) {
                  return done(null, user);
               } else {
                  return done(null, false, {message: "Password is incorrect"});
               }
            });
         } else {
            return done(null, false, {message: "Email is not registered"});
         }
      });
   }

   passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, authenticateUser));

   passport.serializeUser((user, done) => done)
   passport.deserializeUser((id, done) => done)
}

module.exports = initialize;