module.exports = function authenticate (req, res, next) {
    if (!req.session.authenticated && req.cookies[sails.config.common.auto_login_name]) {
        var $aln = req.cookies[sails.config.common.auto_login_name];
        AutoLogin.loginAsAutoLogin($aln, function(ret) {
            if(ret == false) {
                next();
            } else {
                req.session.authenticated = true;
                req.session.user = ret;
                next();
            }
        });
    } else {
        next();
    }
};