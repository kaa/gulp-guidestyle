import * as gutil from 'gulp-util'
import * as through from 'through2'
import * as path from 'path'
import { Analyzer } from 'guidestyle'

export class Options {
  syntax: string  
}
export default function(options?: Options) {
  options = options || new Options();
  return through.obj(function(file:gutil.File, encoding: string, callback: (err?: Error, data?: gutil.File) => void) {

		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new gutil.PluginError('gulp-guidestyle', 'Streaming not supported'));
			return;
		}

    let analyzer = new Analyzer();
    analyzer.analyze(file.path, options.syntax)
      .catch(err => callback(new gutil.PluginError("gulp-guidestyle", err), null))
      .then(styleguide => {
        var basename = path.basename(file.path),
            stylename = basename.substr(0, basename.length-path.extname(basename).length);
        var styleFile = file.clone();
        styleFile.path = path.join(file.base, stylename+".json");
        styleFile.contents = new Buffer(JSON.stringify(styleguide, null, 2));
        callback(null, styleFile);
      })
  });
};