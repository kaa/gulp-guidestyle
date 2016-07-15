import * as gutil from 'gulp-util'
import * as through from 'through2'
import { Analyzer } from 'guidestyle'

export class Options {
  syntax: string
}
export default function(fileName: string, options: Options) {
  return through.obj(function(file:gutil.File, encoding: string, callback: (err?: Error, data?: gutil.File) => void): void {

		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new gutil.PluginError('gulp-guidestyle', 'Streaming not supported'));
			return;
		}

    let analyzer = new Analyzer();
    analyzer.analyze(file.basename, options.syntax)
      .catch(err => callback(err, null))
      .then(styleguide => {
        var styleFile = file.clone({contents: false});
        styleFile.basename = fileName || "styleguide.json";
        styleFile.contents = new Buffer(JSON.stringify(styleguide, null, 2));
        callback(null, styleFile);
      })
  });
};