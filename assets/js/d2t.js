function confirmAction() {
	return confirm(MSG.confirmAction);
}
function confirmCollectData() {
	return confirm(MSG.confirmCollectData);
}
function confirmCreate() {
	return confirm(MSG.confirmCreate);
}
function confirmDelete() {
	return confirm(MSG.confirmDelete);
}
function confirmImport() {
	return confirm(MSG.confirmImport);
}
function confirmSave() {
	return confirm(MSG.confirmSave);
}
function confirmSync() {
	return confirm(MSG.confirmSync);
}
function confirmUpdate() {
	return confirm(MSG.confirmUpdate);
}
/**
 * Xu ly Ajax server tra ve.
 * @param returnCode Ma tra ve (0 - thanh cong, 1 - that bai)
 * @param msg Xau thong bao
 * @param callback Ham Javascript can thuc hien
 * @param extraValue ID truong loi tren form can focus
 */
function d2tProcessReturnMessage(returnCode, msg, callback, extraValue, json) {
    try {
        d2tUpdateMessage(returnCode, msg, extraValue);
        eval(callback + '(returnCode, extraValue, json)');
    } catch (ex) {
        console.error(ex.message);
    }
}
/**
 * Display success message.
 * @param returnCode
 * @param msg
 * @param extraValue
 */
function d2tUpdateMessage(returnCode, msg, extraValue) {
    if (msg !== "") {
        if (returnCode === "-1") {
            toastr["warning"](msg)
        } else {
            toastr["success"](msg)
            try {
                $("#" + extraValue).focus();
            } catch (ex) {
            }
        }
    }
}
/**
 * Update Ajax.
 * Can loai bo tham so callback.
 * @param areaId ID vung DIV cap nhat
 * @param actionUrl Xau URL
 * @param formData Tham so gui len server
 * @param callback Ham goi khi thuc hien thanh cong
 * @author HoangCH
 */
function d2tUpdateAjax(areaId, actionUrl, formData, callback) {
    try {
        var method = "POST";
        d2tSetTokenByLocalStorage();
        d2tInitProgress();
        if ((callback !== null) && (callback !== undefined)) {
            if(callback != "GET" && callback != 'POST') {
                actionUrl += "&callback=" + callback;
            } else {
                method = callback;
            }
        }
        jQuery.ajax({
            type: method,
            url: actionUrl,
            data: formData,
            cache: false,
            success: function(html) {
                d2tResetProgress();
                jQuery("#" + areaId).html(html);
            }
        });
    } catch (ex) {
        alert(ex.message);
    }
}
/**
 * Update Ajax.
 * @param areaId ID vung DIV cap nhat
 * @param actionUrl Xau URL
 * @param formData Tham so gui len server
 * @param callback Ham goi khi thuc hien thanh cong
 * @author
 * @return deferred call ajax
 */
function d2tDeferredAjax(areaId, actionUrl, formData, method) {
    var dfd = $.Deferred();
    if(typeof method === 'undefined') method = "POST";
    try {
       d2tSetTokenByLocalStorage();
       d2tInitProgress();
       dfd = jQuery.ajax({
            type: method,
            url: actionUrl,
            data: formData,
            cache: false,
            success: function(html) {
                d2tResetProgress();
                jQuery("#" + areaId).html(html);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error(thrownError);
            }
        });
    } catch (ex) {
        alert(ex.message);
    }
    return dfd;
}
/**
 * Hien thi anh loading.
 */
function d2tInitProgress() {
    $("#processer").show();
}

/**
 * An anh loading.
 */
function d2tResetProgress() {
    $("#processer").hide();
}
/**
 * Cap nhat token moi nhat.
 */
function d2tGetToken() {
    var tokens = document.getElementsByName(TOKEN_NAME);
    if (tokens !== null && tokens.length > 0) {
        return "&" + TOKEN_NAME + "=" + tokens[0].value;
    } else {
        return "";
    }
}
/**
 * Tao chuoi tham so de day vao URL.
 * @param formName
 * @return Chuoi tham so
 * @author Edited by HuyenNV
 */
function getFormAsString(formId) {
    d2tSetTokenByLocalStorage();
    return $("#" + formId).serialize();
}
/**
 * hàm lấy data form vào object.
 * truyền vào form ID
 */
function getFromAsObject(formName) {
    d2tSetTokenByLocalStorage();
    var paramObj = {};
    $.each($("#" + formName).serializeArray(), function(_, kv) {
      if (paramObj.hasOwnProperty(kv.name)) {
        paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
        paramObj[kv.name].push(kv.value);
      } else {
        paramObj[kv.name] = kv.value;
      }
    });
    return paramObj;
}
/**
 * hàm copy thuộc tính của 2 object
 * object: dest, object: org
 */
function d2tCopyProperty(dest, org) {
    $.each(org, function(k, v) {
        if (dest.hasOwnProperty(k)) {
            dest[k] = $.makeArray(dest[k])
            dest[k].push(v);
        } else {
            dest[k] = v;
        }
    });
    return dest;
}
/**
 * Cap nhat token moi nhat.
 * @param sessionToken
 */
function d2tResetToken(sessionToken) {
    try {
        var tokens = document.getElementsByName(TOKEN_NAME);
        if (tokens !== null && tokens.length > 0) {
            for (var i = 0; i < tokens.length; i++) {
                tokens[i].value = sessionToken;
            }
        }
        if (typeof (Storage) !== "undefined") {
            localStorage.sessionToken = sessionToken;
        }
    } catch (ex) {
        alert(ex.message);
    }
}
/**
 * Cap nhat token moi nhat.
 */
function d2tSetTokenByLocalStorage() {
    try {
        if (typeof (Storage) !== "undefined") {
            var sessionToken = localStorage.sessionToken;
            var tokens = document.getElementsByName(TOKEN_NAME);
            if (tokens !== null && tokens.length > 0) {
                for (var i = 0; i < tokens.length; i++) {
                    tokens[i].value = sessionToken;
                }
            }
        }
    } catch (ex) {
        alert(ex.message);
    }
}
/**
 * Reset form bang Javascript.
 * Khong reset truong hidden, vi truong hidden thuong la truong de cau hinh.
 */
function d2tResetForm(formId) {
    var formObject = document.getElementById(formId);
    var formElements = formObject.elements;
    for (var i = 0; i < formElements.length; i++) {
        var e = formElements[i];
        if (e.type !== undefined) {
            var fieldType = e.type.toLowerCase();
            switch (fieldType) {
                case "text":
                case "password":
                case "textarea":
                case "hidden":
                case "file":
                    e.value = "";
                    break;
                case "radio":
                case "checkbox":
                    if (e.checked) {
                        e.checked = false;
                    }
                    break;
                case "select-one":
                case "select-multi":
                    e.selectedIndex = 0;
                    break;
                default:
                    break;
            }
        }
    }
}
/**
 * Ham chuan hoa chuoi khi nhap.
 * @param str Xau dau vao
 * @return Xau da duoc cat
 * @author
 */
function trim(str) {
    str = str.replace(/^\s\s*/, '');
    var ws = /\s/,
            i = str.length;
    while (ws.test(str.charAt(--i)))
        ;
    return str.slice(0, i + 1);
}
function escapeHtml(text) {
    return isNullStr(text) ? '' : String(text)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;");
}
function isNullStr(str){
    var strVal = String(str);
    strVal = strVal.trim();
    if(!strVal || undefined == str){
        return true;
    } else {
        return false;
    }
}
function formatMoney(input) {
    return (input)? input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
}
function d2tScrollTo(areaId) {
    $("html, body").animate({
        scrollTop : $('#' + areaId).offset().top - $('#head-height-offset').height()
    }, 600);
}
/**
 * chuyen gia tri nguoi dung nhap vao sang format chuan (dd/mm/yyyy)
 * @param obj
 * @author TienCB
 */
function d2tChangeDateFormat(obj) {
    var data = obj.value;
    var day;
    var month;
    var year;
    var convertedData = "";

    /** dinh dang ddmmyyyy  */
    var regex1 = /^\d{8}$/;
    /** dinh dang ddmmyy  */
    var regex2 = /^\d{6}$/;
    /* dinh dang dd-mm-yyyy */
    var regex3 = /^\d{2}-\d{2}-\d{4}$/;
    /* dinh dang dd/mm/yyyy */
    var regex4 = /^\d{2}\/\d{2}\/\d{4}$/;

    if (regex1.test(data)) {
        day = data.substring(0, 2);
        month = data.substring(2, 4);
        year = data.substring(4, 8);
        convertedData = day + "/" + month + "/" + year;
    } else if (regex2.test(data)) {
        day = data.substring(0, 2);
        month = data.substring(2, 4);
        year = data.substring(4, 6);
        convertedData = day + "/" + month + "/" + "20" + year;
    } else if (regex3.test(data)) {
        day = data.substring(0, 2);
        month = data.substring(3, 5);
        year = data.substring(6, 10);
        convertedData = day + "/" + month + "/" + year;
    } else if (regex4.test(data)) {
        convertedData = data;
    } else {
         var value = d2tIsDateFormat(data);
         if (value == 2) {
            alert("Ngày không đúng định dạng (dd/mm/yyyy)");
         } else if (value == 3) {
            alert("Ngày không hợp lệ");
         }
         convertedData = "";
    }
    obj.value = convertedData;
}
/**
 * Kiem tra xem xau co phai la dinh dang ngay thang khong (dd/mm/yyyy).
 * @param value Xau
 * @return 0 neu khac rong va dinh dang ngay thang, 1 neu rong, 2 neu khong dung dinh dang, 3 neu khong hop le.
 * @author HuyenNV
 */
function d2tIsDateFormat(value) {
    value = trim(value);
    if (value.length === 0) {
        return 1;
    } else {
        var regex = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/;
        if (!value.match(regex)) {
            return 2;
        } else {

            var dateArray = value.split('/');
            var day = dateArray[0];
            var month = dateArray[1] - 1; // Javascript consider months in the range 0 - 11
            var year = dateArray[2];
            var sourceDate = new Date(year, month, day);
            //alert("day: " + day + "; month: " + month + "; year: " + year);
            if ((year !== sourceDate.getFullYear())
                    || (month !== sourceDate.getMonth())
                    || (day !== sourceDate.getDate())) {
                return 3;
            } else {
                return 0;
            }
        }
    }
}