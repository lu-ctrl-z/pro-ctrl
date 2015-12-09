/**
 * MainController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
        res.view('admin/index');
    },
    login : function(req, res) {
        if (req.session.authenticated && req.session.user['auth_type'] == 2) {
            res.redirect('/admin/');
            return;
        }
        res.view('admin/login');
    },
};
