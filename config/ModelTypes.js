module.exports.ModelTypes = {
    email: function(str) {
        if(!str) 
            return true;
        return str.match(/^([a-z0-9_]|\-|\.)+@(([a-z0-9_]|\-)+\.)+[a-z]{2,6}$/i);
    },
    phone: function(str) {
        if(!str) 
            return true;
        return str.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
    },
};