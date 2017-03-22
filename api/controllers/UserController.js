/**
 * UserController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    doLoginAdmin : function(req, res) {
        var $username = req.param("user_name");
        var $password = req.param("password");
        var $loginPre = req.param("rememberme");
        var $next = req.param("next");
        User.getLoginAdmin($username, $password, function($data) {
            if ($data.flag == true) {
                req.session.authenticated = true;
                req.session.user = $data.user;
                //#########################
                var redirect = function() {
                    if ($data.user.auth_type == 2 && !$next)
                        return res.redirect('/product/import');
                    else
                        return res.redirect($next);
                }
                if($loginPre) {
                    AutoLogin.createAutoLogin($data.user.id, function($tokenData) {
                        if($tokenData.token) {
                            var now = new Date();
                            var $maxAge = $tokenData.expire.getTime() - now.getTime();
                            res.cookie(sails.config.common.auto_login_name, $tokenData.token, { maxAge: $maxAge});
                        }
                        return redirect();
                    });
                } else {
                    return redirect();
                }
                //#########################
            } else {
                res.view('admin/login', {
                    message : res.i18n($data.message),
                    next: $next
                });
            }
        });
    },
    doLogout: function(req, res) {
        var $token = req.cookies[sails.config.common.auto_login_name];
        var doLogout = function() {
            req.session.destroy();
            res.cookie(sails.config.common.auto_login_name, $token, { maxAge: -1});
            return res.redirect('/');
        };
        if($token) {
            AutoLogin.disableAutoLogin($token, doLogout);
        } else {
            doLogout();
        }
    },
};
