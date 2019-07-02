angular.module('Journal.resetController', [])
    .controller('resetController', ['$scope', '$location', 'authService', '$http', '$routeParams', 'authService',
        function ($scope, $location, authService, $http, $routeParams, authService) {

            $scope.userId = $routeParams.userID;
            $scope.key = $routeParams.code;
            $scope.password = "";
            $scope.confirmPassword = "";


            $scope.resetPassword = function () {
                if ($scope.password === $scope.confirmPassword) {
                    $scope.message = "";
                    authService.setPassword($scope.userID, $scope.key, $scope.password).then(function (response) {
                        console.log("Email sent");
                        //$location.path('/albums');

                    },
                        function (err) {
                            $scope.message = err.data.error_description;
                        });
                }
                else {
                    $scope.message = "passwords don't match";
                }
            }


        }]);