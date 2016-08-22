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
    types: sails.config.ModelTypes,
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
            required: true,
        },
        contact_tel: {
            type: 'phone2',
        },
        contact_email: {
            type: 'email',
        },
        logo: {
            type: 'string',
        },
        create_user: {
           model: 'user'
        },
    },
    formAttr: {
        comporation_name: {
            form_type: sails.config.const.FORM_TYPE_TEXT,
        },
        contact_address: {
            form_type: sails.config.const.FORM_TYPE_TEXT,
        },
        contact_tel: {
            form_type: sails.config.const.FORM_TYPE_TEXT,
        },
        contact_email: {
            form_type: sails.config.const.FORM_TYPE_TEXT,
        },
        logo: {
            form_type: sails.config.const.FORM_TYPE_FILE,
        },
    }
};