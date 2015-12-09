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
        User.getLoginAdmin($username, $password, function($data) {
            if ($data.flag == true) {
                req.session.authenticated = true;
                req.session.user = $data.user;
                //#########################
                var redirect = function() {
                    if ($data.user.auth_type == 2)
                        return res.redirect('/admin/');
                    else
                        return res.redirect('/');
                }
                AutoLogin.createAutoLogin($data.user.id, function($tokenData) {
                    if($tokenData.token) {
                        var now = new Date();
                        var $maxAge = $tokenData.expire.getTime() - now.getTime();
                        res.cookie(sails.config.common.auto_login_name, $tokenData.token, { maxAge: $maxAge});
                    }
                    return redirect();
                });
                //#########################
            } else {
                res.view('admin/login', {
                    message : res.i18n($data.message)
                });
            }
        });
    },
};
