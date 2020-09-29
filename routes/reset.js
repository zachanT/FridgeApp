const { pool } = require('../DBconfig');
const async = require('async');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}

exports.view = function (req, res) {
   pool.query(`SELECT resetpwexpires FROM users WHERE resetpwtoken = $1`, [req.params.token], (err, results) => {
      if(err){
         throw err;
      }
      if(results.rows.length == 0 || results.rows[0].resetpwexpires <= Date.now()){
         req.flash('error', 'Password reset token is invalid or has expired.');
         return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
   });
};

exports.resetpw = async function (req, res) {
   var hashedPW = await bcrypt.hash(req.body.password, 10);
   async.waterfall([
      function(done) {
         pool.query(`SELECT * FROM users WHERE resetpwtoken = $1`, [req.params.token], (err, results) => {
            if(err){
               throw err;
            }
            if(results.rows.length == 0 || results.rows[0].resetpwexpires <= Date.now()){
               req.flash('error', 'Password reset token is invalid or has expired.');
               return res.redirect('back');
            }
            if(req.body.password === req.body.cpassword) {
               pool.query(`UPDATE users SET password = $1, resetpwtoken = NULL, resetpwexpires = NULL WHERE id = $2 RETURNING *`, [hashedPW, results.rows[0].id], (err, results) => {
                  if(err){
                     throw err;
                  }
                  done(err, results.rows[0]);
               });
            }else{
               req.flash("error", "Passwords do not match.");
               return res.redirect('back');
            }
         });
      },
      function(user, done){
         var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
               user: 'mathewchang12345@gmail.com',
               pass: process.env.GMAILPW
            }
         });
         var mailOptions = {
            to: user.email,
            from: 'mathewchang12345@gmail.com',
            subject: 'Your password has been changed',
            text: 'Your password has resently been changed, if this is a mistake update your password here: \n\n' +
                  'http://' + req.headers.host + '/forgot'
         };
         smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success_msg', 'Your password has been updated.');
            done(err);
         });
      }
   ], function(err) {
      res.redirect('/');
   });
}