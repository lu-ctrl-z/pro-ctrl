module.exports = function authenticate (req, res, next) {
    res.locals.app = res.locals.app || {};
    var copyNext = function() {
        if(req.session.authenticated) {
            UserProject.getListProjectByUser(req.session.user.id, function(projectOfUser) {
                projectOfUser = projectOfUser || {};
                res.locals.app.prOfUser = projectOfUser;
                if(projectOfUser[0].project_id) {
                    req.session.user.data.currentProject = req.session.user.data.currentProject || projectOfUser[0].project_id.id
                }
                if(req.session.user.data.currentProject) {
                    Sprint.getListSprintByProject(req.session.user.data.currentProject, function(err, sprint) {
                        res.locals.app.sprOfUser = sprint;
                        req.session.user.data.currentSprint = req.session.user.data.currentSprint || sprint[0].sprint_number;
                        return next();
                    });
                } else {
                    return next();
                }
            });
        } else {
            return next();
        }
    };

    if (!req.session.authenticated && req.cookies[sails.config.common.auto_login_name]) {
        var $aln = req.cookies[sails.config.common.auto_login_name];
        AutoLogin.loginAsAutoLogin($aln, function(ret) {
            if(ret == false) {
                copyNext();
            } else {
                req.session.authenticated = true;
                req.session.user = ret;
                var data = AutoLogin.getData($aln, function(data) {
                    req.session.user.data = data;
                    copyNext();
                });
            }
        });
    } else {
        copyNext();
    }
};