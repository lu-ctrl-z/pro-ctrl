/**
 * System.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    connection: 'mysql',
    tableName : 'sys_cat',
    attributes : {
        id : {
            type : 'integer',
            autoIncrement : true,
            primaryKey : true
        },
        sys_cat_type : {
            type : 'integer',
            required : true,
        },
        name : {
            type : 'string',
        },
        com_cd : {
            type: 'integer',
        },
        is_default : {
            type : 'boolean',
            defaultTo: false,
        },
        order: {
            type: 'integer',
            required : true,
        },
        is_system: {
            type : 'boolean',
            defaultTo: false,
        }
    },
    getByType: function(type, com_cd, cb) {
        var $cond = {
                    sys_cat_type: type ,
                    or : [ {
                      com_cd: com_cd
                      }, {
                      is_system : true
                    }] };
        this.find($cond).sort('order ASC').exec(cb);
    },
};
