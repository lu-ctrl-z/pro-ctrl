__d = function(a, b, c) {
    $('body').on(a, b, c);
};
$(function() {
    __d('click', '#cmdFullScreen', function() {
        if(!$('#appManager').hasClass('isFullScreen')) {
            $('#appManager').addClass('isHideSideRight');
        } else {
            $('#appManager').removeClass('isHideSideRight');
        }
        $('#appManager').toggleClass('isFullScreen')
    });
    __d('click', '#cmdHideSideRight', function() {
        $('#appManager').toggleClass('isHideSideRight')
    });
    __d('click', '#cmdMinHeader', function() {
        $('#appManager').toggleClass('isMinHeader')
    });
})
