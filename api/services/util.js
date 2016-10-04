
/**
 * Checks if a value exists in an array
 * @link http://www.php.net/manual/en/function.in-array.php
 * @param needle mixed <p>
 * The searched value.
 * </p>
 * <p>
 * If needle is a string, the comparison is done
 * in a case-sensitive manner.
 * </p>
 * @param haystack array <p>
 * The array.
 * </p>
 * @param strict bool[optional] <p>
 * If the third parameter strict is set to true
 * then the in_array function will also check the
 * types of the
 * needle in the haystack.
 * </p>
 * @return bool true if needle is found in the array,
 * false otherwise.
 */
exports.in_array = function(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}
exports.empty = function(v) {
    if( typeof v == undefined ) return true;
    if( v == '' ) return true;
    if( v == 0 ) return true;
    if( typeof v == 'object' && Object.keys(v).length === 0) return true;
    return false;
}
exports.money2Number = function(v) {
    return v.replace(/\./g, "").replace(/^0+/, '');
}
exports.number2Money = function(v) {
    return v.replace(/\./g, "").replace(/^0+/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
