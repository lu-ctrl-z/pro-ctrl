/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    // connection: 'mysql',
    tableName: 't_task',
    autosubscribe: ['destroy', 'update', 'add', 'remove'],
    types: {
        ticket: function(ticket) {
            if(!ticket) 
                return true;

            return ticket.match(/#(\d+)/);
        }
    },
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        ticket_id: {
            type: 'ticket',
            required: true,
        },
        task_name: {
            type: 'string',
            required: true,
        },
        level: {
            type: 'integer',
            in: [1,2,3],
            defaultsTo: 1
        },
        status: {
            type: 'integer',
            in: [1,2,3,4,5,6],
            defaultsTo: 1
        },
        start_time: {
            type: 'datetime',
            required: false,
        },
        end_time: {
            type: 'datetime',
            required: false,
        },
        del_flg: {
            type: 'integer',
            in: [0,1],
            defaultsTo: 0
        },
        sprint_id: {
            model: 'sprint',
        },
        user_id: {
           model: 'user' 
        },
    },
    formAttr: {
        ticket_id: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        task_name: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        level: {
            form_type: sails.config.const.FORM_TYPE_RADIO,
            config_value: sails.config.common.taskLevel
        },
        status: {
            form_type: sails.config.const.FORM_TYPE_SELECT,
            config_value: sails.config.common.taskStatus
        },
        start_time: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        end_time: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        }
    },
    deleteTask: function(id, $user_id, cb) {
        this.destroy({id: id, user_id: $user_id}).exec(function(err, ret) {
            if(err || !ret) return cb(false);
            return cb(true);
        });
    },
    changeStatus: function($id, $status, $user_id, cb) {
        this.update({
            id : $id
        }, {status: $status}).exec(
                function(err, updated) {
                    if (err || !updated) {
                        return cb(false);
                    }
                    return cb(updated);
                });
    }
};