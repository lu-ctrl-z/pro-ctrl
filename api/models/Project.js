/**
 * Project.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    // connection: 'mysql',
    tableName: 'm_project',
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        project_name: {
            type: 'string',
            required: true,
            form_type: sails.config.const.FORM_TYPE_TEXT,
            name: 'project.project_name'
        },
        project_description: {
            type: 'string',
            required: true
        },
        create_user: {
            type: 'integer',
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
    //get all project with number user working in project
    getListProject: function(cb) {
        
    },
};

