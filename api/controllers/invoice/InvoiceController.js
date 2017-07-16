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

}