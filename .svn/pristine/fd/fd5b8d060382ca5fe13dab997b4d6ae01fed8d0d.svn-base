var photoApp = angular.module("app", ["Journal.loginController",
    "LocalStorageModule",
    "Journal.authService", 
    "Journal.authInterceptorService",
    "Journal.indexController",
    "Journal.AlbumUploadController", 
    "Journal.AlbumListController", 
    "Journal.AlbumViewController", 
    "Journal.AlbumProvider", 
    "angularFileUpload", 
    "ngMaterial", 
    //"ngAria", 
    "ngRoute", 
    "ui.bootstrap", 
    "dx",
    "angular-loading-bar"]);

photoApp.filter("pluralise", function () {
    return function (count, nouns) {
        if (count == 1) return count + " " + nouns.one;
        else return count + " " + nouns.more;
    }
});

photoApp.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

photoApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: '/app/views/Home/index.html'
    });

    $routeProvider.when('/login', {
        templateUrl: '/app/views/Account/login.html',
        controller: 'loginController'
    });

    $routeProvider.when('/albums', {
        templateUrl: '/app/views/Albums/list.html',
        controller: 'AlbumListController'
    });

    $routeProvider.when('/album/:id', {
        templateUrl: '/app/views/Albums/album.html',
        controller: 'AlbumViewController'
    });

    $routeProvider.when('/ResourceUploader/:id', {
        templateUrl: '/app/views/Albums/upload.html',
        controller: 'AlbumUploadController'
    });

    $routeProvider.otherwise({ redirectTo: "/home" });
}]);

photoApp.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
    $httpProvider.defaults.transformResponse.push(function (responseData) {
        convertDateStringsToDates(responseData);
        return responseData;
    });
}]);

angular.module('app').config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('YYYY-MMM-DD');
    };
});

var regexIso8601 = re = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}

//angular.module('app', ['LabPortal.PendingProjectsController', 'LabPortal.BodyOfWorkController', 'angular-loading-bar', 'ngAnimate'])
//    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
//        cfpLoadingBarProviderparentSelector = '#projectsTable';
//        cfpLoadingBarProvider.includeSpinner = true;
//        cfpLoadingBarProvider.includeBar = true;
//        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
//    }]
//)
//;