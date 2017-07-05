/**
 * Customer.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'organization',
    types: {
    },
    attributes: {
        organization_id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        organization_name: {
            type: 'string',
            maxLength: 500,
            required: true,
        },
        path: {
            type: 'string',
            maxLength: 500,
            required: true,
        },
        address: {
            type: 'string',
        },
        phone_number: {
            type: 'string',
        },
        image_path: {
            type: 'string',
        }
    },
    formAttr: {
        organization_name: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        phone_number: {
            form_type: sails.config.const.FORM_TYPE_TEXT
        },
        address: {
            form_type: sails.config.const.FORM_TYPE_TEXTAREA
        }
    },
};

