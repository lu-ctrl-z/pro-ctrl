/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    doLoginAdmin: function(req, res) {
        var $username = req.param("user_name");
        var $password = req.param("password");
        User.getLoginAdmin($username, $password, function($data) {
            if($data.flag == true) {
                req.session.authenticated = true;
                req.session.user = $data.user;
                return res.redirect('/admin/');
            } else {
                res.view('admin/login');
            }
        });
    },
};

