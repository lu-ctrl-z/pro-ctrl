/**
 * AdminController
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
        res.view('admin/user/form', {});
    },
    userFormEdit : function(req, res) {
        var $user_id = req.param('uid');
        if ($user_id) {
            User.findOne({
                id : $user_id
            }, function(err, user) {
                if (err) {
                    res.view('admin/user/edit', {
                        message : res.i18n('DB Error!')
                    });
                } else if (user) {
                    res.view('admin/user/edit', {
                        user : user
                    });
                } else {
                    res.redirect('/admin/');
                }
            });
        } else {
            res.redirect('/admin/');
        }
    },
    addUser : function(req, res) {
        var $username = req.param("user_name");
        var $password = req.param("password");
        var $repassword = req.param("repassword");
        if ($password !== $repassword) {
            res.view('admin/user/form', {
                message : res.i18n('user.password.notmatched')
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
                    message : res.i18n('DB Error!')
                });
                return;
            }
            if ($password)
                $password = hash;
            // Store hash in your password DB.
            var $dataInsert = {
                user_name : $username,
                password : $password,
                email : $email,
                member_type : $member_type,
                auth_type : $auth_type
            };
            User.validate($dataInsert, function(error) {
                if (error) {
                    var messages = message.of('user', error.ValidationError,
                            res.i18n);
                    res.view('admin/user/form', {
                        message : messages
                    });
                } else {
                    User.create($dataInsert, function(err, user) {
                        if (err) {
                            var messages = message.of('user',
                                    err.ValidationError, res.i18n);
                            res.view('admin/user/form', {
                                message : messages
                            });
                        } else {
                            res.redirect('/admin/user/');
                        }
                    });
                }
            });
        });
    },
    userEdit : function(req, res) {
        var $user_id = req.param('uid');
        var $userEdit = {
            user_name : req.param('user_name'),
            email : req.param('email'),
            member_type : req.param('member_type'),
            auth_type : req.param('auth_type'),
        };
        var canDelete = req.param('delete') == req.param('_csrf');
        if ($user_id) {
            User.findOne({
                id : $user_id
            }, function(err, user) {
                if (err) {
                    res.view('admin/user/edit', {
                        message : res.i18n('DB Error!'),
                        user : $userEdit
                    });
                } else if (user) {
                    if (canDelete) {
                        User.destroy({
                            id : $user_id
                        }, function(err, ret) {
                            if (err) {
                                var messages = message.of('user',
                                        err.ValidationError, res.i18n);
                                res.view('admin/user/edit', {
                                    message : messages,
                                    user : $userEdit
                                });
                            } else {
                                res.redirect('/admin/user/');
                            }
                        });
                    } else {
                        User.update({
                            id : $user_id
                        }, $userEdit).exec(
                                function(err, updated) {
                                    if (err) {
                                        var messages = message.of('user',
                                                err.ValidationError, res.i18n);
                                        res.view('admin/user/edit', {
                                            message : messages,
                                            user : $userEdit
                                        });
                                    } else {
                                        res.redirect('/admin/user/');
                                    }
                                });
                    }
                }
                ;
            });
        } else {
            res.view('admin/user/edit', {
                message : res.i18n('DB Error!'),
                user : null
            });
        }
    },
    
};
