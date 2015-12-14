/**
 * Project.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    // connection: 'mysql',
    tableName: 't_user_project',
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        project_id: {
            model: 'project'
        },
        user_id: {
            model: 'user'
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
};

