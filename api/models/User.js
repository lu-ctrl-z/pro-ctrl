/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    // connection: 'mysql',
    tableName: 'm_users',
    types: {
    },
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        user_name: {
            type: 'string',
            unique: true,
            required: true,
            maxLength: 45,
            minLength: 3,
        },
        password: {
            type: 'string',
            required: true
        },
        email: {
            type: 'email',
            required: true,
            unique: true,
            maxLength: 60,
            minLength: 4,
        },
        member_type: {
            required: true,
            in: [1,2,3,4,5,6],
            type: 'integer',
        },
        auth_type: {
            type: 'integer',
            required: false,
            in: [1,2],
        }
    },
    formAttr: {
        user_name: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        password: {
            form_type: sails.config.const.FORM_TYPE_PASSWORD
        },
        email: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        member_type: {
            config_value: sails.config.common.memberType,
            form_type: sails.config.const.FORM_TYPE_RADIO
        },
        auth_type: {
            config_value: sails.config.common.authType,
            form_type: sails.config.const.FORM_TYPE_RADIO
        }
    },
    getLoginAdmin: function($username, $password, cb) {
        this.findOne({
            or : [
                    { user_name: $username },
                    { email: $username }
                  ],
        }, function(err, usr) {
            if (err) {
                cb({flag: false, message: i18n('DB Error!')});
            } else if(usr) {
                var bcrypt = require('bcrypt-nodejs');
                var i = bcrypt.compare($password, usr.password, function(err, valid) {
                    if(err || !valid) {
                        cb({flag: false, message: 'Username or password in correct'});
                    } else {
                        cb({flag: true, message: 'OK!', user: usr});
                    }
                });
            } else {
                cb({flag: false, message: 'Username in correct'});
            }
        });
        return;
    },
};

