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
    actionIndexPage : function(req, res) {
        res.view('optical/opticalIndex');
    },
    /**
     * hiển thị màn hình index
     */
    actionLoadListOpticalType : function(req, res) {
        var callback = function(returnData) {
            res.json(returnData);
        };
        SysCatType.getListByParentId(req, Constants.SYS_CAT_TYPE.SYS_CAT_TYPE_OPTICAL, callback);
    },
    

}