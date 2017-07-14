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
          ", org1.organization_name " +
          " FROM CUSTOMER c " +
          "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = c.organization_id " +
          "    INNER JOIN ORGANIZATION org2 ON org1.path LIKE CONCAT(org2.path, '%')" +
          "    INNER JOIN M_USERS u ON u.organization_id = org2.organization_id " +
          " WHERE " +
          "    u.id = ? ";
        paramList.push(req.session.user['id']);
        if(req.param('phoneNumber')) {
            sql += " AND c.phone_number LIKE ? ";
            paramList.push(req.param('phoneNumber') + '%');
        }
        if(req.param('fullName')) {
            sql += " AND c.full_name LIKE ? ";
            paramList.push('%' + req.param('fullName') + '%');
        }
        if(req.param('address')) {
            sql += " AND c.address LIKE ? ";
            paramList.push('%' + req.param('address') + '%');
        }
        Customer.query(sql, paramList ,function(err, resultList) {
            if (err) { return res.serverError(err); }
            callback(resultList);
        });
    },
};

