angular.module('ionicParseApp.controllers', [])

.controller('WelcomeController', function($scope, $state, $ionicViewService,
                                          $stateParams) {
    if ($stateParams.clear) {
        $ionicViewService.clearHistory();
    }

    $scope.login = function () {
        $state.go('login');
    };

    $scope.signUp = function () {
        $state.go('register');
    };
})

.controller('HomeController', function ($scope) {
    console.log("home controller");
})

.controller('LoginController', function ($scope, $state, $rootScope,
                                         $ionicLoading) {
    $scope.user = {
        username: null,
        password: null
    };

    $scope.error = {};

    $scope.login = function () {
        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = $scope.user;
        Parse.User.logIn(user.username.toLowerCase(), user.password, {
            success: function(user) {
                $scope.loading.hide();
                $rootScope.user = user;
                $state.go('main.home', {clear: true});
            },
            error: function(user, err) {
                $scope.loading.hide();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    $scope.error.message = 'Invalid login credentials';
                } else {
                    $scope.error.message = 'An unexpected error has ' +
                        'occurred, please try again.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.forgot = function () {
        $state.go('forgot');
    };
})

.controller('ForgotPasswordController', function ($scope, $state,
                                                  $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function () {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                // TODO: show success
                $scope.loading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function(err) {
                $scope.loading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function () {
        $state.go('login');
    };
})

.controller('RegisterController', function ($scope, $state, $ionicLoading,
                                            $rootScope) {
    $scope.user = {};
    $scope.error = {};

    $scope.register = function () {

        // TODO: add age verification step
        var defaultLeavingMsg = "I'm leaving."
        var defaultHereMsg = "I'm here."
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.username);
        user.set("password", $scope.user.password);
        // user.set("email", $scope.user.email);
        user.set("leavingMsg", defaultLeavingMsg)
        user.set("hereMsg", defaultHereMsg)


        user.signUp(null, {
            success: function(user) {
                $scope.loading.hide();
                $rootScope.user = user;
                $state.go('main.home', {clear: true});
            },
            error: function(user, error) {
                $scope.loading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    console.log('here', error.message)
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
})

.controller('MainController', function ($scope, $state, $rootScope,
                                        $stateParams, $ionicViewService) {
    if ($stateParams.clear) {
        $ionicViewService.clearHistory();
    }

    $scope.user = $rootScope.user;  

    $scope.rightButtons = [
        {
            type: 'button-positive',
            content: '<i class="icon ion-navicon"></i>',
            tap: function(e) {
                $scope.sideMenuController.toggleRight();
            }
        }
    ];

    $scope.logout = function () {
        Parse.User.logOut();
        $rootScope.user = null;
        $state.go('welcome', {clear: true});
    };

    $scope.toggleMenu = function() {
        console.log('toggling')
        $scope.sideMenuController.toggleRight();
    };

    $scope.here = function(){
        $state.go('friends', {clear: true});
        console.log("got friend");
    }

})


.controller('FriendsController', function ($scope, $state, $rootScope,
                                        $stateParams, $ionicViewService) {
    if ($stateParams.clear) {
        $ionicViewService.clearHistory();
    }

    $scope.user = $rootScope.user;  
    var user = Parse.User.current();
    var relation = user.relation("friends");
    console.log("user:", user);
    relation.query().find({
      success: function(list) {
        $scope.friends = list;
        $scope.$apply();
        console.log("hi", $scope.friends);
      },
      error: function(myObject, error) {
            console.log(myObject, error);
        }
    });
    //$scope.friends1="hi";
    console.log("friends controller");
    //console.log($scope.user.attributes.friends);

    $scope.logout = function () {
        Parse.User.logOut();
        $rootScope.user = null;
        $state.go('welcome', {clear: true});
    };

    $scope.toggleMenu = function() {
        $scope.sideMenuController.toggleRight();
    };
});
