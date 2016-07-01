/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 't_sprint',
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        project_id: {
            model: 'project',
        },
        sprint_number: {
            type: 'integer',
        },
        start_time: {
            type: 'date',
            required: true
        },
        end_time: {
            type: 'date',
            required: true,
        }
    },
    formAttr: {
        project_id: {
            form_type: sails.config.const.FORM_TYPE_SELECT
        },
        start_time: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        end_time: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        }
    },
    getMaxSprintByProject: function($pid, cb) {
        this.findOne({project_id: $pid}).max('sprint_number').exec(cb);
    },
    getListSprintByProject: function($pid, $limit, $offset, cb) {
        this.find({project_id: $pid}).sort('sprint_number DESC').limit($limit).skip($offset).exec(cb);
    }
};