module.exports = function authenticate (req, res, next) {
    if (!req.session.authenticated && req.cookies[CONFIG.common.auto_login_name]) {
        var $aln = req.cookies[CONFIG.common.auto_login_name];
        AutoLogin.loginAsAutoLogin($aln, function(ret) {
            if(ret == false) {
                return next();
            } else {
                req.session.authenticated = true;
                req.session.user = ret;
                var data = AutoLogin.getData($aln, function(data) {
                    req.session.user.data = data;
                    return next();
                });
            }
        });
    } else {
        return next();
    }
};