/**
 * SysCatController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    actionSysCatIndex : function(req, res) {
        res.view('sysCat/sysCatIndex');
    }
};
