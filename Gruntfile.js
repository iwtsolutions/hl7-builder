module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: [ 'app.js', 'test/**/*.js', 'builders/**/*.js' ],
            options: {
                node: true,
                indent: 4,
                undef: true,
                unused: true,
                curly: true,
                eqeqeq: true,
                mocha: true
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'should'
                },
                src: ['test/**/*.js' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('default', ['jshint', 'mochaTest' ]);
};
