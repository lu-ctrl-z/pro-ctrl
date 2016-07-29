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
            type: 'string'
        },
        cat_id: {
            type: 'integer'
        },
        product_name: {
            type: 'string',
            required: true,
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
    }
};