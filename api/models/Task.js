/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
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
        duration: {
           collection: 'duration',
           via: 'task_id'
        }
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
            if(err || ret.length==0) return cb(false);
            return cb(true);
        });
    },
    changeStatus: function($id, $status, $user_id, cb) {
        this.findOne({id: $id}, function(err, task) {
            if (err || task.length==0) {
                return cb(false);
            }
            if($status == task.status) return cb(false);
            if($status == 2 || $status == 4) {
                if(task.status == 2 || task.status == 4) {
                    Duration.update({
                        task_id: $id,
                        end_time: null,
                        user_id: $user_id,
                        status: task.status
                    }, {
                        end_time: Date()
                    }).exec(function(err, updated) {
                        
                    })
                }
                Duration.create({
                    task_id: $id, start_time: Date(), user_id: $user_id, status: $status
                }).exec(function(err, duration) {
                    if (err || !duration) {
                        return cb(false);
                    }
                    var TaskUpdate = {
                        status: $status
                    };
                    if(task.start_time == null) {
                        TaskUpdate.start_time = Date()
                    }
                    Task.update({
                        id : $id
                    }, TaskUpdate).exec(
                            function(err, updated) {
                                if (err || !updated.length) {
                                    return cb(false);
                                }
                                return cb(updated);
                            });
                });
            } else {
                Duration.update({
                    task_id: $id,
                    end_time: null,
                    user_id: $user_id,
                    status: task.status
                }, {
                    end_time: Date()
                }).exec(function(err, updated) {
                    if (err) {
                        return cb(false);
                    }
                    var TaskUpdate = { status: $status };
                    if($status == 5) {
                        TaskUpdate.end_time = Date()
                    }
                    Task.update({
                        id : $id
                    }, TaskUpdate).exec(
                            function(err, updated) {
                                if (err || !updated.length) {
                                    return cb(false);
                                }
                                return cb(updated);
                            });
                });
            }
        })
    }
};