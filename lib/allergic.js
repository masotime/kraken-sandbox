/* global dust */
'use strict';
var stringify = require('json-stringify-safe');

(function (dust) {

	var helpers = {};

	console.log('allergic dust helpers registered');

	helpers.react = function (chunk, context, bodies, param) {
		function log() {
			var args = Array.prototype.slice.apply(arguments);
			args[0] = '>>>>>>>>>> allergic/react.js | ' + args[0];
			console.log.apply(console, args);
		}

		try {
			log('chunk = %s', stringify(chunk,null,4));
			log('context = %s', stringify(context,null,4));
			log('bodies = %s', stringify(bodies,null,4));
			log('param = %s', stringify(param,null,4));
		} catch (e) {
			console.error(e);
		}


		return chunk.write('reaction successful!');

	};

	dust.helpers = helpers;

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);