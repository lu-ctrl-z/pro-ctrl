module.exports = {};

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