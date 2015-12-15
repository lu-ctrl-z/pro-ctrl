module.exports = function authenticate (req, res, next) {
    res.locals.app = res.locals.app || {};
    var copyNext = function() {
        if(req.session.authenticated) {
            UserProject.getListProjectByUser(req.session.user.id, function(projectOfUser) {
                projectOfUser = projectOfUser || {};
                res.locals.app.prOfUser = projectOfUser;
                if(projectOfUser[0].project_id) {
                    req.session.user.currentProject = req.session.user.currentProject || projectOfUser[0].project_id.id
                }
                next();
            });
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