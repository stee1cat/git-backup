/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('./tsconfig.json');
const files = {
    ts: ['src/**/*.ts']
};

gulp.task('default', function () {
    return gulp.src(files.ts)
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch(files.ts, ['default']);
});
