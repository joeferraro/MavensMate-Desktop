var path = require('path');
var modclean = require('modclean');

var MC = new modclean.ModClean({
    // Define a custom path
    cwd: path.resolve(process.cwd(), 'app/node_modules'),
    // Only delete patterns.safe patterns along with html and png files
    patterns: [modclean.patterns.safe, '!binding.gyp']
});

// Run the cleanup process without using the 'clean' function
MC._find(null, function(err, files) {
    if(err) return console.error('Error while searching for files', err);

    MC._process(files, function(err, results) {
        if(err) return console.error('Error while processing files', err);

        console.log('Deleted Files Total:', results.length);
    });
});