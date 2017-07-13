/**
 * Customer.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'customer',
    types: {
    },
    attributes: {
        customer_id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        phone_number: {
            type: 'string',
            maxLength: 15,
            minLength: 8,
        },
        full_name: {
            type: 'string',
            required: true,
            maxLength: 200,
            minLength: 2,
        },
        address: {
            type: 'string',
        },
        organization_id : {
            type: 'integer',
        },
    },
    formAttr: {
        full_name: {
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

