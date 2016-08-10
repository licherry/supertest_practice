module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'mochawesome', //You need to change this !
                    colors: true,
                    summery: true,
                    captureFile: 'results.html',
                    quiet: false,
                    clearRequireCache: true
                },
                src: ['test/*.js']
            }
        }
    });

    grunt.registerTask('default', 'mochaTest');

};