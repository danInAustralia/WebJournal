angular.module('Journal.registerController', [])
    .controller('registerController', ['$scope', '$location', 'authService',
        function ($scope, $location, authService) {

            $scope.loginData = {
                userName: "",
                password: ""
            };

            $scope.message = "";

            $scope.register = function () {

                authService.login($scope.loginData).then(function (response) {

                    $location.path('/albums');

                },
                    function (err) {
                        $scope.message = err.data.error_description;
                    });
            };



        }]);