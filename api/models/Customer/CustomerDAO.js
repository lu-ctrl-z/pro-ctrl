/**
 * CustomerDAO.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    /**
     * search danh sách khách hàng theo quyền của user.
     */
    getCustomerList: function(req, res, callback) {
        var paramList = [];
        var sql = " SELECT " +
          "  c.customer_id " +
          ", c.phone_number " +
          ", c.full_name " +
          ", c.address " +
          " FROM CUSTOMER c " +
          "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = c.organization_id " +
          "    INNER JOIN ORGANIZATION org2 ON org1.path LIKE CONCAT(org2.path, '%')" +
          "    INNER JOIN USER u ON u.organization_id = org2.organization_id " +
          " WHERE " +
          "    u.id = ? ";
        paramList.push(req.session.user['id']);
        if(req.param('phoneNumber')) {
            sql += " c.phone_number LIKE ? ";
            paramList.push(req.param('phoneNumber') + '%');
        }
        if(req.param('fullName')) {
            sql += " c.full_name LIKE ? ";
            paramList.push('%' + req.param('fullName') + '%');
        }
        if(req.param('address')) {
            sql += " c.address LIKE ? ";
            paramList.push('%' + req.param('address') + '%');
        }
        Customer.query(sql, paramList ,function(err, resultList) {
            if (err) { return res.serverError(err); }
            callback(resultList);
        });
    },
};

