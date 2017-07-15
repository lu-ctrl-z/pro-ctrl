$(function() {
    "user strict"
    heightChanged = function() {
        var headOffset = $('#head-height-offset').height();
        var obj = $('#menu-fluid-container');
        obj.css('margin-top', headOffset + 'px');
        obj.css('height', ($(window).height() - headOffset) + 'px')
    };
    $(window).resize(heightChanged).load(heightChanged);
    $('#button-show-menu').click(function() {
        $('#body').toggleClass('show-fluid');
        if(!$('#body').hasClass('show-fluid')) {
            etCookie.setCookie('imn', 'yes');
        } else {
            etCookie.removeCookie('imn');
        }
    });
    var imnValue = etCookie.getCookie('imn');
    if(imnValue == "yes") {
        $('#body').removeClass('show-fluid');
    }
});
__d = function(a, b, c) {
    $('body').on(a, b, c);
};
