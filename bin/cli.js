#!/usr/bin/env node

var optimist = require("optimist"),
    colors = require('colors'),
    fs = require('fs-extra'),
    path = require('path'),
    tmaker = require('../lib');


/** ======================================
 *  Program Start
 * ======================================= */
var opt = optimist.usage('Usage: tmaker -d dest [-t templateFile] [-vh] files')
    .boolean('v')
    .alias('v', 'verbose')
    .describe('verbose', 'show verbose log')
    .alias('d', 'dest')
    .describe('dest', 'destination for tutorials')
    .alias('t', 'templateFile')
    .describe('templateFile', 'templateFile that used to generate tutorials')
    .describe('exampleDir', 'directory in tutorials to store examples, default is "examples"')
    .alias('h', 'help')
    .describe('help', 'Show help')
    .demand(['d']),
    argv = opt.argv;


if (argv.help) {
    opt.help();
    process.exit();
}


if (!argv.verbose) {
    console.log = function() {};
}

if (!argv._.length) {
    console.error("Please provide a input file".red);
    process.exit(1);
}



if (!argv.dest) {
    console.error('A destination must be provided.'.red);
    process.exit(1);
}


if (argv.templateFile && !/\.jade$/.test(argv.templateFile)) {
    console.error('TemplateFile must be jade');
    process.exit(1);
}

if (!argv.templateFile) {
    console.warn('Will use default template file'.yellow);
}

var inputFiles = argv._,
    output = "";


tmaker(inputFiles, {
    dest: argv.dest,
    exampleDir: argv.exampleDir,
    templateFile: argv.templateFile && path.resolve(process.cwd(), argv.templateFile)
}, function(err) {
    if (err) {
        console.error(err.toString().red);
        process.exit(1);
    }

    console.log('done!'.green);
});