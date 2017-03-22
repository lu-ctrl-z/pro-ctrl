/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 't_product',
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        barcode: {
            type: 'integer',
            unique: true,
        },
        cat_id: {
            type: 'integer',
            model: 'SysCat'
        },
        user_id: {
           model: 'user' 
        },
        com_cd: {
            model: 'comporation'
        }
    },
    formAttr: {
        cat_id: {
            form_type: sails.config.const.FORM_TYPE_SELECT
        },
        product_name: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        image_default: {
            form_type: sails.config.const.FORM_TYPE_FILE,
        },
    },
    getMaxBarcodeByComCD: function(com_cd, cb) {
        this.findOne({com_cd: com_cd}).max('barcode').exec(cb);
    },
    addMatCan: function(req, res, cb) {
        var catId = sails.config.Constants.OPTIC_MAT_CAN; // Mắt cận
        var com_cd = req.session.user.currentCom.com_cd;
        var user_id = req.session.user.id;
        var barcode = com_cd.toString() + req.param('code').toString();
        this.find({barcode: barcode}).exec(function(err, product) {
            if(product && product.length > 0) {
                throw new Error("Mã barcode đã tồn tại không thể thêm mới");
            }
            var kindType = sails.config.Constants.OPTIC_KIND;
            SysCat.checkValidType(kindType, com_cd, req.param('kind'), function(err, data) {
                if(err) {
                    throw new Error("Loại mắt kính không có trong hệ thống");
                }
                if(!data) return cb(false);
                Product.query("START TRANSACTION;", function(err) {
                    if (err) { 
                        throw new Error(err);
                    }
                    Product.create({
                        barcode: barcode,
                        cat_id : catId,
                        user_id: user_id,
                        com_cd : com_cd
                    }).exec(function(err, product) {
                        if(err) {
                            throw new Error(err);
                        }
                        OpticClass.create({
                            product_id: product.id,
                            class: sails.config.Constants.OPTIC_CLASS,
                            kind: req.param('kind'),
                            c_cycl: req.param('cycl'),
                            quantity: req.param('number'),
                            price: req.param('price'),
                            create_user: user_id
                        }).exec(function(err, opticClass) {
                            if(err) {
                                throw new Error(err);
                            }
                            Product.query("COMMIT;");
                            OpticClass.query("COMMIT;");
                            cb(true);
                        })
                    })
                });
            });
        })
    }
};