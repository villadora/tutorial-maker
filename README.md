# Tutorial Maker

Tutorial Maker helps you to generate a tutorial page from example html file.

The default template will show like this
![](./examples/capture.png =100x130)


## Install


   npm install -g tutorial-maker

## Usage

### In command line

    tmaker -d dest/folder -t templateFile.jade example1.html example2.html

See help information:

    tmaker -h


### Use as api

    var tmaker = require('tutorial-maker');
    tmaker(['example1.html', 'example2.html', ...], {
        dest: 'dest/folder',
        tempalteFile: 'template/file',
        // or 
        template: 'template content',
        exampleDir: 'folder/to/put/examples',
        // you can add following 2 functions to custom the generate process
        compiler: function(data, template) {
            // custom compiler function
        },
        analyze: function(exampleContent, callback) {
            // parse data from exampleContent
            callback(err, data);
        }
    }, function(err) {

    });


## License

(The BSD License)

    Copyright (c) 2013, Villa.Gao <jky239@gmail.com>;
    All rights reserved.

