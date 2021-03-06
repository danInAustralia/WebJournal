﻿

//(function () {
angular.module('Journal.AlbumListController', [])
//function AlbumListController($scope, albumProvider, $location) {
    .controller('AlbumListController', ['$scope', '$http', 'albumProvider', '$window', function ($scope, $http, albumProvider, $window) {

        $scope.new_album = {};
        $scope.add_error_text = '';
        $scope.page_load_error = "";
        $scope.visiblePopup = false;

        albumProvider.getAlbums(function (err, albums) {
            if (err) {
                $scope.page_load_error = "Unexpected error loading albums: " + err.message;
            } else {
                $scope.Albums = albums;
            }
        });

        $scope.popupOptions = {
            width: 1100,
            height: 400,
            showTitle: true,
            title: "New Album",
            dragEnabled: false,
            closeOnOutsideClick: true,
            bindingOptions: {
                visible: "visiblePopup",
            }
        };

        $scope.showNewAlbumPopup = function()
        {
            $scope.visiblePopup = true;
        }

        $scope.addAlbum = function (album_data) {

            albumProvider.addAlbum(album_data, function (err, results) {
                if (err) {
                    if (err.code == "missing_title")
                        $scope.add_error_text = "Missing title";
                    else if (err.code == "bad_date")
                        $scope.add_error_text = "You must specify a date (yyyy/mm/dd)";
                    else if (err.code == "missing_description")
                        $scope.add_error_text = "Missing description";
                    else if (err.code == "bad_name")
                        $scope.add_error_text = "Short album name must be at least 6 chars (ironic, yes)";
                } else {
                    // looks good!
                    $scope.new_album = {};
                    $scope.add_error_text = '';

                    // now, redirect to load in the album you just created!
                    $window.location.href= "/#album/" + results.ID;
                }

            });
        };
    }]);
