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
        src: '<%= pkg.name %>.js',
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
        files: '<%= pkg.name %>.js',
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
        src: "<%= pkg.name %>.js",
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
      src: "<%= pkg.name %>.js",
      options: {
        output: 'docs'
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        banner: '// <%= pkg.name %>.js <%= pkg.version %>\n' +
                '// https://github.com/wrapp/validate.js\n' +
                '// (c) 2013 Wrapp\n' +
                '// <%= pkg.name %>.js may be freely distributed under the MIT license.\n'
      },
      dist: {
        src: "<%= pkg.name %>.js",
        dest: "<%= pkg.name %>.min.js",
        options: {
          sourceMap: '<%= pkg.name %>.min.map'
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
