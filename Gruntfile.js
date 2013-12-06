module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      spec: {
        src: 'spec/**/*.js',
        options: {
          ignores: ['spec/vendor/**/*.js'],
          laxcomma: true
        }
      },
      validate: {
        src: '<%= pkg.name %>',
        options: {
          laxcomma: true
        }
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          atBegin: true
        }
      },
      validate: {
        files: '<%= pkg.name %>',
        tasks: ['jshint:validate', 'jasmine:specs'],
        options: {
          atBegin: true
        }
      },
      test: {
        files: 'spec/**/*.js',
        tasks: ['jshint:spec', 'jasmine:specs'],
        options: {
          atBegin: true
        }
      }
    },
    jasmine: {
      specs: {
        src: "<%= pkg.name %>",
        options: {
          vendor: "spec/vendor/**/*.js",
          specs: "spec/**/*-spec.js",
          helpers: "spec/helpers.js",
          outfile: 'tests.html',
          keepRunner: true,
        }
      },
      coverage: {
        src: "<%= jasmine.specs.src %>",
        options: {
          vendor: "<%= jasmine.specs.options.vendor %>",
          specs: "<%= jasmine.specs.options.specs %>",
          helpers: "<%= jasmine.specs.options.helpers %>",
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'coverage.json',
            report: [{
              type: 'text-summary'
            }, {
              type: 'lcovonly'
            }, {
              type: 'html',
              options: {
                dir: 'coverage'
              }
            }],
            thresholds: {
              lines: 75,
              statements: 75,
              branches: 75,
              functions: 90
            }
          }
        }
      }
    },
    docco: {
      src: "<%= pkg.name %>",
      options: {
        output: 'docs'
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        banner: '// <%= pkg.name %> <%= pkg.version %>\n' +
                '// http://validatejs.org/\n' +
                '// (c) 2013 Wrapp\n' +
                '// <%= pkg.name %> may be freely distributed under the MIT license.\n'
      },
      dist: {
        src: "<%= pkg.name %>",
        dest: "validate.min.js",
        options: {
          sourceMap: 'validate.min.map'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('default', 'watch');
  grunt.registerTask('build', ['jshint:validate', 'jasmine:specs', 'uglify', 'docco']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
};
