var jade = require('jade'),
    path = require('path'),
    htmlparser = require('htmlparser'),
    select = require('soupselect').select,
    fse = require('fs-extra');


module.exports = function(content, options, callback) {
    var templateFile = options.templateFile,
        template = options.template;


    if (templateFile) {
        template = fse.readFileSync(templateFile, 'utf8');
    }

    if (!template) {
        return callback("No template or templateFile provided");
    }

    var data = (options.analyze || analyzeHtml)(content, function(err, data) {
        data.iframeURL = options.iframeURL;
        var output = (options.compiler || compile)(data, template);
        callback(null, output);
    });
};

function analyzeHtml(content, callback) {
    var handler = new htmlparser.DefaultHandler(function(err, dom) {
        if (err) {
            return callback(err);
        } else {
            var data = {};
            var title = select(dom, 'title');
            if (title && title.length) {
                if (title[0].children)
                    data.title = title[0].children[0].raw;
            }

            var script = select(dom, 'script'),
                foundExample = false,
                jsContent = "",
                cssContent = "";

            if (script && script.length) {
                script.forEach(function(s) {
                    if (!s.attribs || !s.attribs.src) {
                        if (s.attribs && s.attribs.id == 'example') {
                            jsContent = s.children[0].raw;
                            foundExample = true;
                        }

                        if (!foundExample) {
                            jsContent += "\n" + s.children[0].raw;
                        }
                    }
                });
            }


            var style = select(dom, 'style');
            if (style && style.length) {
                style.forEach(function(s) {
                    cssContent += "\n" + s.children[0].raw;
                });
            }

            if (jsContent) {
                data.jsContent = jsContent;
            }

            if (cssContent) {
                data.cssContent = cssContent;
            }
            console.log(data);
            data.htmlContent = content;

            if (callback) callback(null, data);
        }

    });

    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(content);
}


function compile(data, template) {
    var fn = jade.compile(template, {
        pretty: true
    });

    return fn(data);
}