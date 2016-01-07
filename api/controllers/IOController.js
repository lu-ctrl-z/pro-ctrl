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
    },
    changeTask: function(req, res) {
        var $id = req.param('id');
        var $status = req.param('status');
        if(req.isSocket != true || !req.session.user || !$id || !$status) return false;

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
    }
};
