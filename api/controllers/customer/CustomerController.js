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
	getCustomerList: function(req, res) {
		Customer.getCustomerList(req, res, function(resultList) {
			res.view('customer/customerList', 
				{ 'resultList': resultList }
			);
		})
	},
}