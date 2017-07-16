/* 
 * etCookie v0.1
 * 
 * Copyright 2013 E-Spring Tran
 * Released under the MIT license
 */


if (!etCookie) {
    var etCookie = {};
}
etCookie.getCookieList = function() {
    var c = document.cookie;
    var cArr = c.split('; ');
    var v = new Object();
    for (var i = 0, cLength = cArr.length; i < cLength; i++) {
        v[cArr[i].split('=')[0]] = cArr[i].split('=')[1];
    }
    return v;
};
etCookie.getCookie = function(name) {
    var v = etCookie.getCookieList();
    return (v[name] === undefined || v[name] === null) ? "" : decodeURIComponent(v[name]);
};
etCookie.setCookie = function(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value);
};
etCookie.removeCookie = function(name) {
    document.cookie = encodeURIComponent(name) + "=deleted; expires=" + new Date(0).toUTCString();
};

function initShortCutByAreaId(areaId) {
    $('#' + areaId + ' .cmd-shortcut-form').each(function() {
        var $this = $(this);
        shortcut.add($this.attr('data-form-shortcut-key'), function(event) {
            if($this.is(":visible")) {
                if($this.attr('onclick')) {
                    $this.trigger('click');
                } else if($this.attr('href')){
                    location.href = $this.attr('href');
                }
            }
            return false;
        } , {propagate: false} );
    });
}