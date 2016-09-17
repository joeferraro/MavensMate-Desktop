var path = require('path');
var modclean = require('modclean');

var MC = new modclean.ModClean({
    // Define a custom path
    cwd: path.resolve(process.cwd(), 'app/node_modules'),
    // Only delete patterns.safe patterns along with html and png files
    patterns: [
        "build",
        "readme*",
        ".npmignore",
        "*license*",
        "*licence*",
        "history.md",
        "history.markdown",
        "history",
        ".gitattributes",
        ".gitmodules",
        ".travis.yml",
        "contributing*",
        "component.json",
        "composer.json",
        "makefile*",
        "gemfile*",
        "rakefile*",
        ".coveralls.yml",
        "example*",
        "changelog*",
        "changes",
        ".jshintrc",
        "bower.json",
        "*appveyor.yml",
        "*.log",
        "*.tlog",
        "*.patch",
        "*.sln",
        "*.pdb",
        "*.vcxproj*",
        ".gitignore",
        ".sauce-labs*",
        ".vimrc*",
        ".idea",
        "examples",
        "samples",
        "test",
        "tests",
        "draft-00",
        "draft-01",
        "draft-02",
        "draft-03",
        "draft-04",
        ".eslintrc",
        ".jamignore",
        ".jscsrc",
        "*.todo",
        "*.md",
        "*.markdown",
        "*.map",
        "contributors",
        "*.orig",
        "*.rej",
        ".zuul.yml",
        ".editorconfig",
        ".npmrc",
        ".jshintignore",
        ".eslintignore",
        ".lint",
        ".lintignore",
        "cakefile",
        ".istanbul.yml",
        "authors",
        "hyper-schema",
        "mocha.opts",
        ".gradle",
        ".tern-port",
        ".gitkeep",
        ".dntrc",
        "*.watchr",
        ".jsbeautifyrc",
        "cname",
        "screenshots",
        ".dir-locals.el",
        "jsl.conf",
        "jsstyle",
        "benchmark",
        "dockerfile",
        "*.nuspec",
        "*.csproj",
        "thumbs.db",
        ".ds_store",
        "desktop.ini",
        "npm-debug.log",
        "wercker.yml"
    ]
});

// Run the cleanup process without using the 'clean' function
MC._find(null, function(err, files) {
    if(err) return console.error('Error while searching for files', err);

    MC._process(files, function(err, results) {
        if(err) return console.error('Error while processing files', err);

        console.log('Deleted Files Total:', results.length);
    });
});