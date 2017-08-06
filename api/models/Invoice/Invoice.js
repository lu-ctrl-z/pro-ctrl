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
        invoiceCode : { // code hóa đơn
            type: 'integer',
            columnName: 'invoice_code',
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
        status: {
            type: 'integer',
            required: true, // 0: chưa phê duyệt, 1: đã phê duyệt
            columnName: 'status',
        },
    },
    /**
     * search danh sách Hoa don theo quyền của user.
     */
    getInvoiceList: function(req, res) {
        var paramList = [];
        var column = " SELECT " +
                     "  i.invoice_id As invoiceId " +
                     ", i.invoice_code As invoiceCode " +
                     ", i.total_price As totalPrice " +
                     ", i.true_total_price As trueTotalPrice " +
                     ", c.phone_number As phoneNumber " +
                     ", c.full_name As fullName " +
                     ", org1.organization_name As organizationName " +
                     ", i.status As status " +
                     ", i.createdAt ";
        var from = " FROM CUSTOMER c " +
                   "    INNER JOIN INVOICE i ON i.customer_id = c.customer_id " +
                   "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = c.organization_id " +
                   "    INNER JOIN ORGANIZATION org2 ON org1.path LIKE CONCAT(org2.path, '%')" +
                   "    INNER JOIN M_USERS u ON u.organization_id = org2.organization_id " +
                   " WHERE " +
                   "    u.id = ? ";
        paramList.push(req.session.user['id']);
        if(!CommonUtils.isNullOrEmpty(req.param('invoiceCode'))) {
            from += " AND i.invoice_code LIKE ? ";
            paramList.push('%' + req.param('invoiceCode') + '%');
        }
        if(!CommonUtils.isNullOrEmpty(req.param('fullName'))) {
            from += " AND c.full_name LIKE ? ";
            paramList.push('%' + req.param('fullName') + '%');
        }
        if(!CommonUtils.isNullOrEmpty(req.param('createdAt'))) {
            from += " AND DATE_FORMAT(i.createdAt, '%d/%m/%Y') = ? ";
            paramList.push(req.param('createdAt'));
        }
        var dataTableParam = DataTable.getParam(req);
        var mapColumns = {
                invoiceCode: 'i.invoice_code',
                totalPrice: 'i.total_price',
                trueTotalPrice: 'i.true_total_price',
                phoneNumber: 'c.phone_number',
                fullName: 'c.full_name',
                organizationName: 'org1.organization_name',
                createdAt: 'i.createdAt',
            };
        var sortStr = DataTable.buildOrder(mapColumns, "i.createdAt DESC ", req);
        var query = column + from + sortStr;
        var countQuery = "SELECT COUNT(*) As count " + from;
        DataTable.toJson(req, res, query, countQuery, paramList);
    },
};

