/**
 * MainController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function (req, res) {
        var cb = function() {
            res.view('index');
        };
        var $pid = req.param('pid');
        if($pid) {
            req.session.user.currentProject = $pid;
            var $aln = req.cookies[sails.config.common.auto_login_name];
            if($aln) {
                AutoLogin.setData($aln, {currentProject2: $pid}, cb);
            } else {
                cb();
            }
        } else {
            cb();
        }
    }
};

