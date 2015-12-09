/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    // connection: 'mysql',
    tableName : 't_auto_login',
    attributes : {
        id : {
            type : 'integer',
            autoIncrement : true,
            primaryKey : true
        },
        user_id : {
            type : 'integer',
            required : true,
            model : 'user'
        },
        token : {
            type : 'string',
            required : true,
            unique : true
        },
        expire : {
            type : 'datetime',
            required : true
        }
    },
    createAutoLogin : function($user_id, cb) {
        // generate Token autologin
        // check token is exited 6 times
        function generateToken(onSuccess, onError, maxRepeat) {
            require('crypto').randomBytes(16, function(ex, buf) {
                var $token = buf.toString('hex');
                AutoLogin.findOne({
                    token : $token
                }, function(err, record) {
                    if (err) {
                        onError(i18n('DB Error!'));
                    } else if (record && maxRepeat > 0) {
                        maxRepeat--;
                        generateToken(onSuccess, onError, maxRepeat);
                    } else {
                        onSuccess($token);
                    }
                });
            });
        }
        ;
        // doing generate token
        generateToken(function($token) {
            var $now = new Date();
            // befor destroy all data expired
            AutoLogin.destroy({
                user_id : $user_id,
                expire : {
                    '<=' : $now
                }
            }, function(err, ret) {
                if (err) {
                    console.log(err);
                } else {
                    // insert t_auto_login with expire date + 90days( see
                    // /config/common.js.auto_login_expire)
                    var $expire = new Date();
                    $expire.setDate($expire.getDate()
                            + sails.config.common.auto_login_expire);
                    AutoLogin.create({
                        user_id : $user_id,
                        token : $token,
                        expire : $expire
                    }, function(err, ret) {
                        if (err) {
                            console.log(err);
                        } else {
                            cb({token: $token, expire: $expire});
                        }
                    });
                }
            });
        }, function(message) {
            console.log(message);
        }, 6);
        return;
    },
    /**
     * login as auto login
     * @params $token => values of auto login name 
     * @params cd callback function
     */
    loginAsAutoLogin: function($token, cb) {
        var $now = new Date();
        AutoLogin.findOne({
            token : $token,
            expire : {
                '>=' : $now
            }
        }, function(err, record) {
            if (err) {
                cb(false);
            } else if (record) {
                var $user_id = record.user_id;
                User.findOne({
                    id: $user_id
                }, function(err, user) {
                    if (err) {
                        cb();
                    } else if(user) {
                        cb(user);
                    }
                });
            } else {
                cb(false);
            }
        });
    },
};
