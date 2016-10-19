module.exports = function authenticate (req, res, next) {
    res.locals.app = res.locals.app || {};
    var copyNext = function() {
        if(req.session.authenticated) {
            req.session.user.data = req.session.user.data || {};
            UserComporation.getListComporationByUser(req.session.user.id, function(comOfUser) {
                comOfUser = comOfUser || {};
                res.locals.app.comOfUser = comOfUser;
                if(comOfUser[0] && comOfUser[0].com_cd) {
                    req.session.user.currentCom = req.session.user.currentCom || comOfUser[0].com_cd;
                }
                //thông tin common syscat
                //res.locals.app["OPTIC_C_CYCL"] = sails.config.Constrants.OPTIC_C_CYCL;
                //res.locals.app["OPTIC_L_CYCL"] = sails.config.Constrants.OPTIC_L_CYCL;
                return next();
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