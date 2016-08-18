/**
 * Project.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 't_user_comporation',
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        com_cd: {
            model: 'Comporation',
        },
        user_id: {
            model: 'User'
        }
    },
    formAttr: {
        id: {
            form_type: sails.config.const.FORM_TYPE_HIDDEN
        },
        project_name: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        project_description: {
            form_type: sails.config.const.FORM_TYPE_TEXTAREA
        }
    },
    //get all cửa hàng with number user working in project
    getListComporationByUser: function(user_id, cb) {
        this.find().populateAll().where({user_id: user_id}).exec(function(err, ret) {
            cb(ret);
        });
    },
};

