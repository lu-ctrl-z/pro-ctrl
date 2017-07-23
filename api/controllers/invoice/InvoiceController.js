/**
 * InvoiceController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * hàm thực hiện load form them moi / update don hang
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
                        var siteTitle = res.i18n("invoice.name") + " " + customer.full_name;
                        var orgId = req.session.user.organization_id;
                        Organization.findOne({
                            organizationId: orgId
                        }, function(err, organization) {
                            if (err) {
                                console.log(err);
                            } else if (organization) {
                                res.view('invoice/invoiceForm', {
                                    'customer' : customer,
                                    'organization' : organization,
                                    'siteTitle' : siteTitle
                                });
                            }
                        });
                    } else {
                        res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                    }
                });
            }
        });
    },
    /**
     * hàm thực hiện lưu thông tin đơn hàng
     */
    actionProcessUpdate: function(req, res) {
        var customerForm = req.param('customer');
        var formDataUpdate = {
                totalPrice: req.param('totalPrice'),
                trueTotalPrice: req.param('trueTotalPrice'),
                dataOptical: JSON.stringify(req.param('dataOptical')),
                cartList: JSON.stringify(req.param('cartList')),
                note: req.param('note'),
                totalDiscount: req.param('totalDiscount'),
        };
        var formDataInsert = {
                totalPrice: req.param('totalPrice'),
                trueTotalPrice: req.param('trueTotalPrice'),
                totalDiscount: req.param('totalDiscount'),
                dataOptical: JSON.stringify(req.param('dataOptical')),
                cartList: JSON.stringify(req.param('cartList')),
                note: req.param('note'),
                customerId: customerForm.customer_id,
        };
        var callbackAfterSaveOrUpdate = function(err, invoice){
            var result = {};
            if (err) {
                result.message = res.i18n("global.error");
                result.returnCode = Constants.COMMON.ERROR_CODE;
            } else {
                result.message = res.i18n('global.success');
                result.returnCode = Constants.COMMON.SUCCESS_CODE;
                result.extraValue = invoice.invoiceId;
                result.callback = req.param('callback');
            }
            res.view(Constants.PAGE_FORWARD.SAVE_RESULT, result);
        };

        var invoiceId = CommonUtils.NVL(req.param('invoiceId'), 0);
        if(invoiceId > 0) {
            Invoice.findOne({
                invoiceId: invoiceId
            }, function(err, invoice) {
                if (err) {
                    console.log(err);
                } else if (invoice) {
                    Customer.findOne({customer_id: invoice.customerId}, function(err, customer) {
                        if (err) {
                            console.log(err);
                        } else if(customer) {
                            CommonUtils.havePermissionWithOrg(req, customer.organization_id, function(boolean) {
                                if(boolean) {
                                    Invoice.update({ invoiceId: invoiceId }, formDataUpdate)
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
                    res.view(Constants.PAGE_FORWARD.INVALID_PERMISSION);
                }
            });
        } else {
            console.log(formDataInsert);
            Invoice.create(formDataInsert, callbackAfterSaveOrUpdate);
        }
    }

}