# stylelint-checkstyle-exporter

## Usage

```sh
var checkstyle = require('stylelint-checkstyle-exporter');

gulp.task('checkstyle', function () {
    var plugins = [
        cssimport,
        cssmixins,
        stylelint,
        checkstyle
    ];
    return gulp.src(CSS_SOURCES)
        .pipe(postcss(plugins));
});
```