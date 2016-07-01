/**
 * Duration.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    connection: 'mysql',
    tableName: 't_duration',
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
        },
        task_id: {
            model: 'task',
        },
        user_id: {
            model: 'user',
        },
        status: {
            type: 'integer',
        },
        start_time: {
            type: 'datetime',
        },
        end_time: {
            type: 'datetime',
        }
    },
};