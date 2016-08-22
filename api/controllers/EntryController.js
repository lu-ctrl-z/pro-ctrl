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
        // Store hash in your password DB.
        var $postUser = {
            user_name : req.param("user_name"),
            password : req.param("password"),
            repassword : req.param("repassword"),
            email : req.param("email"),
            tel : req.param("tel"),
            auth_type : 2, // default is admin,
        };
        var $postCompany = {
                comporation_name : req.param("comporation_name"),
                contact_address : req.param("contact_address"),
                contact_tel : req.param("contact_tel"),
                contact_email : req.param("contact_email"),
                logo : req.param("logo")
        };
        this._validateEntry(req, res, $postUser, $postCompany, function(ok, messages) {
            if(ok == true) {
                User.create($dataUser, function(err, user) {
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
    _validateEntry: function(req, res, $postUser, $postCompany, cb) {
        var asyn = {
                validateUser: false,
                validateCompany: false,
        };
        var next = function(callback) {
            var f = false;
            for(var k in asyn) {
                if(asyn[k] == false) {
                    return ;
                }
            }
            callback();
        };
        var $error = {};
        //check password match
        if ($postUser.password !== $postUser.repassword) {
            $error.repassword = res.i18n('user.password.notmatched');
        }

        var bcrypt = require('bcrypt-nodejs');
        var $password = $postUser.password;
        bcrypt.hash($password, null, null, function(err, hash) {
            if (err) {
                $error.dberror = res.i18n('DB Error!');
                asyn.validateUser = true;
                return next( function() {cb(false, {})} );
            }
            if ($password)
                $password = hash;
            User.validate($postUser, function(error) {
                asyn.validateUser = true;
                if (error) {
                    message.of('user', error.ValidationError,
                            res.i18n, $error);
                    return next( function() {cb(false, $error)} );
                } else {
                    return next( function() {cb(true, $error)} );
                }
            });
        });
        Comporation.validate($postCompany, function(error) {
            asyn.validateCompany = true;
            if (error) {
                message.of('comporation', error.ValidationError,
                        res.i18n, $error);
                return next( function() {cb(false, $error)} );
            } else {
                return next( function() {cb(true, $error)} );
            }
        });
    }
};
