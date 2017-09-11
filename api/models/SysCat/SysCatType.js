/**
 * SysCatType.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 'sys_cat_type',
    attributes: {
        sysCatTypeId : { // id
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            columnName: 'sys_cat_type_id',
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
        organizationId: {
            type: 'integer',
            columnName: 'organization_id',
            required: true,
        },
        parentId : {
            type: 'integer',
            columnName: 'parent_id',
        }
    },
    //lấy danh sách loại danh mục theo parentId
    //lấy loại danh mục theo quyền của user đăng nhập
    getListByParentId: function(req, parentId, callback) {
        var paramList = [];
        var column = " SELECT " +
                     "  sct.sys_cat_type_id As sysCatTypeId " +
                     "  ,sct.name As name " +
                     "  ,sct.description As description " +
                     "  ,(SELECT COUNT(*) FROM SYS_CAT sc WHERE sc.sys_cat_type_id = sct.sys_cat_type_id ) As countSysCat ";
        var from = " FROM SYS_CAT_TYPE sct " +
                   "    INNER JOIN ORGANIZATION org1 ON org1.organization_id = sct.organization_id " +
                   "    INNER JOIN ORGANIZATION org2 ON org1.path LIKE CONCAT(org2.path, '%')" +
                   " WHERE " +
                   "     org2.organization_id = ? " +
                   " AND sct.parent_id = ? ";
        paramList.push(req.session.user['organizationId']);
        paramList.push(parentId);
        var query = column + from;
        Dual.query(query, paramList, function(err, resultList) {
            callback(resultList);
        });
    },
    /**
     * ham lay danh muc theo loai danh muc
     */
    getSysCatList: function(sysCatTypeId, callback) {
        var paramList = [];
        var column = " SELECT " +
                     "  sc.sys_cat_id As sysCatId " +
                     "  ,sc.sys_cat_type_id As sysCatTypeId " +
                     "  ,sc.code As code " +
                     "  ,sc.name As name " +
                     "  ,sc.description As description ";
        var from =   " FROM SYS_CAT sc " +
                     " WHERE " +
                     "     sc.sys_cat_type_id = ? ";
        paramList.push(sysCatTypeId);
        var query = column + from;
        Dual.query(query, paramList, function(err, resultList) {
            callback(resultList);
        });
    },
    /**
     * ham lay danh muc theo loai danh muc
     */
    loadSysCatList: function(req, res, callback) {
        var paramList = [];
        var column = " SELECT " +
                     "  sc.sys_cat_id As sysCatId " +
                     "  ,sc.sys_cat_type_id As sysCatTypeId " +
                     "  ,sc.code As code " +
                     "  ,sc.name As name " +
                     "  ,( SELECT COUNT(*) FROM PRODUCT p WHERE p.sys_cat_id = sc.sys_cat_id AND p.is_sold = 0 ) As totalProduct " +
                     "  ,sc.description As description ";
        var from =   " FROM SYS_CAT sc WHERE sc.sys_cat_type_id = ? ";
        paramList.push(CommonUtils.getParameterLong(req, "sysCatTypeId"));
        var dataTableParam = DataTable.getParam(req);
        var mapColumns = {
                sysCatId: 'sc.sys_cat_id',
                sysCatTypeId: 'sc.sys_cat_type_id',
                code: 'sc.code',
                name: 'sc.name',
                description: 'sc.description',
            };
        var query = column + from;
        var countQuery = "SELECT COUNT(*) As count " + from;
        DataTable.toJson(req, res, query, countQuery, paramList, callback);
    },
    
};

