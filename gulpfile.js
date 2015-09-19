var fs = require('fs');
var _ = require('lodash');
var gulp = require('gulp');
var requireDir = require('require-dir');
var pkg = require('./package.json');

// Require all tasks in gulp/tasks, including subfolders
var tasks = requireDir('./gulp/tasks', {recursive: true});

// Get environment, for environment-specific activities
var env = process.env.NODE_ENV || 'development';

_.each(tasks, function(task, relativePath) {
    console.assert(_.isFunction(task), 'gulp/tasks/%s: module\'s export is not a function', relativePath);
    task({
        config: require('./gulp/config'),
        env: env,
        watch: false,
        errorHandler: require('./gulp/error-handler')
    });
});

gulp.task('default', ['build']);
