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