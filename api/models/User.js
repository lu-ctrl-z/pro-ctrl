/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    //connection: 'mysql',
    tableName: 'm_users',
    attributes: {
        id : {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },
        user_name: {
            type: 'string',
            unique: true,
            required: true,
            maxLength: 45,
            minLength: 3,
        },
        password: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            required: true,
            unique: true,
            maxLength: 60,
            minLength: 4
        },
        member_type: {
            type: 'integer',
            required: true,
            in: [1,2,3,4,5,6]
        },
        auth_type: {
            type: 'integer',
            required: false,
            defaultsTo: 1
        }
    },
    getLoginAdmin: function($username, $password, cb) {
        var data = User.findOne({
            or : [
                    { user_name: $username },
                    { email: $username }
                  ]
        }, function(err, usr) {
            if (err) {
                cb({flag: false, message: 'DB Error!'});
            } else if(usr) {
                var bcrypt = require('bcrypt-nodejs');
                var i = bcrypt.compare($password, usr.password, function(err, valid) {
                    if(err || !valid) {
                        cb({flag: false, message: 'username và password không đúng, hãy thử lại!'});
                    } else {
                        cb({flag: true, message: 'OK!', user: usr});
                    }
                });
            } else {
                cb({flag: false, message: 'username không đúng, hãy thử lại!'});
            }
        });
        return;
    },
    searchUserNotInProject: function (user_name, email) {
        var query = 'SELECT u.* FROM m_users u ';
        query += ' LIMIT 1';
        var data = [];
        var param = [];
        User.query(query, param, function(err, users) {
            if (err) return console.log(err);
            GLOBAL.data =  users;
            return users;
        });
        return GLOBAL.data;
    },
    findallStudents:function (req,res) {
		var id = req.param('id');
		Student.findOne({stdid:id})
				.then(function(stdData){
						//If no student found
						if(stdData===undefined)
								return res.json({notFound:true});
						// Store Class Data	
						var classData = Classroom.findOne({classid:stdData.classroom})
												 .then(function(classData){

												 		var new_data = classData;
												 				delete new_data.createdAt;
												 				delete new_data.updatedAt;
												 		return new_data;

												 });
						var std_data = Student.find({classroom:stdData.classroom})
											  .then(function(allData){
														var new_data = allData;
												 				delete new_data.createdAt;
												 				delete new_data.updatedAt;
												 		return new_data;
											  });
						return [classData,std_data];					  	
				})
				.spread(function(classData,stdData){

					var newJson = {};
						newJson.classname = classData.name;
						newJson.students = stdData;
					return res.json({notFound:false, data:newJson});
				})
				.fail(function(err){
					console.log(err);
					res.json({notFound:true,error:err});
				});

	}
};

