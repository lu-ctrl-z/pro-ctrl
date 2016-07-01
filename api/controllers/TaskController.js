/**
 * TaskController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getCreate: function(req, res) {
        return res.render('element/task/form', function(err, html) {
            if(err) console.log(err);
            res.json(200, {
                status: "OK",
                message: "",
                content: html
            });
        });
    },
    postCreate: function(req, res) {
        var $this = this;
        var app = {message: {}};
        var cb = function() {
            res.locals.message = app.message;
            res.locals.data = app;
            res.render('element/task/form', function(err, html) {
                if(err) console.log(err);
                res.json(200, {
                    status: "OK",
                    message: "",
                    content: html
                });
            })
        };
        var startTime = null;
        var endTime = null;

        if(req.param('start_time')) {
            startTime = new Date(req.param('start_time') + ' ' + req.param('shh') + ':' + req.param('smm'));
            if(startTime instanceof Date && !isNaN(startTime.valueOf())) {} else {
                app.message['task.start_time.invalid'] = res.i18n('task.start_time.invalid');
                startTime = null;
            }
        }
        if(req.param('end_time')) {
            endTime = new Date(req.param('end_time') + ' ' + req.param('ehh') + ':' + req.param('emm'));
            if(endTime instanceof Date && !isNaN(endTime.valueOf())) {} else {
                app.message['task.end_time.invalid'] = res.i18n('task.end_time.invalid');
                endTime = null;
            }
        }
        if(startTime && endTime && (startTime >= endTime)) {
            app.message['task.end_time.invalid'] = res.i18n('task.end_time.invalid')
        }
        var insertData = {
              ticket_id: req.param('ticket_id'),
              task_name: req.param('task_name'),
              level: req.param('level') || 1,
              status: req.param('status') || 1,
              start_time: startTime,
              end_time: endTime,
              sprint_id: req.param('sid'),
              user_id: req.session.user.id
        }
        this.checkPermission(req.param('pid'), req.param('sid'), req.session.user.id, function(ok) {
            if(ok == false) {
                app.message['permission'] = 'Permission denined.';
                return cb()
            }
            insertData.sprint_id = ok;
            Task.validate(insertData, function(err) {
                if (err) {
                    var messages = message.of('task', err.ValidationError,
                            res.i18n, app.message);
                    app.message = messages;
                    return cb();
                }
                if(Object.keys(app.message).length > 0) {
                    return cb();
                }
                Task.create(insertData, function(err, created) {
                    if (err) {
                        var messages = message.of('task', err.ValidationError,
                                res.i18n, app.message);
                        app.message = messages;
                        return cb();
                    }
                    //notification room task has created
                    var roomName = req.param('pid') + '_' + req.param('sid');
                    $this.showTask(res, roomName, created);
                    app.success = true;
                    return cb();
                });
            })
        });
    },
    checkPermission: function($pid, $sid, $uid, cb) {
        Sprint.findOne({project_id: $pid, sprint_number: $sid}, function(err, sprint) {
            if(err || !sprint) return cb(false);
            var $id = sprint.id;
            UserProject.findOne({project_id: $pid, user_id: $uid}, function(err, userProject) {
                if(err || !userProject) return cb(false);
                return cb($id);
            });
        });
    },
    //for socket
    /**
     * show task html from task data
     */
    showTask: function(res, roomName, task) {
        var task_id = task.id;
        var app = {};
        var cb = function() {
            res.locals.task = app;
            res.render('element/task/task_note', function(err, html) {
                if(err) console.log(err);
                var ret = {
                        status: "OK",
                        message: "",
                        content: html,
                        created: task
                    };
                sails.sockets.broadcast(roomName, 'taskCreated', ret);
            });
        };
        Task.findOne({id: task_id}).populateAll().exec( function(err, task) {
            if(err || !task) return;
            Duration.find({task_id: task.id}).exec(function(err, list) {
                var $totalTime = 0;
                for(var j in list) {
                    var $taskDuration = list[j];
                    if($taskDuration.end_time) {
                        var end = sails.moment($taskDuration.end_time);
                    } else {
                        var end = sails.moment(new Date());
                    }
                    var then = sails.moment($taskDuration.start_time);
                    var timer = sails.moment(end,"DD/MM/YYYY HH:mm:ss").diff(sails.moment(then,"DD/MM/YYYY HH:mm:ss"));
                    $totalTime += timer;
                }
                task.totalTime = $totalTime;
                app = task;
                return cb();
            });
        })
    },
    getEdit: function(req, res) {
        var $this = this;
        var app = {message: {}};
        var cb = function() {
            res.locals.message = app.message;
            res.locals.data = app;
            res.render('element/task/form_edit', function(err, html) {
                if(err) console.log(err);
                res.json(200, {
                    status: "OK",
                    message: "",
                    content: html
                });
            });
        };

        this.checkPermission(req.param('pid'), req.param('sid'), req.session.user.id, function(ok) {
            if(ok == false) {
                app.message['permission'] = 'Permission denined.';
                return cb()
            }

            Task.findOne({id: req.param('id')}).populateAll().exec( function(err, task) {
                if(err || !task) return;
                app = task;
                cb();
            })
        });
    },
    showDuration: function(req, res) {
        var $id = req.param('id');
        Duration.find({task_id: $id}).populate('user_id').exec(function(err, list) {
            res.locals.list = list;
            res.render('element/task/detail_task', function(err, html) {
                if(err) console.log(err);
                res.json(200, {
                    status: "OK",
                    message: "",
                    content: html
                });
            });
        });
    }
}