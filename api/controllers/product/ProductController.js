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
        var showList = function(notify) {
            Categories.find({com_cd: req.session.user.currentCom.com_cd}, {select: ['cat_id', 'cat_name']}).exec(function(err, lst) {
                res.locals.list = lst;
                if(notify) {
                    sails.sockets.broadcast(req.session.user.currentCom.com_cd, 'catChanged', lst);
                }
                res.render('product/jaddcat', function(err, html) {
                    if(err) console.log(err);
                    res.json(200, {
                        status: sails.config.const.STATUS_OK,
                        message: "",
                        content: html
                    });
                });
            })
        };

        if(req.param('act') == 'crt' && req.param('catname') != '') {
            //insert cat
            Categories.create({cat_name: req.param('catname'), com_cd: req.session.user.currentCom.com_cd})
                      .exec(function(err, created) {
                          if (err) {
                              res.json(200, {
                                  status: sails.config.const.STATUS_NG,
                                  message: "DB Error!",
                                  content: ""
                              });
                          } else {
                              res.locals.Created = created.cat_id;
                              res.locals.Close = true;
                              showList(true);
                          }
                      })
        } else {
            showList();
        }
    },
    getCat: function(req, res) {
        Categories.find({com_cd: req.session.user.currentCom.com_cd}, {select: ['cat_id', 'cat_name']}).exec(function(err, lst) {
            if(err) console.log(err);
            res.json(200, {
                status: sails.config.const.STATUS_OK,
                message: "",
                content: lst
            });
        });
    },
};
