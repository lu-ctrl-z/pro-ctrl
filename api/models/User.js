/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    //connection: 'mysql',
    tableName: 'm_users',
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
            type: 'string',
            required: true,
            unique: true,
            maxLength: 60,
            minLength: 4
        },
        member_type: {
            type: 'integer',
            required: true,
            in: [1,2,3,4,5,6]
        },
        auth_type: {
            type: 'integer',
            required: false,
            defaultsTo: 1
        }
    },
};

