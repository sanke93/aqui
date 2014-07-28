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

        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);

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
        $scope.sideMenuController.toggleRight();
    };
});
