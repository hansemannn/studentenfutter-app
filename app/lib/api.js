
/**
 *	Gets all lunches
 *	@param {Object} data The GET parameter to form the URL
 *	@param {Callback} cb The callback to be invoked after the asyncronous request
 *	@return void
 */
exports.getLunches = function(params, cb) {
	var RequestInstance = require("request");
	var request = new RequestInstance({
		url : "/lunches/list/" + params.date + "/" + params.location,
		type : "GET",
		success : function(json) {
			cb(_.extend(json, {success: true}));
		},
		error : function() {
			cb({success: false});
		}
	});
	request.load();
};