/*global module:false*/
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var CONFIG = {
    dirs : {
      app : 'app',
      dist : 'dist',
      tmp : '.tmp'
    }
  };

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    config : CONFIG,
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.authors.join(",") %>;\n' +
      '* Licensed <%= pkg.license %> */\n',
    // Task configuration.
    clean: {
      tmp: {
        src: ['<%= config.dirs.tmp %>']
      },
      dist : {
        src: ['<%= config.dirs.dist %>/**/*','!<%= config.dirs.dist %>/.git']
      }
    },
    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      tmp : {
        files: [{
          expand: true,
          cwd: '<%= config.dirs.app %>/js',
          src: '*.js',
          dest: '<%= config.dirs.tmp %>/js'
        }]
      },
      ngComponents : {
        files : [{
            expand: true,
            cwd: '<%= config.dirs.app %>/components',
            src: ['angular*/**/*.js','!angular*/**/*.min.js',
              '!**/Gruntfile.js','!**/*.conf.js','!**/*spec.js','!**/lib/**/*'],
            dest: '<%= config.dirs.tmp %>/components'
        }]
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= config.dirs.app %>/index.html',
      options: {
        dest: '<%= config.dirs.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: []
            },
            post: {}
          }
        }
      }
    },
    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= config.dirs.dist %>/{,*/}*.html'],
      css: ['<%= config.dirs.dist %>/css/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= config.dirs.dist %>','<%= config.dirs.dist %>/img']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dirs.dist %>/js/{,*/}*.js',
            '<%= config.dirs.dist %>/css/{,*/}*.css',
            '<%= config.dirs.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.dirs.app %>/css/',
          src: '{,*/}*.css',
          dest: '<%= config.dirs.dist %>/css/'
        }]
      }
    },
    // Copies remaining files to places other tasks can use
    uglify : {
      options : {
        banner : '<%= banner %>'
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.dirs.app %>',
          dest: '<%= config.dirs.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'partials/{,*/}*.html',
            'templates/{,*/}*.html',
            'img/{,*/}*.{webp}',
            'fonts/**/*',
            'components/**/*.{css,png,jpg,jpeg,gif,webp,svg,ttf,svg,eot,woff}'
          ]
        }]
      }
    },
    buildcontrol : {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: '<%= pkg.repository.url %>',
          branch: 'gh-pages'
        }
      }
    }
});

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'autoprefixer',
    'ngmin',
    'concat',
    'copy:dist',
    'uglify',
    'rev',
    'usemin',
    'clean:tmp'
  ]);


  // Default task.
  grunt.registerTask('default', ['build']);

  grunt.registerTask('release', ['build','buildcontrol']);

};
