/**
 * ProductAdminController
 * 
 * @description :: Server-side logic for managing users
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
        var $q = req.param('q');
        var $cond = {};
        if ($q) {
            $cond = {
                or : [ {
                    product_name : {
                        'contains' : $q
                    }
                } ]
            };
        }
        User.find($cond, function(err, ret) {
            if (err) {
                console.log(err);
            }
            res.view('product/index', {
                AppData : ret,
                pagger: {total: 300, current: req.param('page') || 1, limit: req.param('limit') || 10}
            });
        });
    },
    //hiển thị màn hình nhập kho
    importProduct: function(req, res) {
        var asysn = {
                cat: false,
                product: false,
        };
        res.view('product/import', { });
    },
    // hiển thị form thêm categories bằng popup
    saveCategory: function(req, res) {
        res.view('product/jaddcat', { });
    }
};
