/**
 * MainController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function (req, res) {
        var data = {};
        var cb = function() {
            res.view('index', {data: data, error: data.error});
        };
        var arrayUnique = function(a) {
            a = a || [];
            return a.reduce(function(p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);
        };

        if(req.session.user.data && req.session.user.data.currentProject && req.session.user.data.currentSprint) {
            for(var i in res.locals.app.prOfUser) {
                var pro = res.locals.app.prOfUser[i].project_id;
                if(pro.id == req.session.user.data.currentProject) {
                    data.project_name = pro.project_name;
                    break;
                }
            }
            Sprint.findOne({
                project_id: req.session.user.data.currentProject, 
                sprint_number: req.session.user.data.currentSprint }, function(err, sprint) {
                if(err || !sprint) {
                    data.error = 'Không có sprint tương ứng.';
                    return cb();
                }
                $sprint_id = sprint.id;
                Task.find({sprint_id: $sprint_id}).populateAll().exec(function(err, listTask) {
                    if(err) {
                        return cb();
                    } else if( listTask.length <= 0 ){
                        //data.error = 'Chưa có task';
                        return cb();
                    }
                    var idsTask = [];
                    for(var i in listTask) {
                        idsTask.push(listTask[i].id);
                    }
                    Duration.find({task_id: idsTask}).populate('user_id').exec(function(err, list) {
                        var $totalTime = {};
                        var $totalName = {};
                        for(var j in list) {
                            var $taskDuration = list[j];
                            var tsk_id = $taskDuration.task_id;
                            if($taskDuration.end_time) {
                                var end = sails.moment($taskDuration.end_time);
                            } else {
                                var end = sails.moment(new Date());
                            }
                            var then = sails.moment($taskDuration.start_time);
                            var timer = sails.moment(end,"DD/MM/YYYY HH:mm:ss").diff(sails.moment(then,"DD/MM/YYYY HH:mm:ss"));
                            $totalTime[tsk_id] = $totalTime[tsk_id] || 0;
                            $totalTime[tsk_id] += timer;
                            $totalName[tsk_id] = $totalName[tsk_id] || [];
                            $totalName[tsk_id].push($taskDuration.user_id.user_name);
                        }
                        for(var i in listTask) {
                            var taskItem = listTask[i];
                            if($totalTime[taskItem.id]) {
                                listTask[i].totalTime = $totalTime[taskItem.id];
                            } else {
                                listTask[i].totalTime = 0;
                            }
                            if(typeof $totalName[taskItem.id] !== 'undefined' &&  $totalName[taskItem.id].length > 0) {
                                listTask[i].user_id.user_name = arrayUnique($totalName[taskItem.id]).join();
                            }
                        }
                        data.listTask = listTask;
                        data.totalTime = $totalTime;
                        return cb();
                    });
                });
            });
        } else {
            data.error = 'hãy chọn sprint.';
            return cb();
        }
    },
    sprintForm: function(req, res) {
        $pid = req.param('pid');
        $act = req.param('act');
        if($act == "cancel") {
            return res.render('element/sprint/form', {act: $act}, function(err, html) {
                if(err) console.log(err);
                res.json(200, {
                    status: "OK",
                    message: "",
                    content: html
                });
            });
        }
        var onError = function() {
            res.json(403, {
                status: "NG",
                message: "Forbidden!"
            });
        };
        var onSuccess = function(data) {
            data.message = false;
            data.act = '';
            res.render('element/sprint/form', data, function(err, html) {
                if(err) return onError();
                res.json(200, {
                    status: "OK",
                    message: "",
                    content: html
                });
            })
        };
        var check = false;
        var project_name = '';
        var nextSprintNumber = 1;
        var check = this.permissionProject(req, res, $pid);
        if(check == false) {
            return onError();
        }
        project_name = check;
        Sprint.getMaxSprintByProject($pid, function(err, ret) {
            if(err) {
                onError();
            } else {
                if(ret.sprint_number) nextSprintNumber = ret.sprint_number + 1;
                onSuccess({layout: null, pid: $pid, pname: project_name, nextNumber: nextSprintNumber, act: $act});
            }
        });
    },
    permissionProject: function(req, res, $pid) {
        var check = false;
        if(res.locals.app && res.locals.app.prOfUser) {
            for(var i in res.locals.app.prOfUser) {
                var pro = res.locals.app.prOfUser[i];
                if(pro.project_id.id == $pid) {
                    check = true;
                    project_name = pro.project_id.project_name;
                    break;
                }
            }
        }
        return check ? project_name: check;
    },
    sprintDo: function(req, res) {
        var $dataInsert = {
            project_id: req.param('pid'),
            sprint_number: req.param('nextNumber'),
            start_time: req.param('start_time'),
            end_time: req.param('end_time')
        };

        var check = this.permissionProject(req, res, req.param('pid'));
        if(check == false) {
            return res.json(403, {
                status: "NG",
                message: "Forbidden!"
            });
        }

        var getData = function(cb) {
            if(req.session.user.data.currentProject) {
                Sprint.getListSprintByProject(req.session.user.data.currentProject, sails.config.common.limit_print, 0, function(err, sprint) {
                    if(sprint.length) {
                        res.locals.app.sprOfUser = sprint;
                        req.session.user.data.currentSprint = req.session.user.data.currentSprint || sprint[0].sprint_number;
                    }
                    cb();
                });
            } else {
                cb();
            }
        };
        var project_name = check;
        var onError = function(messages) {
            getData(function() {
                var locals = $dataInsert;
                locals.pid =  $dataInsert.project_id;
                locals.nextNumber =  $dataInsert.sprint_number;
                locals.message = messages;
                locals.act = '';
                locals.pname = project_name;
                res.render('element/sprint/form', locals, function(err, html) {
                    if(err) {
                        console.log(err);
                        res.json(403, {
                            status: "NG",
                            message: "Forbidden!"
                        });
                    } else {
                        res.json(200, {
                                status: "OK",
                                message: messages,
                                content: html});
                    }
                });
            })
        };
        var onSuccess = function(data) {
            getData(function() {
                data.act = 'cancel';
                data.pname = project_name;
                data.pid = req.param('pid');
                data.message = null;
                res.render('element/sprint/form', data, function(err, html) {
                    if(err) return onError();
                    res.json(200, {
                        status: "OK",
                        message: "",
                        content: html
                    });
                })
            });
        };
        Sprint.validate($dataInsert, function(err) {
            if (err) {
                var messages = message.of('sprint', err.ValidationError,
                        res.i18n);
                onError(messages);
            } else {
                var startDate = new Date($dataInsert.start_time);
                var endDate = new Date($dataInsert.end_time);
                if(endDate <= startDate) {
                    return onError(res.i18n('sprint.end_time.required'));
                }
                Sprint.getMaxSprintByProject($dataInsert.project_id, function(err, ret) {
                    if(err) onError();
                    else {
                        var nextSprintNumber = 1;
                        if(ret.sprint_number) nextSprintNumber = ret.sprint_number + 1;
                        if(nextSprintNumber != $dataInsert.sprint_number) {
                            onError('Sprint has created!.');
                        } else {
                            Sprint.create($dataInsert, function(err, ret) {
                                if(err) {
                                    var messages = message.of('sprint', err.ValidationError,
                                            res.i18n);
                                    onError(messages);
                                } else {
                                    onSuccess({layout: null, nextNumber: nextSprintNumber});
                                }
                            })
                        }
                    }
                })
            }
        });
    }
};

