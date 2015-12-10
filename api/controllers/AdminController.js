/**
 * MainController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
        var $q = req.param('q');
        var $cond = {};
        if ($q) {
            $cond = {
                or : [ {
                    user_name : {
                        'contains' : $q
                    }
                }, {
                    email : {
                        'contains' : $q
                    }
                } ]
            };
        }
        User.find($cond, function(err, ret) {
            if (err) {
                console.log(err);
            }
            res.view('admin/index', {
                AppData : ret
            });
        });
    },
    login : function(req, res) {
        if (req.session.authenticated && req.session.user['auth_type'] == 2) {
            res.redirect('/admin/');
            return;
        }
        var $next = req.param('next');
        res.view('admin/login', {
            next : $next
        });
    },
    userForm : function(req, res) {
        res.view('admin/user/form', {
        });
    },
    addUser: function(req, res){
        var $username = req.param("user_name");
        var $password = req.param("password");
        var $repassword = req.param("repassword");
        if($password !== $repassword) {
            res.view('admin/user/form', {
                message:res.i18n('user.password.notmatched')
            });
            return;
        }
        var $email = req.param("email");
        var $member_type = req.param("member_type");
        var $auth_type = req.param("auth_type");
        var bcrypt = require('bcrypt-nodejs');
        bcrypt.hash($password, null, null, function(err, hash) {
            if (err) {
                res.view('admin/user/form', {
                    message:res.i18n('DB Error!')
                });
                return;
            }
            if($password) $password = hash;
            // Store hash in your password DB.
            User.create({user_name: $username, password: $password, email: $email, member_type: $member_type, auth_type: $auth_type}, function(error, user) {
                if(error) {
                    
                    res.view('admin/user/form', {
                        message:res.i18n('DB Error!')
                    });
                } else {
                    res.view('admin/user/form', {
                        message:res.i18n('DB Error!')
                    });
                }
            });
        });
    },
};
