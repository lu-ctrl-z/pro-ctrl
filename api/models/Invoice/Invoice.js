/**
 * Invoice.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'invoice',
    attributes: {
        invoiceId : { // id hóa đơn
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            columnName: 'invoice_id',
        },
        customerId : { // id khách hàng
            type: 'integer',
            required: true,
            columnName: 'customer_id',
        },
        totalPrice: { // tổng giá trị trên hóa đơn
            type: 'float',
            columnName: 'total_price',
        },
        trueTotalPrice: { // tổng tiền thực thu
            type: 'float',
            columnName: 'true_total_price',
        },
        totalDiscount: { // tổng giảm trừ
            type: 'float',
            columnName: 'total_discount',
        },
        cartList: {
            type: 'json',
            columnName: 'cart_list',
        },
        dataOptical: {
            type: 'json',
            columnName: 'data_optical',
        },
        note: {
            type: 'text',
            columnName: 'note',
        },
    },
};

