/**
 * TaskController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getCreate: function (req, res) {
        var cb = function() {
            res.view('element/task/form');
        };
        cb();
    },
    postCreate: function(req, res) {
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
    }
}