module.exports = function authdata (req, res, next) {

    if(req.session.authenticated) {
        req.session.user.data = req.session.user.data || {};
        var $pid = req.param('apid');
        var $sid = req.param('asid');
        if($pid) {
            var $aln = req.cookies[sails.config.common.auto_login_name];
            req.session.user.data.currentProject = $pid;
            if($sid) {
                req.session.user.data.currentSprint = $sid;
            }
            if($aln) {
                AutoLogin.setData($aln, req.session.user.data, next);
            } else {
                return next();
            }
        } else {
            return next();
        }
    } else {
        return next();
    }
};