var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs-extra');

rimraf.sync(path.resolve(path.dirname(__dirname), 'app'));
fs.copySync(path.resolve(path.dirname(__dirname), 'src/main/lib'), path.resolve(path.dirname(__dirname), 'app', 'lib'));
fs.copySync(path.resolve(path.dirname(__dirname), 'src/main/resources'), path.resolve(path.dirname(__dirname), 'app', 'resources'));
fs.copySync(path.resolve(path.dirname(__dirname), 'src/main/index.js'), path.resolve(path.dirname(__dirname), 'app', 'index.js'));
fs.copySync(path.resolve(path.dirname(__dirname), 'src/main/index.html'), path.resolve(path.dirname(__dirname), 'app', 'index.html'));
fs.copySync(path.resolve(path.dirname(__dirname), 'src/main/package.json'), path.resolve(path.dirname(__dirname), 'app', 'package.json'));