/**
 * EntryController
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
        this._validateEntry(req, res, $postUser, $postCompany, function(messages) {
            if(Object.keys(messages).length === 0) {
                try {
                    // Start the transaction
                    User.query("START TRANSACTION;", function(err) {
                        if (err) { throw new Error(err); }

                        var bcrypt = require('bcrypt-nodejs');
                        var $password = $postUser.password;
                        bcrypt.hash($password, null, null, function(err, hash) {
                            $postUser.password = hash;
                            User.create($postUser, function(err, user) {
                                if (err) {
                                    throw new Error(err);
                                } else {
                                    $postCompany.create_user = user.id;
                                    Comporation.create($postCompany, function(err, com) {
                                        if (err) {
                                            throw new Error(err);
                                        }
                                        User.update({
                                            id : user.id
                                        }, {com_cd: com.com_cd}).exec(function(err, updated) {
                                            if (err) {
                                                throw new Error(err);
                                            }
                                            UserComporation.create({com_cd: com.com_cd, user_id: user.id}, function(err, ins) {
                                                if (err) {
                                                    throw new Error(err);
                                                }
                                                User.query("COMMIT;");
                                                Comporation.query("COMMIT;");
                                                UserComporation.query("COMMIT;");
                                                res.redirect('/entry.thanks');
                                            })
                                        });
                                    });
                                }
                            });
                        });
                    });
                } catch(e) {
                    User.query("ROLLBACK;", function(err) {
                        // The rollback failed--Catastrophic error!
                        if(err){ console.log(err)}
                        console.log(e);
                        return res.serverError(e.message);
                    });
                }
            } else {
                res.view('entry/form', {
                    message : messages
                });
            };
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
                return next( function() {cb($error)} );
            }
            if ($password)
                $password = hash;
            User.validate($postUser, function(error) {
                asyn.validateUser = true;
                if (error) {
                    message.of('user', error.ValidationError,
                            res.i18n, $error);
                    return next( function() {cb($error)} );
                } else {
                    return next( function() {cb($error)} );
                }
            });
        });
        Comporation.validate($postCompany, function(error) {
            asyn.validateCompany = true;
            if (error) {
                message.of('comporation', error.ValidationError,
                        res.i18n, $error);
                return next( function() {cb($error)} );
            } else {
                return next( function() {cb($error)} );
            }
        });
    }
};
