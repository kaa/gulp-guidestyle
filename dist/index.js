"use strict";
const gutil = require('gulp-util');
const through = require('through2');
const guidestyle_1 = require('guidestyle');
class Options {
}
exports.Options = Options;
function default_1(fileName, options) {
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        if (file.isStream()) {
            callback(new gutil.PluginError('gulp-guidestyle', 'Streaming not supported'));
            return;
        }
        let analyzer = new guidestyle_1.Analyzer();
        analyzer.analyze(file.basename, options.syntax)
            .catch(err => callback(err, null))
            .then(styleguide => {
            var styleFile = file.clone({ contents: false });
            styleFile.extname = ".json";
            styleFile.contents = new Buffer(JSON.stringify(styleguide, null, 2));
            callback(null, styleFile);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=index.js.map