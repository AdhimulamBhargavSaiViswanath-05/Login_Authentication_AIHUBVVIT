module.exports = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isVerified) {
    return next();
  }
  res.redirect('/');
};