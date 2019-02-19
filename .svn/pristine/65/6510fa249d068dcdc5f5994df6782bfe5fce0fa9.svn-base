angular.module('Journal.AlbumViewController', [])
    .controller('AlbumViewController', ['$scope', '$routeParams', 'albumProvider', '$location', '$http', 
        function ($scope, $routeParams, albumProvider, $location, $http) {
            $scope.Total = 0;
            $scope.itemsPerPage = 20;
            $scope.CurrentPage = 1;

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
            var isVideo = $scope.selectedResource.OriginalFileName.toLowerCase().indexOf('.mov') >= 0;
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
        
    }]);