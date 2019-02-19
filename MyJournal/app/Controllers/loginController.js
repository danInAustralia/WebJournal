angular.module('Journal.loginController', [])
    .controller('loginController', ['$scope', '$location', 'authService',
        function ($scope, $location, authService) {

    $scope.loginData = {
        userName: "",
        password: ""
    };

    $scope.message = "";

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/albums');

        },
         function (err) {
             $scope.message = err.data.error_description;
         });
    };



}]);