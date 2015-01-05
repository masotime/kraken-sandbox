/* global require, console */
'use strict';

requirejs.config({
    paths: {
    	react: '../components/react/react',
    	TextField: 'react/textfield',
    	jquery: '../components/jquery/dist/jquery.min'
    }
});


require(['react', 'TextField', 'jquery'], function (React, TextField, $) {

    var app = {
        initialize: function () {

    		var TF = React.createFactory(TextField),
				fruitControl = document.getElementById('fruitControl');

			React.render(TF({
				id: 'fruit',
				value: 'Pineapple',
				label: 'Favorite Fruit',
				placeholder: 'e.g. Pineapple',
				className: 'paypal-input'
			}), fruitControl);
        }
    };

    app.initialize();

});
