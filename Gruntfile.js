module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            options: {
                configFile: '.eslintrc.json'
            },
            target: '.'
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'should'
                },
                src: [ 'test/**/*.js' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', [ 'lint', 'mochaTest' ]);

    grunt.registerTask('lint', 'eslint');
    grunt.registerTask('test', 'mochaTest');
};
