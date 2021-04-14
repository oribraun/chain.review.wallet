var fs = require('fs-extra');
const path = require("path");

fs.readdirSync(path.resolve(__dirname, "./"), { withFileTypes: true}).forEach(function(file) {
    console.log('file', file)
    if(file.isDirectory()) {
        var settings = require('./' + file.name + '/settings');
        exports[file.name] = settings;
    }
});
