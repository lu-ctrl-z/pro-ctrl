/**
 * CustomerController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
        res.view('customer/customerIndex');
    },
    /**
     * hàm thực hiện load danh sách khách hàng theo người login. trả về html
     * table
     */
    getCustomerList : function(req, res) {
        Customer.getCustomerList(req, res, function(resultList) {
            res.view('customer/customerList', {
                'resultList' : resultList
            });
        })
    },
    saveAndInvoice : function(req, res) {
        var result = {};
        result.callback = "callbackAfterSaveAndInvoice";
        var formData = {
            phone_number : req.param('phoneNumber'),
            full_name : req.param('fullName'),
            address : req.param('address'),
            organization_id : req.session.user.organization_id,
        };
        Customer.create(formData, function(err, customer) {
            if (err) {
                var messages = message.of('customer', err.ValidationError, res.i18n);
                console.log(messages);
                result.message = res.i18n("global.error");
                result.returnCode = Constants.COMMON.ERROR_CODE;
            } else {
                result.message = res.i18n('global.success');
                result.returnCode = Constants.COMMON.SUCCESS_CODE;
            }
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
        });
    },

}