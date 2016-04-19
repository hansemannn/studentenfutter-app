
/**
 *	Performs a password reset
 *	@param {Object} data The form data to be sent
 *	@param {Callback} cb The callback to be invoked after the asyncronous request
 *	@return void
 */
exports.postForgotPassword = function(data, cb) {
	var RequestInstance = require("request");
	var request = new RequestInstance({
		url : "/users/forgot-password",
		type : "POST",
		data: data,
		success : function(json) {
			cb(_.extend({}, {success: true}));
		},
		error : function() {
			cb({success: false});
		}
	});
	request.load();
};