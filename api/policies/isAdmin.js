module.exports = function isAdmin (req, res, next) {
    if (req.session.authenticated && req.session.user['auth_type'] == 2) {
        return next();
    } else {
        return res.redirect('/login');
    }
};