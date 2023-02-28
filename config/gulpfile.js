const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge2 = require('merge2');
const babel = require('gulp-babel')
const through2 = require('through2');
const tsConfig = require('../tsconfig.base.json').compilerOptions; // @Note: 要使用严格 JSON 格式，否则会报错
const babelConfig = require('../babel.config.js');

const sourceFiles = ['../src/**/*.ts', '!node_modules/**/*.*'];
const esDir = path.resolve(__dirname, '../es')
const libDir = path.resolve(__dirname, '../lib')
const baseDir = path.resolve(__dirname, '../src')
gulp.task('tsc', function () {
    return compileTs(gulp.src(sourceFiles, {
      base: baseDir,
    }))
});

function compileTs(stream) {
    const tsResult = stream
      .pipe(ts(tsConfig))
    
    const tsFileStream = tsResult
      .js.pipe(
        through2.obj(function (file, encoding, next) {
          file.contents = new Buffer(file.contents.toString().replace(/(@chj\/k2-toolkit-\w*)\/src/, '$1/es'))
          this.push(file);
          next();
        })
      )
      .pipe(gulp.dest(esDir));
    const tsd = tsResult.dts.pipe(gulp.dest(esDir));
    return merge2([tsFileStream, tsd])
}

gulp.task('babel', function () {
  return compileEs(gulp.src(sourceFiles, {
    base: baseDir,
  }))
});
function compileEs(stream) {
    return stream
      .pipe(babel(babelConfig))
      .pipe(
        through2.obj(function (file, encoding, next) {
          file.contents = new Buffer(file.contents.toString().replace(/(@chj\/k2-toolkit-\w*)\/src/, '$1/lib'))
          this.push(file);
          next();
        })
      )
      .pipe(gulp.dest(libDir));
}

gulp.task('default', gulp.parallel(['tsc', 'babel']))