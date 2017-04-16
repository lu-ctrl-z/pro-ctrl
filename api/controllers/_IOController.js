/**
 * IOController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    welcome: function(req, res) {
    },
    joinRoom: function(req, res) {
        if(req.isSocket != true || !req.session.user) return;

        var room = req.session.user.data.currentProject + '_' + req.session.user.data.currentSprint;
        sails.sockets.join(req.socket, room);
        res.json({
          message: 'Subscribed to a fun room !'
        });
    },
    deleteTask: function(req, res) {
        var $id = req.param('id');
        this.requiredLogin(req, res, function(ok) {
            if(!ok) return;
            if(req.isSocket != true || !req.session.user || !$id) return false;

            var room = req.session.user.data.currentProject + '_' + req.session.user.data.currentSprint;
            Task.deleteTask($id, req.session.user.id, function(ok) {
                if(ok == false) {
                    return res.json({
                        status: 'NG',
                        message: 'is error problem !'
                    });
                }
                sails.sockets.broadcast(room, 'taskDeleted', {id: $id});
                return res.json({
                    status: 'OK',
                    message: 'task deleted !'
                });
            });
        });
    },
    changeTask: function(req, res) {
        var $id = req.param('id');
        var $status = req.param('status');
        this.requiredLogin(req, res, function(ok) {
            if(!ok) return;
            if(req.isSocket != true || !$id || !$status) return false;

            var room = req.session.user.data.currentProject + '_' + req.session.user.data.currentSprint;
            Task.changeStatus($id, $status, req.session.user.id, function(task) {
                if(task == false) {
                    return res.json({
                        status: 'NG',
                        message: 'is error problem !'
                    });
                }
                task = task[0];
                sails.sockets.broadcast(room, 'taskChange', task);
                return res.json({
                    status: 'OK',
                    message: 'task changed !'
                });
            })
        })

    },
    /**
     * show task html from task data
     */
    showTask: function(req, res) {
        var task_id = req.param('id');
        if(!req.session.user || !task_id) return false;
        var app = {};
        var cb = function() {
            res.locals.task = app;
            res.render('element/task/task_note', function(err, html) {
                if(err) console.log(err);
                var ret = {
                        status: "OK",
                        message: "",
                        content: html,
                        updated: app
                    };
                return res.json(ret);
            });
        };
        Task.findOne({id: task_id}).populateAll().exec( function(err, task) {
            if(err || !task) return;
            var project = task.sprint_id.project_id;
            UserProject.findOne({project_id: project, user_id: req.session.user.id}, function(err, ret) {
                if(err || !ret) return false;
                Duration.find({task_id: task_id}).populate('user_id').exec(function(err, list) {
                    var $totalTime = 0;
                    var $totalName = [];
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
                        $totalName.push($taskDuration.user_id.user_name);
                    }
                    var arrayUnique = function(a) {
                        a = a || [];
                        return a.reduce(function(p, c) {
                            if (p.indexOf(c) < 0) p.push(c);
                            return p;
                        }, []);
                    };
                    if($totalName.length > 0) {
                        task.user_id.user_name = arrayUnique($totalName).join();
                    }
                    task.totalTime = $totalTime;
                    app = task;
                    return cb();
                });
            })
        })
    },
    requiredLogin: function(req, res, cb) {
        if(req.isSocket && ( !req.session.user || !req.session.user.data.currentProject || !req.session.user.data.currentSprint )) {
            var socketId = sails.sockets.id(req.socket);
            sails.sockets.emit(socketId, 'userLogin');
            return cb(false)
        } else {
            return cb(true);
        }
    }
};
