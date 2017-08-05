module.exports = {};
/**
 * get param data table
 */
module.exports.getParam = function(req) {
    var start = CommonUtils.NVL(CommonUtils.getParameterLong(req, "iDisplayStart"), 0);
    var page = CommonUtils.NVL(CommonUtils.getParameterLong(req, "page"), 0);
    var length = CommonUtils.NVL(CommonUtils.getParameterLong(req, "iDisplayLength"), 0);
    var globalSearch = req.param("sSearch");
    var globalOrderIndex = CommonUtils.NVL(CommonUtils.getParameterLong(req, "iSortCol_0"));
    var globalDir = req.param("sSortDir_0");
    
    var globalOrderName = req.param("mDataProp_" + globalOrderIndex);
    var globalSortable = req.param("bSortable_" + globalOrderIndex);
    if (length <= 0) {
        length = 10;
    }
    var param = {};
    param.length = length;
    param.start = start;
    param.page = page;
    param.globalSearch = globalSearch;
    if (globalSortable != null && "true" == globalSortable.toLowerCase()) {
        param.globalOrderIndex = globalOrderIndex;
        param.globalOrderName = globalOrderName;
        param.globalDir = globalDir;
    }
    return param;
};
module.exports.buildOrder = function(columnsOrder, defaultSort, req) {
    var param = DataTable.getParam(req);
    var sort = "";
    var globalDir = param.globalDir != null ? param.globalDir : "";
    var sortDirection = ("desc" == globalDir.toLowerCase()) ? "DESC" : "ASC";
    if (!CommonUtils.isNullOrEmpty(param.globalOrderName)) {
        var col = columnsOrder[param.globalOrderName];
        if (null != col) {
            sort = " ORDER BY " + col + " " + sortDirection;
        }
    } else if (!CommonUtils.isNullOrEmpty(defaultSort)) {
        sort = " ORDER BY " + defaultSort + " ";
    }
    return sort;
};

module.exports.toJson = function(req, res, query, countQuery, paramList) {
    var param = DataTable.getParam(req);

    var returnData = {};
    var draw = CommonUtils.NVL(CommonUtils.getParameterLong(req, "sEcho"));
    var limit = param.length;
    var offset = param.start;
    query += " LIMIT ? OFFSET ? ";
    paramList.push(limit);
    paramList.push(offset);
    returnData.draw = draw;
    try {
        Dual.query(query, paramList, function(err, resultList) {
            if (err) {
                console.log(err);
            } else {
                returnData.data = resultList;
                Dual.query(countQuery, paramList, function(err, recordsTotal) {
                    if (err) {
                        console.log(err);
                    } else {
                        if(recordsTotal) {
                            recordsTotal = recordsTotal[0].count;
                        }
                        returnData.recordsTotal = recordsTotal;
                        returnData.recordsFiltered = recordsTotal;
                        res.json(returnData);
                    }
                });
            }
        });
    } catch(e) {
        console.log(e);
        res.json({});
    }
}