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
        var $tel = req.param("tel");
        var $member_type = req.param("member_type");
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
                tel : $tel,
                member_type : 2,
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
    //Project index
    projectIndex: function(req, res) {
        var $q = req.param('q');
        var $cond = {};
        if ($q) {
            $cond = {
                or : [ {
                    project_name : {
                        'contains' : $q
                    }
                }, {
                    project_description : {
                        'contains' : $q
                    }
                } ]
            };
        }
        Project.find($cond).populate('userproject').exec(function(err, ret) {
            if (err) {
                res.view('admin/project/form', {
                    message : res.i18n('DB Error!')
                });
            } else {
                var cb = function(n_ret) {
                    res.view('admin/project/index', {
                        AppData : ret,
                        AppUser: n_ret
                    });
                };
                var ids = [];
                for(var i in ret) {
                    if(ret[i].userproject.length) {
                        var userproject = ret[i].userproject;
                        delete userproject.add;
                        delete userproject.remove;
                        for(u in userproject) {
                            ids.push(userproject[u].user_id);
                        }
                    }
                }
                User.find({id: ids }).exec(function(err, user) {
                    var newUser = {};
                    for(u in user) {
                        newUser[user[u].id] = user[u];
                    }
                    cb(newUser);
                });
            }
        });
    },
    //projectEdit
    projectEdit: function(req, res) {
        var $pid = req.param('pid');
        Project.findOne({id: $pid}).populate('userproject').exec(function(err, ret) {
            if (err) {
                res.view('admin/project/edit', {
                    message : res.i18n('DB Error!')
                });
            } else if(ret){
                var ids = [];
                if(ret.userproject.length) {
                    var userproject = ret.userproject;
                    delete userproject.add;
                    delete userproject.remove;
                    for(u in userproject) {
                        ids.push(userproject[u].user_id);
                    }
                }
                var cb = function(n_ret) {
                    var $uname = req.param('uname');
                    var $cond = {};
                    if ($uname) {
                        $cond = {
                            or : [ {
                                user_name : {
                                    'contains' : $uname
                                }
                            }, {
                                email : {
                                    'contains' : $uname
                                }
                            } ]
                        };
                        User.find($cond, function(err, retUser) {
                            if (err) {
                                console.log(err);
                            }
                            for(var i in retUser) {
                                if(n_ret[retUser[i].id]) {
                                    delete retUser[i];
                                }
                            }
                            res.view('admin/project/edit', {
                                AppData : ret,
                                AppUser: n_ret,
                                AppUserSearch: retUser
                            });
                        });
                    } else {
                        res.view('admin/project/edit', {
                            AppData : ret,
                            AppUser: n_ret,
                        });
                    }
                };
                User.find({id: ids }).exec(function(err, user) {
                    var newUser = {};
                    for(u in user) {
                        newUser[user[u].id] = user[u];
                    }
                    cb(newUser);
                });
            } else {
                res.view('admin/project/edit', {
                    message: res.i18n('DB Error!')
                });
            }
        });
    },
    //projectAdd
    projectAdd: function(req, res) {
        res.view('admin/project/form', {
        });
    },
    //projectAdd
    projectAddDo: function(req, res) {
        var $dataInsert = {
            project_name: req.param('project_name'),
            project_description: req.param('project_description'),
            create_user: req.session.user.id
        };
        Project.validate($dataInsert, function(error) {
            if (error) {
                var messages = message.of('project', error.ValidationError,
                        res.i18n);
                res.view('admin/project/form', {
                    message : messages
                });
            } else {
                Project.create($dataInsert, function(err, project) {
                    if (err) {
                        var messages = message.of('project',
                                err.ValidationError, res.i18n);
                        res.view('admin/project/form', {
                            message : messages
                        });
                    } else {
                        res.redirect('/admin/project/');
                    }
                });
            }
        });
    },
    //projectEdit
    projectEditDo: function(req, res) {
        var $pid = req.param('pid');
        var $projectEdit = {
                project_name : req.param('project_name'),
                project_description : req.param('project_description'),
            };
        Project.findOne({id: $pid}, function(err, ret) {
            if(err) {
                var messages = message.of('project',
                        err.ValidationError, res.i18n);
                res.view('admin/project/edit', {
                    message : messages
                });
            } else if(ret) {
                Project.update({id: $pid}, $projectEdit).exec(function(err, ret) {
                    if(err) {
                        var messages = message.of('project',
                                err.ValidationError, res.i18n);
                        res.view('admin/project/edit', {
                            message : messages
                        });
                    } else {
                        res.redirect('/admin/project/');
                    }
                });
            } else {
                res.redirect('/admin/project/');
            }
        });
    },
    projectUserModify: function(req, res) {
        var $pid = req.param('pid');
        var $uid = req.param('uid');
        var $mode = req.param('mode');
        if($mode == 'add') {
            UserProject.findOne({project_id: $pid, user_id:  $uid}).exec(function(err, ret) {
                if(err) {
                    res.redirect('/admin/project/edit/?pid=' + $pid);
                } else if(ret){
                    res.redirect('/admin/project/edit/?pid=' + $pid);
                } else {
                    UserProject.create({project_id: $pid, user_id:  $uid}).exec(function(err, ret) {
                        res.redirect('/admin/project/edit/?pid=' + $pid);
                    });
                }
            });
        } else if($mode == 'delete') {
            UserProject.destroy({project_id: $pid, user_id:  $uid}).exec(function(err, ret) {
                if(err) {
                    res.redirect('/admin/project/edit/?pid=' + $pid);
                } else {
                    res.redirect('/admin/project/edit/?pid=' + $pid);
                }
            });
        } else {
            res.redirect('/admin/project/');
        }
    }
};
