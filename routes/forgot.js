const { pool } = require('../DBconfig');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.view = function (req, res) {

   res.render('forgot');
};

exports.forgotpw = function (req, res, next) {
   async.waterfall([
      function(done) {
         crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
         });
      },
      function(token, done) {
         var date = Date.now()+3600000;
         console.log(date);
         pool.query(`UPDATE users SET resetPWtoken = $1,
                                      resetPWexpires=$2
                     WHERE email = $3
                     RETURNING *`, [token, (date), req.body.email], (err, results) => {
                        if(err) {
                           throw err;
                        }
                        if (results.rows.length == 0) {
                           req.flash('error', 'No account with that email address exists.');
                           return res.redirect('/forgot');
                        }
                        done(err, token, results.rows[0]);
                     });
      },
      function(token, user, done) {
         var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
               user: 'zachan.codes@gmail.com',
               pass: process.env.GMAILPW
            }
         });
         var mailOptions = {
            to: user.email,
            from: 'zachan.codes@gmail.com',
            subject: 'APPNAME Password Reset',
            text: 'You can reset your password by clicking the link below:\n\n'+
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
         };
         smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'An email has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
         });
      }
   ], function(err) {
      if(err) return next(err);
      res.redirect('/forgot');
   });
}