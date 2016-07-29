/**
 * User.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'm_category',
    attributes: {
        cat_id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        cat_name: {
            type: 'string',
            required: true,
        },
    },
};