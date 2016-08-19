exports.of = function(model, validationError, i18n, ref) {
    var validFields = Object.keys(validationError);
    var i18nMessage = ref || {};
    validFields.forEach(function(FieldsName) {
        i18nMessage[model + '.' + FieldsName] = i18n(model + '.' + FieldsName + "." + validationError[FieldsName][0].rule);
    });
    return i18nMessage;
};
exports.show = function(name, res) {
    console.log(res.locals);
    if(typeof res.locals.message != 'undefined' &&
       typeof res.locals.message != 'string' &&
       typeof res.locals.message[name] != 'undefined') {
        return '<p class="common_error">' + res.locals.message[name] + '</p>'
    } else {
        return "";
    }
};