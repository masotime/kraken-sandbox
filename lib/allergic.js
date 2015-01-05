/* global dust */
'use strict';
require('node-jsx').install({extension: '.jsx'}); // allows requiring of .jsx files

var stringify = require('json-stringify-safe'),
	React = require('react'),
	path = require('path'),
	VError = require('verror'),
	atom = '\u269b';

function loadComponent(relativePath, componentPath) {
	var resolvedPath;
	!componentPath.match(/\.jsx$/) && (componentPath += '.jsx');
	
	try {
		resolvedPath = path.resolve(process.cwd(), relativePath, componentPath);
		return React.createFactory(require(resolvedPath));
	} catch (e) {
		return new VError(e, 'Unable to load react component at ' + resolvedPath + ' (resolved from '+componentPath+')');
	}

}

function log() {
	var args = Array.prototype.slice.apply(arguments);
	args[0] = '>>>>>>>>>> allergic/react.js | ' + args[0];
	console.log.apply(console, args);
}

function atomMessage(message) {
	return [atom, message, atom].join(' ');
}


(function (dust, options) {

	var componentCache = {},
		helpers = {},
		relativePath = options && options.relativePath || 'public/js/react';

	helpers.react = function (chunk, context, bodies, param) {

		log('chunk = %s', stringify(chunk,null,4));
		log('context = %s', stringify(context,null,4));
		log('bodies = %s', stringify(bodies,null,4));
		log('param = %s', stringify(param,null,4));

		var Component, componentId, reactString;

		// parameter checking
		if (!param.component) {
			console.log(param.component);
			return chunk.write(atomMessage('No component specified'));
		}

		if (!param.componentId) {
			return chunk.write(atomMessage('No componentId specified'));
		}

		// component loading / memoization
		if (param.component in componentCache) {
			Component = componentCache[param.component];
		} else {
			Component = loadComponent(relativePath, param.component);
			if (Component instanceof Error) {
				console.error(Component.stack);
				return chunk.write(atom + ' Could not load component ' + param.component + ' ' + atom);
			} else {
				componentCache[param.component] = Component;
			}
		}

		componentId = param.componentId;

		delete param.container;
		delete param.componentId;

		try {
			reactString = React.renderToString(Component(param));
			reactString = '<div id="'+componentId+'">'+reactString+'</div>';
		} catch(e) {
			console.error(e.stack);
			return chunk.write(atomMessage('Error rendering component - check console'));
		}

		return chunk.write(reactString);

	};

	dust.helpers = helpers;

	console.log('allergic dust helpers registered');

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);