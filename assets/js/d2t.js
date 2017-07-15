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
function d2tProcessReturnMessage(returnCode, msg, callback, extraValue) {
    try {
        d2tUpdateMessage(returnCode, msg, extraValue);
        eval(callback + '(returnCode, extraValue)');
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
                    //case "hidden":
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
 * @author Ta Minh Tuan
 */
function trim(str) {
    str = str.replace(/^\s\s*/, '');
    var ws = /\s/,
            i = str.length;
    while (ws.test(str.charAt(--i)))
        ;
    return str.slice(0, i + 1);
}