'use strict';

var reactTools = require('react-tools');

module.exports = function (options) {

    options.ext = options.ext || 'jsx';

    return function (data, args, callback) {
    	try {
    		var result = reactTools.transform(data.toString('utf8'));
    		callback(null, result);
    	} catch (err) {
    		callback(err);
    	}
	};

};