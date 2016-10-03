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
    autosubscribe: ['destroy', 'update', 'add', 'remove'],
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        barcode: {
            type: 'integer',
            max: 10,
            unique: true,
        },
        cat_id: {
            type: 'integer',
            model: 'categories'
        },
        product_name: {
            type: 'string',
            required: true,
        },
        quantity: {
            type: 'integer',
            required: true,
        },
        price: {
            type: 'integer',
            required: true,
            max: 99999999999
        },
        privatePrice: {
            type: 'integer',
            max: 99999999999
        },
        image_default: {
            type: 'string',
        },
        delete_flg: {
            type: 'integer',
            in: [0,1],
            defaultsTo: 0
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
};