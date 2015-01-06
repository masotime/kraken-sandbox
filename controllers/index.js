'use strict';

module.exports = function (router) {

    router.get('/', function (req, res) {

    	// force locality
    	res.locals.context = {
    		locality: req.query.locale || 'de-DE'
    	};

        res.render('index', { name: 'model-name', helpers: [function () {
        	return 'This is a helper';
        }] });
        
        
    });

};
