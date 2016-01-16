require("babel-polyfill");

/**
 * Configure babel using the require hook
 * More details here: https://babeljs.io/docs/setup/#babel_register
 */
require("babel-core/register")({
    only: /src/,
    presets: ["es2015", "react", "stage-0"]
});

var fs = require('fs');

try {
    fs.accessSync(`.env.${process.env.NODE_ENV}`, fs.F_OK);
    require('dotenv').load({path:`.env.${process.env.NODE_ENV}`});
} catch (e) {
    require('dotenv').load({path:'.env'});
}

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;

if (process.env.NODE_ENV !== "production") {
    if (!require("piping")({hook: true, includeModules: false})) {
        return;
    }
}

try {
    require("./src/server/server");
}
catch (error) {
    console.error(error.stack);
}
