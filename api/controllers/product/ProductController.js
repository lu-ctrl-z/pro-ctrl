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
        Product.find($cond, function(err, ret) {
            if (err) {
                console.log(err);
            }
            res.view('product/index', {
                AppData : ret,
                pagger: {total: ret.length, current: req.param('page') || 1, limit: req.param('limit') || 10}
            });
        });
    },
    //hiển thị màn hình nhập kho
    importProduct: function(req, res, catId) {
        var kindId = sails.config.Constants.OPTIC_KIND;
        var com_cd = req.session.user.currentCom.com_cd;
        SysCat.getByType(kindId, com_cd, function(err, data) {
            if(err) {
                console.log(err);
            }
            res.view('product/import', { sysCatClass : data, catId: catId});
        });
    },
    //hiển thị màn hình nhập kho mat can
    importMatCan: function(req, res) {
        var catId = 1; // Mắt cận
        this.importProduct(req, res, catId);
    },
    //hiển thị màn hình nhập kho mat can
    saveImportMatCan: function(req, res) {
        var id = req.param('id');
        if( id && id > 0 ) {
            Product.findOne({com_cd: com_cd, id: id})
            .exec(function(err, product) {
                if (err) { 
                    throw new Error(err);
                }
                if(product) {
                    OpticClass.find({product_id: product.id})
                }
            })
        } else {
            Product.addMatCan(req, res, function(ok) {
                if(!ok) {
                    res.json(200, {
                        status: sails.config.const.STATUS_NG,
                        message: "Có lỗi xẩy ra",
                        content: ""
                    });
                } else {
                    res.json(200, {
                        status: sails.config.const.STATUS_OK,
                        message: "Thêm mới mắt kính thành công",
                        content: ""
                    });
                }
            })
        }
        //var catId = 1; // Mắt cận
        //this.importProduct(req, res, catId);
    },
    pullMatCan : function(req, res) {
        OpticClass.getListMatCan(req, res,function(data) {
                res.json(data);
        });
    },
    // hiển thị form thêm categories bằng popup
    saveCategory: function(req, res) {
        var showList = function(notify) {
            SysCat.find({com_cd: req.session.user.currentCom.com_cd, is_system: false}, {select: ['id', 'name']}).exec(function(err, lst) {
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
            Categories.create({name: req.param('catname'), com_cd: req.session.user.currentCom.com_cd,
                sys_cat_type: req.param('catType') })
                      .exec(function(err, created) {
                          if (err) {
                              res.json(200, {
                                  status: sails.config.const.STATUS_NG,
                                  message: "DB Error!",
                                  content: ""
                              });
                          } else {
                              res.locals.Created = created.id;
                              res.locals.Close = true;
                              showList(true);
                          }
                      })
        } else if( req.param('act') == 'edt' && req.param('ecatname') != '' && req.param('eid') != '' ) {
            //Update cat
            Categories.update({cat_id: req.param('eid')}, {cat_name: req.param('ecatname')})
                      .exec(function(err, updated) {
                          if (err) {
                              res.json(200, {
                                  status: sails.config.const.STATUS_NG,
                                  message: "DB Error!",
                                  content: ""
                              });
                          } else {
                              res.locals.Created = req.param('eid');
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
    getBarcode: function(req, res) {
        Product.getMaxBarcodeByComCD(req.session.user.currentCom.com_cd, function(err, data) {
            if(err) console.log(err);
            var code = 100000;
            if(data && data.barcode && (data.barcode.toString().indexOf(req.session.user.currentCom.com_cd) === 0) ) {
                code = data.barcode.toString().replace(req.session.user.currentCom.com_cd, '');
            }
            res.json(200, {
                status: sails.config.const.STATUS_OK,
                message: "",
                content: code
            });
        });
    },
    _validate: function(req, res, cb) {
        var data = req.param('import');
        var com_cd = req.session.user.currentCom.com_cd;
        if(! (data && data.length > 0) ) {
            res.locals.message.noDataPost = res.i18n('global.empty');
            return cb(false);
        }
        Product.find( { com_cd : com_cd, delete_flg : 0 },
                      { select: ['id', 'quantity'] }
                , function(err, listProduct) {
                if (err) {
                    res.locals.message.empty = res.i18n('global.error');
                    return cb(false);
                } else {
                    var lstProductIds = [];
                    for(var j in listProduct) {
                        lstProductIds.push(listProduct[j].id);
                    }
                    for(var i in data) {
                        var productItem = data[i];
                        if(productItem.id && !Util.in_array(productItem.id, lstProductIds)) {
                            res.locals.message.noPermision = res.i18n('global.noPermision');
                            return cb(false);
                        }
                    }
                    res.locals.App.listProduct = listProduct;
                    res.locals.App.lstProductIds = lstProductIds;
                    return cb(true, listProduct);
                }
        });
        //return cb(true);
    },
    importProductDo: function(req, res) {
       res.locals.message = res.locals.App = {};
       function renderView() {
           res.render('product/importForm', function(err, html) {
               if(err) console.log(err);
               res.json(200, {
                   status: sails.config.const.STATUS_OK,
                   message: "",
                   content: html
               });
           });
       }
       try {
           this._validate(req, res, function(ok) {
               if(ok) {
                   var data = req.param('import');
                   var com_cd = req.session.user.currentCom.com_cd;
                   var user_id = req.session.user.id;
                   Product.getMaxBarcodeByComCD(com_cd, function(err, maxCode) {
                       if(err) throw new Error(err);
                       var code = 100000;
                       if(maxCode && maxCode.barcode && (maxCode.barcode.toString().indexOf(com_cd) === 0) ) {
                           code = maxCode.barcode.toString().replace(com_cd, '');
                       }
                       Product.query("START TRANSACTION;", function(err) {
                           if (err) { 
                               throw new Error(err);
                           }
                           var listProduct = res.locals.App.listProduct,
                           lstProductIds = res.locals.App.lstProductIds,
                           lstAdd = [], lstUpdate = [];
                           for(var i in data) {
                               var item = data[i];
                               if(item.id && Util.in_array(item.id, lstProductIds)) {
                                   lstUpdate.push({
                                       id: item.id,
                                       quantity: item.sl,
                                   })
                               } else {
                                   ++code
                                   lstAdd.push({
                                       barcode: com_cd.toString() + code.toString(),
                                       cat_id: item.cat,
                                       quantity: item.sl,
                                       product_name: item.name,
                                       price: Util.money2Number(item.price),
                                       user_id: user_id,
                                       com_cd: com_cd
                                   })
                               }
                           }
                           if(!Util.empty(lstAdd)) {
                               Product.create(lstAdd, function(err, added) {
                                   if(err)  { 
                                       throw new Error(err);
                                   }
                                   Product.query("COMMIT;");
                                   res.redirect('/product.list');
                               })
                           }
                       })
                   })
               } else {
                   throw new Error('Lỗi validate!');
               }
           })
       } catch(e) {
           Product.query("ROLLBACK;", function(err) {
               // The rollback failed--Catastrophic error!
               console.log(e);
               return renderView();
           });
       }
    }
};
