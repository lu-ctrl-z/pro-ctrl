/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'm_comporation',
    attributes: {
        com_cd : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        comporation_name: {
            type: 'string',
            required: true,
        },
        contact_address: {
            type: 'string',
        },
        contact_tel: {
            type: 'string',
        },
        contact_email: {
            type: 'string',
        },
        logo: {
            type: 'string',
        },
        create_user: {
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