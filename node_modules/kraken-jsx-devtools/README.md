Quick and dirty Kraken devtool for JSX files

# How to use

First, install it as

```
	npm install kraken-jsx-devtools
```

## Kraken 1.x instructions

In your `config/config.json` or other configuration file (maybe `config/development.json`), you should have a middleware defined for devtools. e.g.

```

   "middleware": {
   		...
   		"devtools": {
   			"enabled": true,
   			"priority": 35,
   			"module": {
   				"name": "kraken-devtools",
   				"arguments": {
   					"path:./public",
   					"path:./build",
   					{
   						... /* runtime plugins */
   					}


   				}

   			}

   		}
   }

```

In the `/* runtime plugins */` area above, add a snippet similar to what's shown below:

```
	"jsx": {
		"module": "kraken-jsx-devtools",
		"files": "/js/**/*.js",
		"ext": "jsx"
	}
```

* `"files"` refers to the pattern used when doing a web request (web browser URL).
* `"ext"` is the extension of the files to map, which should usually be .jsx (the uncompiled files you have in your backend / application).

e.g. if you have if your file structure `public/js/jsx/fieldwidget.jsx`, requesting for `public/js/jsx/fieldwidget.js` would automatically compile the JSX file and serve it as pure Javascript.