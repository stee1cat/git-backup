/**
 * Copyright (c) 2017 Gennadiy Khatuntsev <e.steelcat@gmail.com>
 */

const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('./tsconfig.json');

gulp.task("default", function () {
    return gulp.src(['src/**/*.ts', '!src/types.d.ts'])
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist'));
});
