exports.logout = function (req, res) {
   req.logOut();
   req.flash('success_msg', "Logged out");
   res.redirect('/login');
}