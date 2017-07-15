module.exports = {};
/**
 * check null hoac rong
 */
module.exports.isNullOrEmpty = function(checkValue) {
    var typeOf = typeof checkValue;
    if (typeOf === "undefined") {
        return true;
    }
    if (typeOf === "string") {
        return checkValue.trim() == "";
    }
    return false;
}
/**
 * NVL function
 */
module.exports.NVL = function(checkValue, nullValue) {
    if (typeof checkValue === "undefined") {
        return nullValue;
    } else if (typeof checkValue === "string" && checkValue.trim() == "") {
        return nullValue;
    } else if (typeof checkValue === "number" && checkValue < 0) {
        return nullValue;
    }
    return checkValue;
}
/**
 * check quyền đối với id đơn vị
 */
module.exports.havePermissionWithOrg = function(req, orgId, cb) {
    var orgId1 = req.session.user.organization_id;
    Organization.findOne({organization_id: orgId1}, function(err, org1) {
        if(err) {
            console.log(err);
        } else if(org1) {
            Organization.findOne({organization_id: orgId}, function(err, org2) {
                if(err) {
                    console.log(err);
                } else if(org2) {
                    try {
                        var orgPath1 = org1.path;
                        var orgPath2 = org2.path;
                        if(orgPath2.indexOf(orgPath1) >= 0) {
                            cb(true);
                        } else {
                            cb(false);
                            console.warn(new Date(), req.session.user, "Đã thực hiện hack quyền.");
                        }
                    } catch(e) {
                        console.log(e.message)
                    }
                } else {
                    cb(false);
                }
            })
        } else {
            cb(false);
        }
    });
}
