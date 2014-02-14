var _ = require('lodash'),
    async = require('async'),
    fse = require('fs-extra'),
    path = require('path'),
    colors = require('colors'),
    maker = require('./maker');


module.exports = makeTutorial;

/**
 * @class Options
 * @property {string} dest destination where the tutorial will generates to
 * @property {string} templateFile path of template file
 * @property {string} tempalte the content of template, if a templateFile is specified, templateFile will be used.
 * @property {string} exampleDir where to put example htmls
 * @property {function(Object, string)} compiler compiler function, jade compile as default
 * @property {function(string, function)} analyze a html analyze function with a callback as last argument
 */

/** 
 * @param {Array.<string>} files a group of html files as examples
 * @param {Options} options
 * @param {function} callback
 */
function makeTutorial(files, options, callback) {
    var dest = options.dest,
        templateFile = options.templateFile || path.join(__dirname, 'template.jade'),
        template = options.template;


    var exampleDir = path.join(dest, options.exampleDir || 'examples');

    fse.mkdirs(dest, function(err) {
        if (err) return callback(err);
        fse.mkdirs(exampleDir, function(err) {
            if (err) return callback(err);

            if (files && files.length) {
                var tasks = [];
                files.forEach(function(file) {
                    tasks.push(function(cb) {
                        if (!/\.html$/.test(file))
                            return callback("Example file should be html:" + file);
                        var filename = path.basename(file);
                        maker(fse.readFileSync(file, 'utf8'), {
                            templateFile: templateFile,
                            template: template,
                            iframeURL: path.join(options.exampleDir || 'examples', filename),
                            compiler: options.compiler,
                            analyze: options.analyze
                        }, function(err, output) {
                            if (err) return callback(err);
                            fse.outputFileSync(path.join(dest, filename), output);
                            console.log(('make tutorial file:' + filename).green);
                            fse.copySync(file, path.join(exampleDir, filename));
                            console.log(('copy example:' + path.join(options.exampleDir || 'examples'), filename).green);
                            callback(err);
                        });
                    });
                });

                async.parallel(tasks, function(err, reuslts) {
                    callback(err);
                });
            }
        });
    });
}