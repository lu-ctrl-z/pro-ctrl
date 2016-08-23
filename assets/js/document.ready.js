/**
 * 
 */
$(function() {
    "user strict"
    calHeight = function() {
        $('body').css('min-height', $(window).height() + 'px');
    };
    $(window).resize(function() {
        calHeight();
    }).load(function() {
        calHeight();
    });
});
__d = function(a, b, c) {
    $('body').on(a, b, c);
};
var displayError = function(error) {
    var $butterbar = $('#butterbar');
    $butterbar.removeClass('active').find('.wrapper').empty();
    var message = error.message;
    for(var mess in message ) {
        $butterbar.find('.wrapper').append('<p class="alert">' + message[mess] + '</p>');
    }
    setTimeout(function() {
        $butterbar.addClass('active');
    }, 200);
};
var displaySuccess = function(respone) {
    var $butterbar = $('#butterbar');
    $butterbar.removeClass('active').find('.wrapper').empty();
    var message = respone.message;
    for(var mess in message ) {
        $butterbar.find('.wrapper').append('<p class="notice">' + message[mess] + '</p>');
    }
    setTimeout(function() {
        $butterbar.addClass('active');
    }, 200);
};
$.fn.sendData = function(success, error, done) {
    var $this= $(this);
    $this.submit(function() {
            var $type = $this.attr('method').toLowerCase() == "post" ? "POST": "GET";
            var $url = $this.attr('action');
            var params = {};
            var frmparams = $this.serializeArray();
            $.each(frmparams, function(i, el) {
                params[el.name] = el.value;
            });
            $this.find('button').attr('disabled', 'disabled');
            $.ajax({
                type    : $type,
                url     : $url,
                cache   : false,
                data    : params,
                success : function(respones) {
                    if(respones.status == 'NG') {
                        error(respones);
                    } else if(respones.status == 'OK') {
                        success(respones);
                    }
                },
                error   : function(ex) {
                }
            }).done(function() {
                $this.find('button').removeAttr('disabled');
                done();
            });
            return false;
    });
};
$.fn.lockScreen = function () {
    $('body').addClass('lock');
    var $popup = $('body > .popup-box');
    var margin_left = - $popup.width()/2;
    var margin_top = - $popup.height()/2;
    $popup.css('margin-left', margin_left).css('margin-top', margin_top);
    $('overlay').click(function() {
        $('body').unlockScreen();
    });
};
$.fn.unlockScreen = function() {
    $('body').removeClass('lock');
    $('body > .popup-box').remove();
    $('overlay').unbind('click');
}
$.fn.popup = function() {
    var $this = $(this);
    $this.click(function() {
       var $href = $this.attr('href');
        $.ajax({
            url: $href,
            type: "GET",
            success: function(data) {
                $('body').append(data);
                $('body').lockScreen();
            }
        });
        return false;
    });
};

$(function() {
    $('[role^="cmd-"]').click(function() {
        //return false;
    });

    $('.boxpup').popup();

    $('overlay > *').click(function() {
        return false;
    });
    //#send data form with ajax request
    $('.via-form-send').sendData(displaySuccess, displayError, function() {});
    $('.via-form-search').sendData(function(respones) {
        $('#search-result').append( respones );
    }, displayError, function() {});
    $('.butterbar .close').click(function() {
        $(this).parents('.butterbar').removeClass('active');
    });
    if($('#butterbar').find('.wrapper p').length > 0) {
        setTimeout( function() {
            $('#butterbar').addClass('active');
        }, 200);
    };
    //load ajax
    var getHref = function() {
        var href = $(this).attr('href');
        if(!href) return;
        try{
            var target = eval($(this).attr('target'));
        } catch(e) {
            console.log(e);
            return false;
        }
        var remove = $(this).attr('remove') || 'no';
        $.get(href).done(function(respones) {
            if(remove == 'yes') {
                target.empty().append(respones.content);
            } else {
                target.append(respones.content);
            }
        });
        return false;
    };
    __d('click', '.load-ajax', getHref);

    var submitForm = function() {
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
    };
    __d('submit', 'form.load-ajax', submitForm);

    var boxupBlur = function() {
        var $tool = $(this).parents('.tool');
        if($tool.hasClass('active')) {
            $('.tool').removeClass('active');
        } else {
            $('.tool').removeClass('active');
            var isLoaded = $tool.addClass('active').find('[tabindex="1"]');
            if(isLoaded.length > 0) {
                isLoaded.focus();
            } else {
                $.get($(this).attr('href'), function(res) {
                    $tool.find('.input-data-form').append(res.content);
                });
            }
        }
    };
    __d('click', '.tool > a, .tool button[name="cancel"]', boxupBlur);
});
