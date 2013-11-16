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
        tasks: ['jshint:validate', 'jasmine'],
        options: {
          atBegin: true
        }
      },
      test: {
        files: 'spec/**/*.js',
        tasks: ['jshint:spec', 'jasmine'],
        options: {
          atBegin: true
        }
      }
    },
    jasmine: {
      pivotal: {
        src: "<%= pkg.name %>",
        options: {
          vendor: "spec/vendor/**/*.js",
          specs: "spec/**/*-spec.js",
          helpers: "spec/helpers.js",
          outfile: 'tests.html',
          keepRunner: true
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
  grunt.registerTask('build', ['jshint:validate', 'jasmine', 'uglify', 'docco']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
};
