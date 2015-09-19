module.exports = {
    jscs: {
        src: [
            'gulp/**/*.js',
            '*.js',
            '{app,test}/**/*.js',

            // exclusion
            '!**/node_modules/**'
        ],
        options: require('../config/jscs')
    },
    eslint: {
        src: [
            'gulp/**/*.js',
            '*.js',
            '{app,test}/**/*.js',

            // exclusion
            '!**/node_modules/**'
        ],
        options: require('../config/eslint')
    },
    jshint: {
        src: [
            '*.json',
            '{app,test}/**/*.json',

            // exclusion
            '!**/node_modules/**'
        ],
        options: require('../config/jshint')
    }
};
