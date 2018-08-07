//script para definição de tarefas do "gulp" para transpilação do projeto em typescript pra javascript es6

const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', ['static'], () => { // task 'scripts' dependen da task 'static'
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('dist'));
});

gulp.task('static', ['clean'], () =>  gulp.src(['src/**/*.json']).pipe(gulp.dest('dist'))); // task 'static' dependen da task 'clean'

gulp.task('clean', () =>  gulp.src('dist').pipe(clean()));

gulp.task('build', ['scripts']);

gulp.task('watch', ['build'], () => gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['build']));

gulp.task('default', ['watch']);