angular.module('myApp.service.login', ['firebase', 'myApp.service.firebase'])

    .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef', 'profileCreator', '$timeout', 'syncData',
      function ($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout, syncData) {
        var auth = null;
        return {
          init: function () {
            return auth = $firebaseSimpleLogin(firebaseRef());
          },

          /**
           * @param {string} email
           * @param {string} pass
           * @param {Function} [callback]
           * @returns {*}
           */
          login: function (email, pass, callback) {
            assertAuth();
            auth.$login('password', {
              email: email,
              password: pass,
              rememberMe: true
            }).then(function (user) {
                  if (callback) {
                    //todo-bug https://github.com/firebase/angularFire/issues/199
                    $timeout(function () {
                      callback(null, user);
                    });
                  }
                }, callback);
          },

          loginWith: function (providerName, callback) {
            assertAuth();
            auth
                .$login(providerName)
                .then(function (user) {
                  if (callback) {
                    //todo-bug https://github.com/firebase/angularFire/issues/199
                    $timeout(function () {
                      callback(null, user);
                    });
                  }
                }, callback);
          },

          logout: function () {
            assertAuth();
            var user = syncData(['users', auth.user.uid], 1);
            user.$child('url').$set(null);
            auth.$logout();
          },

          changePassword: function (opts) {
            assertAuth();
            var cb = opts.callback || function () {
            };
            if (!opts.oldpass || !opts.newpass) {
              $timeout(function () {
                cb('Please enter a password');
              });
            }
            else if (opts.newpass !== opts.confirm) {
              $timeout(function () {
                cb('Passwords do not match');
              });
            }
            else {
              auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function () {
                cb && cb(null)
              }, cb);
            }
          },

          createAccount: function (email, pass, callback) {
            assertAuth();
            auth.$createUser(email, pass).then(function (user) {
              callback && callback(null, user)
            }, callback);
          },

          createProfile: profileCreator
        };

        function assertAuth() {
          if (auth === null) {
            throw new Error('Must call loginService.init() before using its methods');
          }
        }
      }])

    .factory('profileCreator', ['firebaseRef', '$timeout', function (firebaseRef, $timeout) {

      return function (id, email, username, callback) {

        var userRef = firebaseRef('users/' + id);

        userRef.child('email').once('value', function (snapshot) {
          var exists = ( snapshot.val() !== null );

          if (exists === false) {

            console.info('user does not exists, create a user profile!');

            userRef.set({email: email, username: username || firstPartOfEmail(email) }, function (err) {
              if (callback) {
                $timeout(function () {
                  callback(err);
                })
              }
            });
          }
        })

        function firstPartOfEmail(email) {
          return ucfirst(email.substr(0, email.indexOf('@')) || '');
        }

        function ucfirst(str) {
          // credits: http://kevin.vanzonneveld.net
          str += '';
          var f = str.charAt(0).toUpperCase();
          return f + str.substr(1);
        }
      }
    }]);
