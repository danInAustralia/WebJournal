angular.module('Journal.registerController', [])
    .controller('registerController', ['$scope', '$location', 'authService',
        function ($scope, $location, authService) {

            $scope.loginData = {
                email: "",
                firstName: "",
                lastName: "",
                userName: "",
                password: ""
            };

            $scope.message = "";

            $scope.register = function () {

                authService.register($scope.loginData).then(function (response) {

                    $location.path('/albums');

                },
                    function (err) {
                        $scope.message = err.data.Message;
                    });
            };



        }]);