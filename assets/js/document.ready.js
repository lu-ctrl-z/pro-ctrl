/**
 * 
 */
__ = function(a, s, cb) {
    $('body').on(a, s, cb);
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
$.fn.sleepy = function() {
    $(this).click(function() {
        var $this = $(this);
        var $is_sleep = $this.hasClass('sleep');
        var $task = $this.parents('.task');
        $task.find('.task-item').addClass('sleep');
        $this.removeClass('sleep').find('.popup').removeClass('active');
    });
    return this;
};
$.fn.taskRemove = function() {
    var $task = $(this).parents('.task-item');
    $task.addClass('wait-for-remove');
    setTimeout( function() {
        $task.remove();
    }, 300)
};
$.fn.taskRecived = function($task) {
    $task.addClass('wait-for-remove');
    var $this = $(this);
    $this.append($task);
    $task.click();
    setTimeout( function() {
        $task.removeClass('wait-for-remove');
    }, 300)
};
$.fn.taskProcessTiming = function() {
    var $this = $(this);
    setInterval(function() {
        $this.find('.task-item').each(function() {
            var $task = $(this);
            try{
                $done = $task.attr('timing') ? $task.attr('timing') : 0;
            } catch(e) {
                var $done = 0;
            }
            $task.attr('timing', ++$done);
            if($done%Config.TIMING.timing_delay == 0) {
                var hour = parseInt($done/3600);
                var minus = ($done-(hour*3600))/60;
                $task.attr('show-time', hour + "h " + minus + 'm');
            }
        });
    }, 1000);
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
        return false;
    });
    $('.task-doing').taskProcessTiming();
    $('.boxpup').popup();
    $('.task-item').sleepy().addClass('sleep');
    $('[role="cmd-sleep"]').click(function() {
        $(this).parents('.task-item').addClass('sleep');
    });
    $('[role="cmd-toggle"]').click(function() {
        $(this).parents('.task-item').find('.popup').toggleClass('active').focus();
    });
    $('[role="cmd-remove"]').click(function() {
        $(this).taskRemove();
    });
    $('[role="cmd-sendto-done"]').click(function() {
        var $task = $(this).parents('.task-item');
        var $todo = $(this).parents('tr').find('.task-done');
        socket.emit( 'changeStatus', { task_id: $task.attr('id'), target: $todo.attr('id') } );
    });
    $('[role="cmd-sendto-suppend"]').click(function() {
        var $task = $(this).parents('.task-item');
        var $suppend = $(this).parents('tr').find('.task-suppend');
        socket.emit( 'changeStatus', { task_id: $task.attr('id'), target: $suppend.attr('id') } );
    });
    $('[role="cmd-sendto-review"]').click(function() {
        var $task = $(this).parents('.task-item');
        var $review = $(this).parents('tr').find('.task-review');
        socket.emit( 'changeStatus', { task_id: $task.attr('id'), target: $review.attr('id') } );
    });
    $('[role="cmd-sendto-review-waiting"]').click(function() {
        var $task = $(this).parents('.task-item');
        var $waiting = $(this).parents('tr').find('.task-review-waiting');
        socket.emit( 'changeStatus', { task_id: $task.attr('id'), target: $waiting.attr('id') } );
    });
    $('[role="cmd-sendto-doing"]').click(function() {
        var $task = $(this).parents('.task-item');
        var $doing = $(this).parents('tr').find('.task-doing');
        socket.emit( 'changeStatus', { task_id: $task.attr('id'), target: $doing.attr('id') } );
    });
    $('[role="cmd-sendto-to-do"]').click(function() {
        var $task = $(this).parents('.task-item');
        var $to_do = $(this).parents('tr').find('.task-to-do');
        socket.emit( 'changeStatus', { task_id: $task.attr('id'), target: $to_do.attr('id') } );
    });
    $('[role="cmd-edit"]').click(function() {
        $(this).enableEdit();
    });
    $('select[role="localtion"]').change(function() {
        var $val = $(this).val();
        if($val) {
            location.href = $val;
        }
    });
    
    $('overlay > *').click(function() {
        return false;
    });
    $('body').on('change', '.task-form input[name="type"]', function() {
        var $val = $(this).val();
        var $class = 'task-form ';
        if($val == 1) {
            $class += 'green';
        } else if($val == 2) {
            $class += 'orange';
        } else if($val == 3) {
            $class += 'red';
        }
        $(this).parents('.task-form').attr('class', '').addClass($class);
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
    var boxupBlur = function() {
        var $tool = $(this).parents('.tool');
        if($tool.hasClass('active')) {
            $('.tool').removeClass('active');
        } else {
            $('.tool').removeClass('active');
            $tool.addClass('active').find('[tabindex="1"]').focus();
        }
    };
    __('click', 'a.load-ajax', getHref);
    __('submit', 'form.load-ajax', submitForm);
    __('click', '.tool > a, .tool button[name="cancel"]', boxupBlur);
});
