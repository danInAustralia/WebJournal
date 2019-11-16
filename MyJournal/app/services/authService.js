angular.module('Journal.authService', [])
    .factory('authService', ['$http', '$q', '$location', 'localStorageService', function ($http, $q, $location, localStorageService) {

        var serviceBase = $location.protocol()+'://' + $location.host() + ':' + $location.port() + '/';//'https://localhost:44309/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            nickName: ""
        };

        var register = function (registration) {

            _logOut();

            return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                return response;
            });

        };

        var _login = function (loginData) {
            console.log("servicebase = " + serviceBase);

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (response) {

                    localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName });

                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    _authentication.nickName = response.data.NickName;

                    deferred.resolve(response);

                },
                    function (response) {
                        _logOut();
                        deferred.reject(response);
                    });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";

        };

        var sendResetPasswordEmail = function (emailAddress) {
            var deferred = $q.defer();
            $http.post('/api/Account/ForgotPassword/', { Email: emailAddress })
                .then(function (response) {

                    //localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName });

                    //_authentication.isAuth = true;
                    //_authentication.userName = loginData.userName;

                    deferred.resolve(response);

                },
                    function (response) {
                        //_logOut();
                        deferred.reject(response);
                });
            return deferred.promise;
        };

        var setPassword = function (userID, key, password) {
            var deferred = $q.defer();
            $http.post('/api/Account/ForgotPassword/', { Email: emailAddress })
                .then(function (response) {

                    //localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName });

                    //_authentication.isAuth = true;
                    //_authentication.userName = loginData.userName;

                    deferred.resolve(response);

                },
                    function (response) {
                        //_logOut();
                        deferred.reject(response);
                    });
            return deferred.promise;
        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            }

        }

        authServiceFactory.register = register;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.sendResetPasswordEmail = sendResetPasswordEmail;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }]);