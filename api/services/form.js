module.exports = {
    input: function(model, name, value, option) {
        var attr = model.formAttr[name];
        switch(attr.form_type) {
            case sails.config.const.FORM_TYPE_TEXT:
                return this.text(name, value, option);
                break;
            case sails.config.const.FORM_TYPE_PASSWORD:
                return this.password(name, value, option);
                break;
            case sails.config.const.FORM_TYPE_HIDDEN:
                return this.hidden(name, value, option);
                break;
            case sails.config.const.FORM_TYPE_SELECT:
                var data = attr.config_value || {};
                return this.select(data, name, value, option);
                break;
            case sails.config.const.FORM_TYPE_TEXTAREA:
                return this.textarea(name, value, option);
                break;
            case sails.config.const.FORM_TYPE_CHECKBOX:
                var data = attr.config_value || {};
                return this.checkbox(data, name, value, option);
                break;
            case sails.config.const.FORM_TYPE_RADIO:
                var data = attr.config_value || {};
                return this.radio(data, name, value, option);
                break;
            default:
                return this.text(name, value, option);
                break;
        }
    },
    hidden: function(name, value, option) {
        var ret = '<input type="hidden" name="#name" value="#value" #option >';
        value = this.escapeHtml(value);
        option = option || {};
        var strOpt = this.get_option(option);
        return ret.replace('#name', name).replace('#value', value).replace('#option', strOpt);
    },
    password: function(name, value, option) {
        var ret = '<input type="password" name="#name" value="#value" #option >';
        value = this.escapeHtml(value);
        option = option || {};
        var strOpt = this.get_option(option);
        return ret.replace('#name', name).replace('#value', value).replace('#option', strOpt);
    },
    radio: function(data, name, value, option) {
        var $ret = "";
        var $baseRadioItem = '<label #option><input value="#checkvalue" type="radio" name="#basename" #checked>#checkname</label>';
        option = option || {};
        var strOpt = this.get_option(option);
        if(data) {
            var i = 0;
            for(key in data) {
                var nameId = name + i;
                var checkname = this.escapeHtml( data[key] );
                i++;
                if(key == value) {
                    var copy = $baseRadioItem.replace('#checked', 'checked="checked"');
                } else {
                    var copy = $baseRadioItem.replace('#checked', '');
                }
                $ret += copy.replace(/#nameId/g, nameId).replace('#checkvalue', key)
                            .replace('#basename', name).replace('#checkname', checkname)
                            .replace('#option', strOpt);
            }
        }
        return $ret;
    },
    //return string form input type checkbox
    checkbox: function(data, name, value, option) {
        var $ret = "";
        var $baseCheckItem = '<label for="#nameId"><input id="#nameId" value="#checkvalue" type="checkbox" name="#basename" #checked #option>#checkname</label>';
        option = option || {};
        var strOpt = this.get_option(option);
        if(data) {
            var i = 0;
            for(key in data) {
                var nameId = name + i;
                var checkname = this.escapeHtml( data[key] );
                i++;
                if(key == value) {
                    var copy = $baseCheckItem.replace('#checked', 'checked="checked"');
                } else {
                    var copy = $baseCheckItem.replace('#checked', '');
                }
                $ret += copy.replace(/#nameId/g, nameId).replace('#checkvalue', key)
                            .replace('#basename', name).replace('#checkname', checkname)
                            .replace('#option', strOpt);
            }
        }
        return $ret;
    },
    //return string form input type textarea
    textarea: function(name, value, option) {
        var ret = '<textarea name="#name" #option>#value</textarea>';
        value = this.escapeHtml(value);
        option = option || {};
        var strOpt = this.get_option(option);
        return ret.replace('#name', name).replace('#value', value).replace('#option', strOpt);
    },
    //return string form input type text
    text: function(name, value, option){
        var ret = '<input type="text" name="#name" value="#value" #option >';
        value = this.escapeHtml(value);
        option = option || {};
        var strOpt = this.get_option(option)
        return ret.replace('#name', name).replace('#value', value).replace('#option', strOpt);
    },
    //return string form input type select
    select: function(data, name, value, option) {
        var ret = '<select name="#name" #option >#selectoption</select>';

        var strSelectOption = "";
        if(option && option.emptyoption) {
            strSelectOption = '<option values="">'+option.emptyoption+'</option>';
            delete option.emptyoption;
        }

        var strOpt = this.get_option(option)
        var basicOption = '<option #selected value="#value">#displayName</option>'
        if(data) {
            for(var FieldsName in data) {
                if(FieldsName == value) {
                    var copy = basicOption.replace('#selected', 'selected="selected"');
                } else {
                    var copy = basicOption.replace('#selected', '');
                }
                strSelectOption += copy.replace('#value', FieldsName).replace('#displayName', this.escapeHtml(data[FieldsName]));
            }
        }
        return ret.replace('#name', name).replace('#value', value).replace('#selectoption', strSelectOption).replace('#option', strOpt);
    },
    get_option: function(option) {
        option = option || {};
        var strOpt = "";
        if(option) {
            for(var FieldsName in option) {
                var optVal = this.escapeHtml(option[FieldsName]);
                strOpt += FieldsName + '="' + optVal + '" ';
            }
        }
        return strOpt;
    },
    escapeHtml: function(string) {
        var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
              };
        return String(string).replace(/[&<>"'\/]/g, function (s) {
          return entityMap[s];
        });
    },
}