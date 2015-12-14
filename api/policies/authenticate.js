module.exports = function authenticate (req, res, next) {
    var copyNext = function() {
        if(req.session.authenticated) {
            Project.getListProjectByUser(req.session.user.id, next)
        } else {
            next();
        }
    }
    if (!req.session.authenticated && req.cookies[sails.config.common.auto_login_name]) {
        var $aln = req.cookies[sails.config.common.auto_login_name];
        AutoLogin.loginAsAutoLogin($aln, function(ret) {
            if(ret == false) {
                copyNext();
            } else {
                req.session.authenticated = true;
                req.session.user = ret;
                copyNext();
            }
        });
    } else {
        copyNext();
    }
};