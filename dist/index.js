"use strict";
const gutil = require("gulp-util");
const through = require("through2");
const path = require("path");
const guidestyle_1 = require("guidestyle");
function default_1(options) {
    options = options || {};
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        if (file.isStream()) {
            callback(new gutil.PluginError('gulp-guidestyle', 'Streaming not supported'));
            return;
        }
        let analyzer = new guidestyle_1.Analyzer(options);
        new guidestyle_1.Analyzer(options).analyzeString(file.contents.toString(), path.extname(file.path).substring(1))
            .then(styleguide => {
            var basename = path.basename(file.path), stylename = basename.substr(0, basename.length - path.extname(basename).length);
            var styleFile = file.clone();
            styleFile.path = path.join(file.base, stylename + ".json");
            styleFile.contents = Buffer.from(styleguide.stringify());
            callback(null, styleFile);
        })
            .catch(err => callback(new gutil.PluginError("gulp-guidestyle", err), null));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
//# sourceMappingURL=index.js.map