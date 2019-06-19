angular.module('Journal.checkEmailController', [])
    .controller('checkEmailController', ['$scope', '$location', 'authService', '$http', '$routeParams', 'authService',
        function ($scope, $location, authService, $http, $routeParams, authService) {

            var userId = $routeParams.email;

            authService.sendResetPasswordEmail(userId).then(function (response) {
                console.log("Email sent");
                //$location.path('/albums');

                },
                function (err) {
                    $scope.message = err.data.error_description;
            });



        }]);