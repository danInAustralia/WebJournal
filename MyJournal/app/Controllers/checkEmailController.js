angular.module('Journal.checkEmailController', [])
    .controller('checkEmailController', ['$scope', '$location', 'authService', '$http', '$routeParams',
        function ($scope, $location, authService, $http, $routeParams) {

            var userId = $routeParams.email;
            //var token = $routeParams.token;

            //$scope.loginData = {
            //    userName: "",
            //    password: ""
            //};

            //$scope.message = "";

            //$scope.register = function () {

            //    authService.login($scope.loginData).then(function (response) {

            //        $location.path('/albums');

            //    },
            //        function (err) {
            //            $scope.message = err.data.error_description;
            //        });
            //};



        }]);