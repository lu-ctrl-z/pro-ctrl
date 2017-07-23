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

/**
*
* @param number
* @return
*/
function readNumber(number) {
   var billion = parseInt(Math.floor(number / 1000000000));
   number -= billion * 1000000000;

   var million = parseInt(Math.floor(number / 1000000));
   number -= million * 1000000;

   var thousand = parseInt(Math.floor(number / 1000));
   var unit = number - thousand * 1000;

   var s = "";
   if (billion != 0) {
       s = s + readTriple(billion) + " tỷ, ";
   }
   if (million != 0) {
       s = s + readTriple(million) + " triệu, ";
   }
   if (thousand != 0) {
       s = s + readTriple(thousand) + " nghìn, ";
   }
   if (unit != 0) {
       s = s + readTriple(unit);
   }
   s = s.trim().trim(",");
   return s;
}

function readTriple(number) {
   var HUNDRED_DIGITS = ["", "một trăm", "hai trăm", "ba trăm", "bốn trăm", "năm trăm", "sáu trăm", "bảy trăm", "tám trăm", "chín trăm"];
   var TEN_DIGITS = [" ", " mười ", " hai mươi ", " ba mươi ", " bốn mươi ", " năm mươi ", " sáu mươi ", " bảy mươi ", " tám mươi ", " chín mươi "];
   var UNIT_DIGITS = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
   var UNIT_DIGITS_2 = ["", "mốt", "hai", "ba", "tư", "lăm", "sáu", "bảy", "tám", "chín"];

   var hundred = parseInt(Math.floor(number / 100));
   number -= hundred * 100;
   var ten = parseInt(Math.floor(number / 10));
   var unit = number - ten * 10;

   var s = HUNDRED_DIGITS[hundred] + TEN_DIGITS[ten] + (ten <= 1 ? UNIT_DIGITS[unit] : UNIT_DIGITS_2[unit]);
   return s.trim();
}