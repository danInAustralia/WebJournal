﻿angular.module('Journal.AlbumViewController', [])
    .controller('AlbumViewController', ['$scope', '$routeParams', 'albumProvider', '$location', '$http', 'localStorageService',
        function ($scope, $routeParams, albumProvider, $location, $http, localStorageService) {
            $scope.Total = 0;
            $scope.itemsPerPage = 20;
            $scope.CurrentPage = 1;

            var authData = localStorageService.get('authorizationData');
            $scope.token = authData.token;

            albumProvider.getAlbum($routeParams.id, function (err, album) {
                if (err) {
                    if (err.error == "not_found")
                        $scope.page_load_error = "No such album. Are you calling this right?";
                    else
                        $scope.page_load_error = "Unexpected error loading albums: " + err.message;
                } else {
                    $scope.album = album;
                    //update view resources
                    albumProvider.getAlbumResources($routeParams.id, $scope.CurrentPage, function (err, resources) {
                        $scope.resources = resources.Resources;
                        $scope.Total = resources.Total;
                        $scope.itemsPerPage = 20;
                        $scope.CurrentPage = 1;
                    });
                }
            });

            //test for autocomplete
            $scope.searchText = "";
            $scope.selectedOption = {};
            $scope.options = [
                { Key: "1", Value: "One" },
                { Key: "2", Value: "Two" },
                { Key: "3", Value: "Three" },
            ]

            $scope.simpleProducts = [
                "HD Video Player",
                ];
            $scope.tagOptions = {
                acceptCustomValue: true,
                bindingOptions: {
                    items: "simpleProducts"
                },
                onCustomItemCreating: function (args) {
                    var newValue = args.text;
                    $scope.simpleProducts.unshift(newValue);
                    return newValue;
                }
            };
        //$scope.album_name = $routeParams.album_name;
        $scope.page_load_error = "";

        $scope.init = function (albumName) {
            $scope.visiblePopup = false;

        }

        $scope.pageChanged = function () {
            albumProvider.getAlbumResources($scope.AlbumName, $scope.CurrentPage, function (err, resources) {
                $scope.resources = resources.Resources;
                $scope.Total = resources.Total;
            });

        };

        $scope.popupOptions = {
            width: 1100,
            height: 800,
            showTitle: true,
            title: "Information",
            dragEnabled: false,
            closeOnOutsideClick: true,
            bindingOptions: {
                visible: "visiblePopup",
            }
        };

        $scope.GetSelectedResource = function()
        {
            return $scope.selectedResource.Md5;
        }

        $scope.IsSelectedResourceAVideo = function()
        {
            var originalFileName = $scope.selectedResource.OriginalFileName.toLowerCase();
            var index = originalFileName.indexOf('.mov') >= 0 || originalFileName.indexOf('.mp4') >= 0 || originalFileName.indexOf('.avi');
            var isVideo = index > 0;
            return isVideo;
        }

        $scope.showResourcePopup = function(resource)
        {
            $scope.selectedResource = resource;
            $scope.visiblePopup = true;
        }

            //$scope.AlbumResources = function(page)
        $scope.downloadResource = function(md5, originalFileName){
            $http.get('/api/Resources/' + md5,
                { responseType: 'arraybuffer'})
                .then(function (response) {
                    var blob = new Blob([response.data], { type: 'application/octet-stream' });
                    saveAs(blob, originalFileName);
                },
                function (response) {

                });
        }

        //$scope.$on('vjsVideoReady', function (e, data) {
        //    //Here your view content is fully loaded !!

        //    var player = videojs('embeddedPlayer');
        //    var _beforeRequest = videojs.Hls.xhr.beforeRequest;
        //    videojs.Hls.xhr.beforeRequest = function (options) {
        //        if (_.isFunction(_beforeRequest)) {
        //            options = _beforeRequest(options);
        //        }
        //        var authData = localStorageService.get('authorizationData');
        //        if (authData.token) {
        //            options.headers = options.headers || {};
        //            options.headers.Authorization = 'Bearer ' + authData.token;
        //        }
        //        return options;
        //    };
        //});
        
    }]);