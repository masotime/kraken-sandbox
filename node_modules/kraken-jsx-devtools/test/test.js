var assert = require('assert'),
	chai = require('chai'),
	fs = require('fs'),
	should = chai.should(),
	jsxDev = require('../index'),
	path = require('path');

describe('kraken-jsx-devtools', function() {

	it('should correctly compile a JSX snippet', function simpleCompile(done) {
		var middleware = jsxDev({});
		var sourcePath = path.join(process.cwd(), 'test', 'files', 'fieldwidget.jsx');
		var targetPath = path.join(process.cwd(), 'test', 'files', 'fieldwidget.js');

		fs.readFile(sourcePath, 'utf8', function(err, jsx) {
			if (err) {
				return done(err);
			} else {
				fs.readFile(targetPath, 'utf8', function(err, js) {
					if (err) {
						return done(err);
					} else {
						middleware(jsx, null, function(err, compiled) {
							if (err) {
								return done(err);
							} else {
								compiled.should.equal(js);
								done();
							}
						});
					}

				})
			}
		});

	});
	
});