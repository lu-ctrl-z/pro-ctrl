/**
 * Syscat.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'sys_cat',
    attributes: {
        sysCatId : { // id
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            columnName: 'sys_cat_id',
        },
        code : {
            type: 'string',
            required: true,
            columnName: 'code',
            maxLength: 20,
        },
        name : {
            type: 'string',
            required: true,
            columnName: 'name',
            maxLength: 255,
        },
        description: {
            type: 'string',
            columnName: 'description',
            maxLength: 500,
        },
        sysCatTypeId: {
            type: 'integer',
            required: true,
            columnName: 'sys_cat_type_id',
        },
        isDefault: {
            type: 'integer',
            columnName: 'is_default',
        },
        sortOrder: {
            type: 'integer',
            columnName: 'sort_order',
        },
    },
};

