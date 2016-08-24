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
});


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
        var obj = localStorage.getItem(ICONFIG.ISTORAGE_CAT);
        if(obj) return this._buildCate(name, obj);
        return this._buildCate(name, ICONFIG.CAT_NULL);
    },
    showAddCat: function(where) {
        $.get('/product/cat.new', function(r) {
            /*if(!r.error) {*/
                $('body').find('#add-cate-container').remove();
                $('body').append(r).find("#add-cate-container")
                    .css('top', $(where).offset().top + $(where).height() + 'px')
                    .css('left', $(where).offset().left + 'px');
            /*}*/
        });
    },
    _buildCate: function(name, j, g) {
        var strCat = '<label class="webkit onlist t" style="vertical-align: top;"><select name="' + name + '" class="w100pc t">';
        if( g ) {
            strCat = '<optgroup label="' + j.name + '">';
            j = j.value;
        }
        for(var k in j) {
            var i = j[k];
            if(typeof i == 'object') {
                strCat += this._buildCate(name, i, true);
            } else {
                strCat += '<option value="' + k + '">' + i + '</option>';
            }
        }
        if( g ) {
            strCat += '</optgroup>';
        } else {
            strCat += '</select></label>';
        }
        return strCat;
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
};

