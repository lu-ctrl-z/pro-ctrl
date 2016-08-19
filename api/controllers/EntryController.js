/**
 * UserController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * Hiển thị màn hình form nhập thông tin đăng ký
     */
    entryForm: function(req, res) {
        res.view('entry/form', {});
    },
    entryDone: function(req, res) {
        res.view('entry/done', {});
    },
    entryDo: function(req, res) {
        this._validateEntry(req, res, function(ok, messages) {
            if(ok == true) {
                User.create($dataInsert, function(err, user) {
                    if (err) {
                        var messages = message.of('user',
                                err.ValidationError, res.i18n);
                        res.view('entry/form', {
                            message : messages
                        });
                    } else {
                        res.redirect('/entry.thanks');
                    }
                });
            } else {
                res.view('entry/form', {
                    message : messages
                });
            }
        });
    },
    //validate thông tin user đăng ký
    //@return true: OK, false : NG and set error message
    _validateEntry: function(req, res, cb) {
        var $error = {};
        var $password = req.param("password");
        var $repassword = req.param("repassword");
        //check password match
        if ($password !== $repassword) {
            error.repassword = res.i18n('user.password.notmatched');
        }
        
        var $auth_type = 2; // default is admin
        var bcrypt = require('bcrypt-nodejs');
        bcrypt.hash($password, null, null, function(err, hash) {
            if (err) {
                error.dberror = res.i18n('DB Error!');
                cb(false, {});
                return;
            }
            if ($password)
                $password = hash;
            // Store hash in your password DB.
            var $dataInsert = {
                user_name : req.param("user_name"),
                password : $password,
                email : req.param("email"),
                tel : req.param("tel"),
                auth_type : $auth_type
            };
            User.validate($dataInsert, function(error) {
                if (error) {
                    var messages = message.of('user', error.ValidationError,
                            res.i18n);
                    cb(false, messages);
                } else {
                    cb(true, messages);
                }
            });
        });
    }
};
