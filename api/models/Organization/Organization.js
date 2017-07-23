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
        organizationId : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            columnName: 'organization_id',
        },
        organizationName: {
            type: 'string',
            maxLength: 500,
            required: true,
            columnName: 'organization_name',
        },
        path: {
            type: 'string',
            maxLength: 500,
            required: true,
            columnName: 'path',
        },
        address: {
            type: 'string',
            columnName: 'address',
        },
        taxNumber: {
            type: 'string',
            columnName: 'tax_number',
        },
        phoneNumber: {
            type: 'string',
            columnName: 'phone_number',
        },
        imagePath: {
            type: 'string',
            columnName: 'image_path',
        }
    },
    formAttr: {
        organization_id: {
            form_type: sails.config.const.FORM_TYPE_HIDDEN
        },
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

