import * as gutil from 'gulp-util'
import * as through from 'through2'
import * as path from 'path'
import { Stream } from 'stream';
import { Analyzer, AnalyzerOptions, AnalyzerContext } from 'guidestyle'

export default function(options?: AnalyzerOptions): Stream  {
  options = options || {};
  return through.obj(function(file:gutil.File, encoding: string, callback: (err?: Error, data?: gutil.File) => void) {

		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new gutil.PluginError('gulp-guidestyle', 'Streaming not supported'));
			return;
		}

    let analyzer = new Analyzer(options);
    new Analyzer(options).analyzeString(file.contents.toString(), path.extname(file.path).substring(1))
      .then(styleguide => {
        var basename = path.basename(file.path),
            stylename = basename.substr(0, basename.length-path.extname(basename).length);
        var styleFile = file.clone();
        styleFile.path = path.join(file.base, stylename+".json");
        styleFile.contents = Buffer.from(styleguide.stringify());
        callback(null, styleFile);
      })
      .catch(err => callback(new gutil.PluginError("gulp-guidestyle", err), null))
  });
};