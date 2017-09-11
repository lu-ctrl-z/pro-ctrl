/**
 * Product.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'product',
    attributes: {
        productId : { // id
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            columnName: 'product_id',
        },
        sysCatId : {
            type: 'integer',
            required: true,
            columnName: 'sys_cat_id',
        },
        cost : {//giá gốc
            type: 'integer',
            columnName: 'cost',
        },
        price : {//giá bán
            type: 'integer',
            columnName: 'price',
        },
        deduction : {//khuyến mãi
            type: 'integer',
            columnName: 'deduction',
        },
        isSold: {
            type: 'integer',
            columnName: 'is_sold',
            defaultTo: 0
        },
    },
};

