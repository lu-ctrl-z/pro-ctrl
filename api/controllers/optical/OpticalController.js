/**
 * OpticalController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * hiển thị màn hình index
     */
    index : function(req, res) {
        res.view('optical/opticalIndex');
    },

}