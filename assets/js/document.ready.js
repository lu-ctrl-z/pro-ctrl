__d = function(a, b, c) {
    $('body').on(a, b, c);
};
/**
 * 
 */
$(function() {
    "user strict"
    $.ajaxSetup({
        cache: false
    });
    calHeight = function() {
        $('body').css('min-height', $(window).height() + 'px');
    };
    $(window).resize(function() {
        calHeight();
    }).load(function() {
        calHeight();
    });
    //Submit
    __d('submit', 'form.load-ajax', Ctrl.submitForm);
    __d('keydown', '.ctrl-ediable-input', Ctrl._eKeycodePrevent);
});
$.fn.refreshCat = function() {
    var opt = '';
    try {
        var obj = localStorage.getItem(ICONFIG.ISTORAGE_CAT);
        if(obj) {
            opt = Ctrl._buildOption(JSON.parse(obj));
        } else {
            opt = Ctrl._buildOption(JSON.parse(ICONFIG.CAT_NULL));
        }
    } catch (e) {
        opt = Ctrl._buildOption(JSON.parse(ICONFIG.CAT_NULL));
    }
    $(this).each(function(i, el) {
        var v = $(el).val();
        $(el).empty().append(opt).val(v);
    });
}

$(document).mouseup(function (e) {
    var container = $(ICONFIG.IPOPUP_SELECTOR);
    if (!container.is(e.target)
    && container.has(e.target).length === 0) {
        container.remove();
    }
});

Ctrl = 
{
    numberWithDot: function(x) {
        return x.value = x.value.toString().replace(/\./g, "").replace(ICONFIG.PATTEN_REPLACE_CURRENCY, ".");
    },
    getCategory: function(name) {
        try {
            var obj = localStorage.getItem(ICONFIG.ISTORAGE_CAT);
            if(obj) {
                return this._buildCate(name, JSON.parse(obj));
            } else {
                $.ajax({
                    url : '/cat.data',
                    type : "get",
                    async: false,
                    success : function(r) {
                        if(r.status == STATUS_OK) {
                            obj = r.content;
                            localStorage.setItem(ICONFIG.ISTORAGE_CAT, JSON.stringify(obj));
                        } else {
                            obj = '';
                        }
                    }
                });
                return this._buildCate(name, obj);
            }
        } catch (e) {
            return this._buildCate(name, JSON.parse(ICONFIG.CAT_NULL));
        }
    },
    showAddCat: function(where) {
        $.ajax({
            url : '/product/cat.new',
            type : "get",
            success : function(r) {
                if(r.status == STATUS_OK) {
                    ICONFIG.IPOPUP_CURRENT.target = where;
                    $('body').find('#add-cate-container').remove();
                    $('body').append(r.content).find("#add-cate-container")
                        .css('top', $(where).offset().top + $(where).height() + 'px')
                        .css('left', $(where).offset().left + 'px').find('[autofocus="autofocus"]').first().focus();
                } else {
                    $('body').find('#add-cate-container').remove();
                }
            }
        });
    },
    _buildCate: function(name, j, g) {
        var strCat = '<select data-refcat name="' + name + '" class="w100pc t">';
        strCat += this._buildOption(j, g);
        return strCat;
    },
    _buildOption: function(j, g) {
        var strOpt = '<option value="0">------</option>';
        if( g ) {
            strOpt = '<optgroup label="' + j.cat_name + '">';
            j = j.value;
        }
        for(var k = 0; k < j.length; k++) {
            var i = j[k];
            if(Array.isArray(i)) {
                strOpt += this._buildOption(i, true);
            } else {
                strOpt += '<option value="' + i.cat_id + '">' + i.cat_name + '</option>';
            }
        }
        if( g ) {
            strOpt += '</optgroup>';
        } else {
            strOpt += '<option value="00">Thêm/Sửa danh mục</option></select>';
        }
        return strOpt;
    },
    submitForm : function() {
        var $this = $(this);
        var start = function() {
            $this.addClass('loading').append('<i id="spinner" class="fa fa-spinner fa-spin"></i>');
        }();
        var done = function() {
            $this.removeClass('loading').find('i#spinner').remove();
        };
        try{
            var target = eval($(this).attr('target'));
        } catch(e) {
            console.log(e);
            return false;
        }
        var action = $this.attr('action');
        var method = $this.attr('method') || 'GET';
        var params = {};
        var frmparams = $this.serializeArray();
        $.each(frmparams, function(i, el) {
            params[el.name] = el.value;
        });
        $.ajax({
            type    : method,
            url     : action,
            cache   : false,
            data    : params,
            success : function(respones) {
                target.empty().append(respones.content);
            },
            error   : function(ex) {
            }
        }).done(function() {
            done();
        });
        return false;
    },
    getBarCode: function() {
        try {
            var obj = localStorage.getItem(ICONFIG.ISTORAGE_BCODE);
            var barcode = '';
            if(obj) {
                barcode = JSON.parse(obj);
                return parseInt(barcode);
            } else {
                $.ajax({
                    url : '/barcode.data',
                    type : "get",
                    async: false,
                    success : function(r) {
                        if(r.status == STATUS_OK) {
                            localStorage.setItem(ICONFIG.ISTORAGE_BCODE, JSON.stringify(r.content));
                            barcode = r.content;
                        }
                    },
                    error:  function(e) {
                        console.log(e);
                    }
                });
                return parseInt(barcode);
            }
        } catch (e) {
            return parseInt(barcode);
        }
    },
    getNextCode: function() {
        var curentCode = this.getBarCode();
        if(!isNaN(curentCode)) {
            localStorage.setItem(ICONFIG.ISTORAGE_BCODE, JSON.stringify(curentCode + 1));
            return curentCode + 1;
        } else {
            return '';
        }
    },
    editCat: function(e) {
        var $e = $(e), $li = $e.parents('li'), $ul = $e.parents('ul');
        Ctrl.nextCmd = function() {
            $(e).trigger('click');
        };
        if($li.hasClass('enableEdit')) {
            var params = Ctrl._getDataCtrlOf(e);
            params['ecatname'] = $li.find('.ctrl-ediable-input').val();
            params['act'] = 'edt';
            $.ajax({
                url: '/product/cat.new',
                type    : "POST",
                data    : params,
                success : function(r) {
                    $('#add-cate-container').empty().append(r.content);
                },
                error:  function(e) {
                    $('#add-cate-container').remove();
                }
            });
        } else {
            $ul.find('> li').removeClass('enableEdit');
            $ul.addClass('lock');
            var $inputTmp = $('<input type="text" class="ceditable ctrl-ediable-input" />');
            var span = $li.addClass('enableEdit').find('span');
            var oldName = span.html();
            $li.addClass('enableEdit').find('span').replaceWith($inputTmp.val(span.html()));
            $inputTmp.focus().val();
            Ctrl.escapeCmd = function() {
                $inputTmp.replaceWith($('<span />').html(oldName));
                $ul.find('> li').removeClass('enableEdit');
                $ul.removeClass('lock');
            }
        }
    },
    _eKeycodePrevent: function(e) {
        var code = e.which;
        if(code == 13) {
            Ctrl.nextCmd();
            Ctrl._resetFunction();
            return false;
        } else if (code === 27) {
            Ctrl.escapeCmd();
            Ctrl._resetFunction();
        }
    },
    _resetFunction: function() {
        var nullFunction = function() {};
        Ctrl.nextCmd   = nullFunction;
        Ctrl.escapeCmd = nullFunction;
    },
    _getDataCtrlOf: function(e) {
        var data = '';
        try {
            data = JSON.parse($(e).attr('data-ctrl-content'));
        } catch(ex) { }
        return data;
    },
    nextCmd: function() {},
    escapeCmd: function() {},
};

