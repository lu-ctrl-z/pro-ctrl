/**
 * CustomerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function (req, res) {
		res.view('customer/customerIndex');
	},
	/**
	 * hàm thực hiện load danh sách khách hàng theo người login.
	 * trả về html table 
	 */
	getCustomerList: function(req, res) {
		Customer.getCustomerList(req, res, function(resultList) {
			res.view('customer/customerList', 
				{ 'resultList': resultList }
			);
		})
	},
	saveAndInvoice: function(req, res) {
		var result = {};
		result.returnCode = sails.config.const.COMMON.SUCCESS_CODE;
		result.message = "Lưu thông tin thành công";
		result.callback = "callbackAfterSave";
		result.extraValue = "1";
		console.log(result);
		res.view(sails.config.const.PAGE_FORWARD.SAVE_RESULT, result);
	},
	
}