/**
 * CustomerController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * hiển thị màn hình index
     */
    index : function(req, res) {
        res.view('customer/customerIndex');
    },
    /**
     * hàm thực hiện load danh sách khách hàng theo người login. trả về html
     * table
     */
    /**
     * lấy danh sách khách hàng
     */
    actionLoadCustomer : function(req, res, next) {
        Customer.getCustomerList(req, res);
    },
    /**
     * xử lý lưu thông tin khách hàng
     */
    actionSaveAndInvoice : function(req, res) {
        var result = {};

        var formData = {
            phone_number : req.param('phoneNumber'),
            full_name : req.param('fullName'),
            address : req.param('address'),
            organization_id : req.session.user.organization_id,
        };
        var callbackAfterSaveOrUpdate = function(err, customer){
            if (err) {
                console.log(err)
                result.message = res.i18n("global.error");
                result.returnCode = Constants.COMMON.ERROR_CODE;
            } else {
                result.message = res.i18n('global.success');
                result.returnCode = Constants.COMMON.SUCCESS_CODE;
                if(typeof customer == "object") {
                    result.extraValue = customer.customer_id;
                } else {
                    result.extraValue = customer[0].customer_id;
                }
                result.callback = req.param('callback');
            }
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
        };

        var customerId = CommonUtils.NVL(req.param('customerId'), 0);
        if(customerId > 0) {
            Customer.findOne({
                customer_id: customerId
            }, function(err, customer) {
                if (err) {
                    console.log(err);
                } else if (customer) {
                    CommonUtils.havePermissionWithOrg(req, customer.organization_id, function(boolean) {
                        if(boolean) {
                            Customer.update({ customer_id : customerId }, formData)
                                    .exec(callbackAfterSaveOrUpdate);
                        } else {
                            res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                        }
                    })
                } else {
                    res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                }
            });
        } else {
            Customer.create(formData, callbackAfterSaveOrUpdate);
        }
    },
    /**
     * hàm thực hiện load form update customer
     */
    actionPrepareUpdate : function(req, res) {
        var result = {};
        var customerId = req.param('customerId');
        Customer.findOne({
            customer_id: customerId
        }, function(err, customer) {
            if (err) {
                console.log(err);
            } else if (customer) {
                CommonUtils.havePermissionWithOrg(req, customer.organization_id, function(boolean) {
                    if(boolean) {
                        res.view('customer/customerForm', {
                            'customer' : customer
                        });
                    } else {
                        res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                    }
                })
            }
        });
    },
    /**
     * hàm thực hiện xóa dữ liệu
     */
    actionDelete : function(req, res) {
        var result = {};
        var customerId = req.param('customerId');
        Customer.findOne({
            customer_id: customerId
        }, function(err, customer) {
            if (err) {
                console.log(err);
            } else if (customer) {
                CommonUtils.havePermissionWithOrg(req, customer.organization_id, function(boolean) {
                    if(boolean) {
                        Customer.destroy({
                            customer_id : customerId
                        }, function(err, ret) {
                            if (err) {
                                console.log(err);
                                result.message = res.i18n('global.error');
                                result.returnCode = Constants.COMMON.ERROR_CODE;
                            } else {
                                result.message = res.i18n('delete.succcess');
                                result.returnCode = Constants.COMMON.SUCCESS_CODE;
                            }
                            console.log(result)
                            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
                        });
                    } else {
                        res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                    }
                })
            }
        });
    },

}