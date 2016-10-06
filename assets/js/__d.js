__d = function(a, b, c) {
    $('body').on(a, b, c);
};
$(function() {
    __d('click', '#cmdFullScreen', function() {
        $('#appManager').toggleClass('isFullScreen')
    });
    __d('click', '#cmdHideSideRight', function() {
        $('#appManager').toggleClass('isHideSideRight')
    });
    __d('click', '#cmdMinHeader', function() {
        $('#appManager').toggleClass('isMinHeader')
    });
    
})
