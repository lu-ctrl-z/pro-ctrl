exports.of = function(model, validationError, i18n, ref) {
    if(validationError) {
        var validFields = Object.keys(validationError);
        var i18nMessage = ref || {};
        validFields.forEach(function(FieldsName) {
            i18nMessage[model + '.' + FieldsName] = i18n(model + '.' + FieldsName + "." + validationError[FieldsName][0].rule);
        });
        return i18nMessage;
    }
};