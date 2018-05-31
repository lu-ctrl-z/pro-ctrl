/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
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
        },
        data: {
            type: 'string',
            required: false
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
                    } else {
                        cb(user);
                    }
                });
            } else {
                cb(false);
            }
        });
    },
    /**
     * disable autologin 
     */
    disableAutoLogin: function($token, cb) {
        AutoLogin.destroy({token: $token}, function(err, ret) {
            cb();
        });
    },
    setData: function($cookie, $value, cb) {
        if(!$cookie) cb();
        this.findOne({token: $cookie}, function(err, ret) {
            if(err || !ret) {
                return cb();
            }
            var $data = ret.data;
            var update = function(data) {
                try {
                    data = JSON.stringify(data);
                }  catch(e) {}
                finally{
                    AutoLogin.update({token: $cookie}, {data: data}).exec(function(err, ret) {
                        return cb();
                    });
                }
            };
            if($data) {
                try {
                    $data = JSON.parse($data);
                    for(var i in $value) {
                        $data[i] = $value[i];
                    }
                } catch(e) {}
                finally{
                    update($data);
                }
            } else {
                $data = $value;
                update($data);
            }
        });
    },
    getData: function($cookie, cb) {
        if(!$cookie) return;
        this.findOne({token: $cookie}, function(err, ret) {
            if(err || !ret) cb();
            var $data = ret.data;
            if(!$data) {
                cb()
            } else {
                try {
                    $data = JSON.parse($data);
                    if($data) cb($data)
                    else cb();
                } catch(e) {
                    cb();
                }
            }
        });
    },
    removeData: function($cookie, name, cb) {
        if(!$cookie) return;
        this.findOne({token: $cookie}, function(err, ret) {
            if(err || !ret) cb();
            var $data = ret.data;
            if(!$data) {
                cb()
            } else {
                try {
                    $data = JSON.parse($data);
                    if($data[name]) {
                        delete $data[name];
                        var update = function(data) {
                            try {
                                data = JSON.stringify(data);
                            }  catch(e) {}
                            finally{
                                AutoLogin.update({token: $cookie}, {data: data}).exec(function(err, ret) {
                                    cb();
                                });
                            }
                        };
                        update($data);
                    }
                    else cb();
                } catch(e) {
                    cb();
                }
            }
        });
    }
    
};
