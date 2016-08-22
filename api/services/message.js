exports.of = function(model, validationError, i18n, ref) {
    var validFields = Object.keys(validationError);
    var i18nMessage = ref || {};
    validFields.forEach(function(FieldsName) {
        i18nMessage[FieldsName] = i18n(model + '.' + FieldsName + "." + validationError[FieldsName][0].rule);
    });
    ref = i18nMessage;
    return i18nMessage;
};