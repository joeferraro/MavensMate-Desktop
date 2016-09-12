var path = require('path');
var fs = require('fs-extra');

fs.copySync(path.resolve(__dirname, '..', 'src/main/lib'), path.resolve(__dirname, '..', 'app', 'lib'));
fs.copySync(path.resolve(__dirname, '..', 'src/main/resources'), path.resolve(__dirname, '..', 'app', 'resources'));
fs.copySync(path.resolve(__dirname, '..', 'src/main/index.js'), path.resolve(__dirname, '..', 'app', 'index.js'));
fs.copySync(path.resolve(__dirname, '..', 'src/main/index.html'), path.resolve(__dirname, '..', 'app', 'index.html'));