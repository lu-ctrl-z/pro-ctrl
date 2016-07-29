module.exports = {
    href: function(uri, params, anchor) {
        var str = uri || "";
        if(params) {
            str += "?";
            var aryParams = [];
            for(var i in params) {
                aryParams.push(i + "=" + encodeURIComponent(params[i]))
            }
            str += aryParams.join("&");
        }
        return str + ( (anchor) ? ("#" + anchor) : "" );
    }
}