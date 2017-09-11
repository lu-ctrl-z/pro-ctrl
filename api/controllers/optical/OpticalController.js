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
    /**
     * Xử lý lưu thông tin syscattype
     */
    actionProcessSave : function(req, res) {
        var formData = {
                name: req.param('name'),
                organizationId: req.session.user.organizationId,
                parentId: Constants.SYS_CAT_TYPE.SYS_CAT_TYPE_OPTICAL,
        };
        var callback = function(returnData) {
            res.json(returnData);
        };
        SysCatType.create(formData, function(err, sysCatType) {
            if(err) {
                console.log(err);
                var result = {};
                result.message = res.i18n("global.error");
                result.returnCode = Constants.COMMON.ERROR_CODE;
                res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
            } else {
                var result = {};
                result.message = res.i18n('global.success');
                result.returnCode = Constants.COMMON.SUCCESS_CODE;
                result.callback = req.param('callback');
                result.returnData = JSON.stringify(sysCatType);
                res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
            }
        });
    },
    /**
     * lấy thông tin detail
     */
    actionLoadDetail: function(req, res) {
        SysCatType.loadSysCatList(req, res);
    },
    /**
     * lấy thông tin màn hình searh
     */
    actionPrepareSearch: function(req, res) {
        var sysCatTypeId = CommonUtils.getParameterLong(req, "sysCatTypeId");
        SysCatType.findOne({sysCatTypeId: sysCatTypeId}).exec(function(err, sysCatTypeBO) {
            if(err) {
                console.log(err);
            }
            res.view('optical/opticalForm', {
                'sysCatTypeBO' : sysCatTypeBO
            });
        });
    }

}