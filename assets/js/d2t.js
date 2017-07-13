/**
 * Update Ajax.
 * Can loai bo tham so callback.
 * @param areaId ID vung DIV cap nhat
 * @param actionUrl Xau URL
 * @param formData Tham so gui len server
 * @param callback Ham goi khi thuc hien thanh cong
 * @author HoangCH
 */
function tctUpdateAjax(areaId, actionUrl, formData, callback) {
    try {
        tctInitProgress();
        formData = (formData === undefined) ? tctGetToken() : formData + tctGetToken();
        if ((callback !== null) && (callback !== undefined)) {
            actionUrl += "&callback=" + callback;
        }
        jQuery.ajax({
            type: "POST",
            url: actionUrl,
            data: formData,
            cache: false,
            success: function(html) {
                tctResetProgress();
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
function tctInitProgress() {
    $("#processingContainer").show();
}

/**
 * An anh loading.
 */
function tctResetProgress() {
    $("#processingContainer").hide();
}