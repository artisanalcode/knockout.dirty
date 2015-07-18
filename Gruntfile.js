module.exports = function (grunt) {
    "use strict";
    /***
     * For more info about Gruntfile optimizations:
     * @see http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/
     */
    require("load-grunt-tasks")(grunt);


    grunt.initConfig({
        /***
         * @see http://gruntjs.com/configuring-tasks#importing-external-data
         */
        cfg: grunt.file.readJSON('config.json'),
        /***
         * @see https://github.com/gruntjs/grunt-contrib-jshint
         * @see http://jshint.com/docs/
         */
        jshint: {
            files: ["Gruntfile.js", "<%= cfg.src_dir %>/**/*.js", "<%= cfg.tst_dir %>/suite.js"],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        /**
         * @see https://github.com/bebraw/grunt-umd
         * @see https://github.com/umdjs/umd
         */
        umd: {
            default: {
                src            : "<%= cfg.src_dir %>/<%= cfg.pkg.name %>.js",
                dest           : "<%= cfg.dis_dir %>/<%= cfg.pkg.name %>.js",
                template       : "<%= cfg.umd.dir %>/<%= cfg.umd.src %>",
                globalAlias    : "ko",
                indent         : 4,
                deps: {
                    "default" : ["ko"],
                    "amd"     : ["knockout"],
                    "global"  : ["ko"]
                }
            }
        },
        /**
         * @see https://github.com/gruntjs/grunt-contrib-qunit
         * @see https://qunitjs.com/
         */
        qunit: {
            all: {
                options: {
                    urls : ["<%= cfg.connect.url %>/<%= cfg.tst_dir %>/runner.html"]
                }
            }
        },
        /**
         * @see http://geekdave.com/2013/07/20/code-coverage-enforcement-for-qunit-using-grunt-and-blanket/
         * @see https://github.com/ModelN/grunt-blanket-qunit
         * @see http://blanketjs.org/-
         */
        blanket_qunit: {
            all : {
                options: {
                    urls: ["<%= cfg.connect.url %>/<%= cfg.tst_dir %>/runner.html?coverage=true&gruntReport"],
                    threshold: 100
                }
            }
        },
        /**
         * Used to run unit tests and coverage
         * @see https://github.com/gruntjs/grunt-contrib-qunit
         * @see https://github.com/gruntjs/grunt-contrib-connect
         */
        connect: {
            options: {
                port: 8080,
                base: '.'
            },
            "browser": {
                options: {
                    keepalive: true,
                }
            },
            "headless": {
                options: {
                    keepalive: false,
                }
            },
        },
        /**
         * @see https://github.com/gruntjs/grunt-contrib-uglify
         */
        uglify: {
            all: {
                files : {
                    "<%= cfg.dis_dir %>/<%= cfg.pkg.name %>.min.js" : ["<%= cfg.dis_dir %>/<%= cfg.pkg.name %>.js"]
                }
            }
        }
    });

    /***
     * By creating a task for "coverage" and one for unit tests we can run the tests but not coverage.
     * Instrumentation in coverage, plus unwritten unit tests while developing make executing
     * "coverage" impractical on "watch".
     */
    // Unit tests
    grunt.registerTask("test-headless", ["connect:headless", "qunit"]);
    grunt.registerTask("test-browse", ["connect:browser", "qunit"]);
    // Coverage
    grunt.registerTask("coverage-headless", ["connect:headless", "blanket_qunit"]);
    grunt.registerTask("coverage-browser", ["connect:browser", "blanket_qunit"]);
    // Compile
    grunt.registerTask("compile", ["jshint", "umd", "coverage-headless", "uglify"]);
};