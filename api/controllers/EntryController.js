/**
 * UserController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * Hiển thị màn hình form nhập thông tin đăng ký
     */
    newentryForm: function(req, res) {
        res.view('entry/form', {});
    }
};
