var gulp = require('gulp');
var runSequence = require('run-sequence');

module.exports = function(options) {
    gulp.task('build', function(callback) {
        runSequence(
            ['eslint', 'jscs', 'jshint'],
            callback
        );
    });
};
