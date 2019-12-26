angular.module('Journal.AlbumViewController', [])
    .controller('AlbumViewController', ['$scope', '$routeParams', 'albumProvider', '$location', '$http', 'localStorageService', '$timeout',
        function ($scope, $routeParams, albumProvider, $location, $http, localStorageService, $timeout) {
            $scope.Total =20;
            $scope.itemsPerPage = 20;
            $scope.pagination = {
                currentPage: $routeParams.page,
                itemsPerPage: 20,
                totalItems: null
            };

            $scope.selectedIndex = 0;
            $scope.selectedFileName = 0;
            $scope.serviceBase = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/';

            $scope.onSelectionChanged = function (item) {
                $scope.selectedFileName = item.OriginalFileName;
            }

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
                    albumProvider.getAlbumResources($routeParams.id, $scope.pagination.currentPage, function (err, resources) {
                        $scope.resources = resources.Resources;
                        $scope.pagination.totalItems = resources.Total;
                        $scope.itemsPerPage = 20;

                        $scope.galleryOptions = {
                            dataSource: $scope.resources,
                            height: "100%",
                            position: "center",
                            width: "100%",
                            stretchImages: false,
                            loop: true,
                            showIndicator: false,
                            showNavButtons: true,
                            slideshowDelay: 0,
                            selectedIndex: $scope.selectedIndex,
                            onInitialized: function (e) {
                                $scope.galleryInstance = e.component;
                                $scope.galleryInstance.option('selectedIndex', $scope.selectedIndex);
                                $scope.selectedResource = $scope.resources[$scope.selectedIndex];
                                $scope.onSelectionChanged($scope.selectedResource);
                                //$scope.CastPlayer.prototype.setupLocalPlayer();
                                //this.initializeUI();
                            },
                            onContentReady: function (e) {
                                $scope.castPlayer.setupLocalPlayer();
                                $scope.castPlayer.initializeUI();
                            },
                            onSelectionChanged: function (e) {
                                //$scope.selectedResource = e;
                                $scope.castPlayer.playerHandler.target.pause();
                                //convoluted way of incrementing/decrementing the selected index when next/previous is clicked.
                                if ($scope.selectedIndex < $scope.resources.length) {
                                    if ($scope.resources[$scope.selectedIndex + 1].Md5 == e.addedItems[0].Md5) {
                                        $scope.selectedIndex = $scope.selectedIndex + 1;
                                    }
                                }
                                if ($scope.selectedIndex < $scope.resources.length) {
                                    if ($scope.resources[$scope.selectedIndex - 1].Md5 == e.addedItems[0].Md5) {
                                        $scope.selectedIndex = $scope.selectedIndex - 1;
                                    }
                                }
                                $scope.selectedResource = $scope.resources[$scope.selectedIndex];
                                $scope.onSelectionChanged(e.addedItems[0]);
                                $scope.castPlayer.playerHandler.target.load();
                            }
                        };
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
                $location.url("/album/"+$routeParams.id + "/" + $scope.pagination.currentPage);
            //albumProvider.getAlbumResources($scope.album.ID, $scope.CurrentPage, function (err, resources) {
            //    $scope.resources = resources.Resources;
            //    //$scope.galleryOptions.dataSource = $scope.resources;
            //    $scope.Total = resources.Total;
            //});

        };

        $scope.popupOptions = {
            width: "85%",
            height: "85%",
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
        };

            $scope.isVideo = function (galleryItem) {
                var isVideo = $scope.getResourceType(galleryItem) == 'av';
                return isVideo;
            }

        $scope.getResourceType = function (galleryItem) {
            //$scope.selectedResource = galleryItem;
            var type = 'generic';
            var originalFileName = galleryItem.OriginalFileName.toLowerCase();
            var index = originalFileName.indexOf('.mov') >= 0 || originalFileName.indexOf('.mp4') >= 0 || originalFileName.indexOf('.avi') || originalFileName.indexOf('.mp3') >= 0 || originalFileName.indexOf('.ogg') >= 0;
            var isVideo = index > 0;
            if (isVideo) {
                type = 'av';
            }
            else {
                index = originalFileName.indexOf('.jpeg') >= 0 || originalFileName.indexOf('.jpg') >= 0 || originalFileName.indexOf('.gif') || originalFileName.indexOf('.tiff') >= 0 || originalFileName.indexOf('.bmp') >= 0;
                var isImage = index > 0;
                if (isImage) {
                    type = 'image';
                }
            }


            return type;
        }

            var getMimeType = function (galleryItem) {
                var mime = '';
                if (galleryItem.OriginalFileName.toLowerCase().indexOf('.mov') >= 0) {
                    mime = 'video/mp4';
                }

                else if (galleryItem.OriginalFileName.toLowerCase().indexOf('.mp4') >= 0) {
                    mime = 'video/mp4';
                }

                else if (galleryItem.OriginalFileName.toLowerCase().indexOf('.avi') >= 0) {
                    mime = 'video/mp4';
                }

                else if (galleryItem.OriginalFileName.toLowerCase().indexOf('.mp3') >= 0) {
                    mime = 'audio/mpeg';
                }
                else if (galleryItem.OriginalFileName.toLowerCase().indexOf('.jpeg') >= 0) {
                    mime = 'image/jpeg';
                }
                else if (galleryItem.OriginalFileName.toLowerCase().indexOf('.jpg') >= 0) {
                    mime = 'image/jpeg';
                }
                return mime;
            }

        $scope.showResourcePopup = function(index)
        {
            $scope.selectedIndex = index;
            if ($scope.galleryInstance) {
                $scope.galleryInstance.option('selectedIndex', index);
            }

            
            //$scope.selectedResource = $scope.resources[index];
            //if ($scope.galleryOptions) {
            //var gallery = $('#resourceGallery').dxGallery('instance');
            //$scope.gallery.option('selectedIndex', index);
            //    //$scope.galleryOptions.goToItem(index, true);
            //}
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




        // Copyright 2019 Google LLC. All Rights Reserved.
        //
        // Licensed under the Apache License, Version 2.0 (the "License");
        // you may not use this file except in compliance with the License.
        // You may obtain a copy of the License at
        //
        // http://www.apache.org/licenses/LICENSE-2.0
        //
        // Unless required by applicable law or agreed to in writing, software
        // distributed under the License is distributed on an "AS IS" BASIS,
        // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
        // See the License for the specific language governing permissions and
        // limitations under the License.

        /**
            * Width of progress bar in pixel
            * @const
            */
        var PROGRESS_BAR_WIDTH = 600;

        /** @const {number} Time in milliseconds for minimal progress update */
        var TIMER_STEP = 1000;

        /** @const {number} Cast volume upon initial connection */
        var DEFAULT_VOLUME = 0.5;

        /** @const {number} Height, in pixels, of volume bar */
        var FULL_VOLUME_HEIGHT = 100;

        /**
            * Constants of states for media playback
            * @enum {string}
            */
        var PLAYER_STATE = {
            IDLE: 'IDLE',
            LOADING: 'LOADING',
            LOADED: 'LOADED',
            PLAYING: 'PLAYING',
            PAUSED: 'PAUSED',
            STOPPED: 'STOPPED',
            ERROR: 'ERROR'
        };

        /**
            * Cast player object
            * Main variables:
            *  - PlayerHandler object for handling media playback
            *  - Cast player variables for controlling Cast mode media playback
            *  - Current media variables for transition between Cast and local modes
            * @struct @constructor
            */
            var CastPlayer = function () {
                /**
* Set the PlayerHandler target to use the video-element player
*/
                this.setupLocalPlayer = function () {
                    var localPlayer = null;
                    var localCastPlayer = this;
                    $timeout(function () {
                        //for video only
                        localPlayer = document.getElementById('embeddedPlayer');
                        if (localPlayer) {
                            //console.log(objstatic);
                            localPlayer.addEventListener(
                                'loadeddata', localCastPlayer.onMediaLoadedLocally.bind(this));

                            // This object will implement PlayerHandler callbacks with localPlayer
                            var playerTarget = {};

                            playerTarget.play = function () {
                                localPlayer.play();

                                //var vi = document.getElementById('video_image');
                                //vi.style.display = 'none';
                                localPlayer.style.display = 'block';
                            };

                            playerTarget.pause = function () {
                                localPlayer.pause();
                            };

                            playerTarget.stop = function () {
                                localPlayer.stop();
                            };

                            //dont think this will ever get called as it's already set
                            playerTarget.load = function (mediaIndex) {
                                localPlayer.src =
                                    "/api/Resources/Get/" + $scope.selectedResource.Md5 + "?access_token=" + $scope.token;//this.mediaContents[mediaIndex]['sources'][0];
                                localPlayer.load();
                            }.bind(this);

                            playerTarget.getCurrentMediaTime = function () {
                                return localPlayer.currentTime;
                            };

                            playerTarget.getMediaDuration = function () {
                                return localPlayer.duration;
                            };

                            playerTarget.updateDisplayMessage = function () {
                                document.getElementById('playerstate').style.display = 'none';
                                document.getElementById('playerstatebg').style.display = 'none';
                                document.getElementById('video_image_overlay').style.display = 'none';
                            };

                            playerTarget.setVolume = function (volumeSliderPosition) {
                                localPlayer.volume = volumeSliderPosition < FULL_VOLUME_HEIGHT ?
                                    volumeSliderPosition / FULL_VOLUME_HEIGHT : 1;
                                var p = document.getElementById('audio_bg_level');
                                p.style.height = volumeSliderPosition + 'px';
                                p.style.marginTop = -volumeSliderPosition + 'px';
                            };

                            playerTarget.mute = function () {
                                localPlayer.muted = true;
                            };

                            playerTarget.unMute = function () {
                                localPlayer.muted = false;
                            };

                            playerTarget.isMuted = function () {
                                return localPlayer.muted;
                            };

                            playerTarget.seekTo = function (time) {
                                localPlayer.currentTime = time;
                            };

                            $scope.castPlayer.playerHandler.setTarget(playerTarget);

                            $scope.castPlayer.playerHandler.setVolume(DEFAULT_VOLUME * FULL_VOLUME_HEIGHT);

                            $scope.castPlayer.showFullscreenButton();

                            if ($scope.castPlayer.currentMediaTime > 0) {
                                $scope.castPlayer.playerHandler.play();
                            }
                        }
                    }, 0);
                    //var localPlayer = document.getElementById('embeddedPlayer');

                };

                /**
                    * Set the PlayerHandler target to use the remote player
                    */
                this.setupRemotePlayer = function () {
                    var castSession = cast.framework.CastContext.getInstance().getCurrentSession();

                    // Add event listeners for player changes which may occur outside sender app
                    this.remotePlayerController.addEventListener(
                        cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
                        function () {
                            if (this.remotePlayer.isPaused) {
                                this.PlayerHandler.target.pause();
                            } else {
                                this.PlayerHandler.target.play();
                            }
                        }.bind(this)
                    );

                    this.remotePlayerController.addEventListener(
                        cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
                        function () {
                            if (this.remotePlayer.isMuted) {
                                this.PlayerHandler.mute();
                            } else {
                                this.PlayerHandler.unMute();
                            }
                        }.bind(this)
                    );

                    this.remotePlayerController.addEventListener(
                        cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
                        function () {
                            var newVolume = this.remotePlayer.volumeLevel * FULL_VOLUME_HEIGHT;
                            var p = document.getElementById('audio_bg_level');
                            p.style.height = newVolume + 'px';
                            p.style.marginTop = -newVolume + 'px';
                        }.bind(this)
                    );

                    // This object will implement PlayerHandler callbacks with
                    // remotePlayerController, and makes necessary UI updates specific
                    // to remote playback
                    var playerTarget = {};

                    playerTarget.play = function () {
                        if (this.remotePlayer.isPaused) {
                            this.remotePlayerController.playOrPause();
                        }

                        //var vi = document.getElementById('video_image');
                        //vi.style.display = 'block';
                        var localPlayer = document.getElementById('video_element');
                        localPlayer.style.display = 'none';
                    }.bind(this);

                    playerTarget.pause = function () {
                        if (!this.remotePlayer.isPaused) {
                            this.remotePlayerController.playOrPause();
                        }
                    }.bind(this);

                    playerTarget.stop = function () {
                        this.remotePlayerController.stop();
                    }.bind(this);

                    playerTarget.load = function (mediaIndex) {
                        console.log('Loading...' + $scope.resources[$scope.selectedIndex].OriginalFileName);
                        var path = $scope.serviceBase + "api/Resources/Get/" + $scope.resources[$scope.selectedIndex].Md5 + "?access_token=" + $scope.token;

                        console.log('Loading...' + path);
                        var type = getMimeType($scope.resources[$scope.selectedIndex]);
                        var mediaInfo = new chrome.cast.media.MediaInfo(path, type);

                        mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
                        mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
                        mediaInfo.metadata.title = $scope.resources[$scope.selectedIndex].OriginalFileName;
                        //mediaInfo.metadata.images = [
                        //    { 'url': MEDIA_SOURCE_ROOT + this.mediaContents[mediaIndex]['thumb'] }];

                        var request = new chrome.cast.media.LoadRequest(mediaInfo);
                        castSession.loadMedia(request).then(
                            this.playerHandler.loaded.bind(this.playerHandler),
                            function (errorCode) {
                                this.playerState = PLAYER_STATE.ERROR;
                                console.log('Remote media load error: ' +
                                    $scope.castPlayer.getErrorMessage(errorCode));
                            }.bind(this));
                    }.bind(this);

                    playerTarget.getCurrentMediaTime = function () {
                        return this.remotePlayer.currentTime;
                    }.bind(this);

                    playerTarget.getMediaDuration = function () {
                        return this.remotePlayer.duration;
                    }.bind(this);

                    playerTarget.updateDisplayMessage = function () {
                        document.getElementById('playerstate').style.display = 'block';
                        document.getElementById('playerstatebg').style.display = 'block';
                        document.getElementById('video_image_overlay').style.display = 'block';
                        document.getElementById('playerstate').innerHTML =
                            $scope.selectedResource.OriginalFileName + ' ' +
                            this.playerState + ' on ' + castSession.getCastDevice().friendlyName;
                    }.bind(this);

                    playerTarget.setVolume = function (volumeSliderPosition) {
                        // Add resistance to avoid loud volume
                        var currentVolume = this.remotePlayer.volumeLevel;
                        var p = document.getElementById('audio_bg_level');
                        if (volumeSliderPosition < FULL_VOLUME_HEIGHT) {
                            var vScale = this.currentVolume * FULL_VOLUME_HEIGHT;
                            if (volumeSliderPosition > vScale) {
                                volumeSliderPosition = vScale + (pos - vScale) / 2;
                            }
                            p.style.height = volumeSliderPosition + 'px';
                            p.style.marginTop = -volumeSliderPosition + 'px';
                            currentVolume = volumeSliderPosition / FULL_VOLUME_HEIGHT;
                        } else {
                            currentVolume = 1;
                        }
                        this.remotePlayer.volumeLevel = currentVolume;
                        this.remotePlayerController.setVolumeLevel();
                    }.bind(this);

                    playerTarget.mute = function () {
                        if (!this.remotePlayer.isMuted) {
                            this.remotePlayerController.muteOrUnmute();
                        }
                    }.bind(this);

                    playerTarget.unMute = function () {
                        if (this.remotePlayer.isMuted) {
                            this.remotePlayerController.muteOrUnmute();
                        }
                    }.bind(this);

                    playerTarget.isMuted = function () {
                        return this.remotePlayer.isMuted;
                    }.bind(this);

                    playerTarget.seekTo = function (time) {
                        this.remotePlayer.currentTime = time;
                        this.remotePlayerController.seek();
                    }.bind(this);

                    $scope.castPlayer.playerHandler.setTarget(playerTarget);

                    // Setup remote player volume right on setup
                    // The remote player may have had a volume set from previous playback
                    if (this.remotePlayer.isMuted) {
                        this.PlayerHandler.mute();
                    }
                    var currentVolume = this.remotePlayer.volumeLevel * FULL_VOLUME_HEIGHT;
                    var p = document.getElementById('audio_bg_level');
                    p.style.height = currentVolume + 'px';
                    p.style.marginTop = -currentVolume + 'px';

                    this.hideFullscreenButton();

                    //this.PlayerHandler.play();
                    $scope.castPlayer.playerHandler.play();
                };

                /**
                    * Callback when media is loaded in local player
                    */
                this.onMediaLoadedLocally = function () {
                    var localPlayer = document.getElementById('embeddedPlayer');
                    localPlayer.currentTime = $scope.castPlayer.currentMediaTime;

                    $scope.castPlayer.playerHandler.loaded();
                };

                /**
                    * Select a media content
                    * @param {number} mediaIndex A number for media index
                    */
                CastPlayer.selectMedia = function (mediaIndex) {
                    console.log('Media index selected: ' + mediaIndex);

                    this.currentMediaIndex = mediaIndex;

                    // Set video image
                    //var vi = document.getElementById('video_image');
                    //vi.src = MEDIA_SOURCE_ROOT + this.mediaContents[mediaIndex]['thumb'];

                    // Reset progress bar
                    var pi = document.getElementById('progress_indicator');
                    var p = document.getElementById('progress');
                    p.style.width = '0px';
                    pi.style.marginLeft = -21 - PROGRESS_BAR_WIDTH + 'px';

                    // Reset currentMediaTime
                    this.currentMediaTime = 0;

                    this.playerState = PLAYER_STATE.IDLE;
                    this.PlayerHandler.play();
                };

                /**
                    * Media seek function
                    * @param {Event} event An event object from seek
                    */
                this.seekMedia = function (event) {
                    var pos = parseInt(event.offsetX, 10);
                    var pi = document.getElementById('progress_indicator');
                    var p = document.getElementById('progress');
                    if (event.currentTarget.id == 'progress_indicator') {
                        var curr = parseInt(
                            this.currentMediaTime + this.currentMediaDuration * pos /
                            PROGRESS_BAR_WIDTH, 10);
                        var pp = parseInt(pi.style.marginLeft, 10) + pos;
                        var pw = parseInt(p.style.width, 10) + pos;
                    } else {
                        var curr = parseInt(
                            pos * this.currentMediaDuration / PROGRESS_BAR_WIDTH, 10);
                        var pp = pos - 21 - PROGRESS_BAR_WIDTH;
                        var pw = pos;
                    }

                    if (this.playerState === PLAYER_STATE.PLAYING ||
                        this.playerState === PLAYER_STATE.PAUSED) {
                        this.currentMediaTime = curr;
                        p.style.width = pw + 'px';
                        pi.style.marginLeft = pp + 'px';
                    }

                    //this.PlayerHandler.seekTo(curr);
                    $scope.castPlayer.playerHandler.target.seekTo(curr);
                };

                /**
                    * Set current player volume
                    * @param {Event} mouseEvent
                    */
                this.setVolume = function (mouseEvent) {
                    var p = document.getElementById('audio_bg_level');
                    var pos = 0;
                    if (mouseEvent.currentTarget.id === 'audio_bg_track') {
                        pos = FULL_VOLUME_HEIGHT - parseInt(mouseEvent.offsetY, 10);
                    } else {
                        pos = parseInt(p.clientHeight, 10) - parseInt(mouseEvent.offsetY, 10);
                    }
                    this.PlayerHandler.setVolume(pos);
                };

                /**
                    * Starts the timer to increment the media progress bar
                    */
                this.startProgressTimer = function () {
                    this.stopProgressTimer();

                    // Start progress timer
                    this.timer =
                        setInterval(this.incrementMediaTimeHandler, TIMER_STEP);
                };

                /**
                    * Stops the timer to increment the media progress bar
                    */
                this.stopProgressTimer = function () {
                    if (this.timer) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                };

                /**
                    * Helper function
                    * Increment media current position by 1 second
                    */
                this.incrementMediaTime = function () {
                    // First sync with the current player's time
                    this.currentMediaTime = this.playerHandler.getCurrentMediaTime();
                    this.currentMediaDuration = this.playerHandler.getMediaDuration();

                    if (this.playerState === PLAYER_STATE.PLAYING) {
                        if (this.currentMediaTime < this.currentMediaDuration) {
                            this.currentMediaTime += 1;
                            this.updateProgressBarByTimer();
                        } else {
                            this.endPlayback();
                        }
                    }
                };

                /**
                    * Update progress bar based on timer
                    */
                this.updateProgressBarByTimer = function () {
                    var p = document.getElementById('progress');
                    if (isNaN(parseInt(p.style.width, 10))) {
                        p.style.width = 0;
                    }
                    if (this.currentMediaDuration > 0) {
                        var pp = Math.floor(
                            PROGRESS_BAR_WIDTH * this.currentMediaTime / this.currentMediaDuration);
                    }

                    p.style.width = pp + 'px';
                    var pi = document.getElementById('progress_indicator');
                    pi.style.marginLeft = -21 - PROGRESS_BAR_WIDTH + pp + 'px';

                    if (pp >= PROGRESS_BAR_WIDTH) {
                        this.endPlayback();
                    }
                };

                /**
                    *  End playback. Called when media ends.
                    */
                this.endPlayback = function () {
                    this.currentMediaTime = 0;
                    this.stopProgressTimer();
                    this.playerState = PLAYER_STATE.IDLE;
                    this.PlayerHandler.updateDisplayMessage();

                    document.getElementById('play').style.display = 'block';
                    document.getElementById('pause').style.display = 'none';
                };

                /**
                    * @param {number} durationInSec
                    * @return {string}
                    */
                this.getDurationString = function (durationInSec) {
                    var durationString = '' + Math.floor(durationInSec % 60);
                    var durationInMin = Math.floor(durationInSec / 60);
                    if (durationInMin === 0) {
                        return durationString;
                    }
                    durationString = (durationInMin % 60) + ':' + durationString;
                    var durationInHour = Math.floor(durationInMin / 60);
                    if (durationInHour === 0) {
                        return durationString;
                    }
                    return durationInHour + ':' + durationString;
                };

                /**
                    * Updates media duration text in UI
                    */
                this.updateMediaDuration = function () {
                    document.getElementById('duration').innerHTML =
                        this.getDurationString(this.currentMediaDuration);
                };

                /**
                    * Request full screen mode
                    */
                this.requestFullScreen = function () {
                    // Supports most browsers and their versions.
                    var element = document.getElementById('embeddedPlayer');
                    var requestMethod =
                        element['requestFullScreen'] || element['webkitRequestFullScreen'];

                    if (requestMethod) { // Native full screen.
                        requestMethod.call(element);
                        console.log('Requested fullscreen');
                    }
                };


                /**
                    * Exit full screen mode
                    */
                this.cancelFullScreen = function () {
                    // Supports most browsers and their versions.
                    var requestMethod =
                        document['cancelFullScreen'] || document['webkitCancelFullScreen'];

                    if (requestMethod) {
                        requestMethod.call(document);
                    }
                };


                /**
                    * Exit fullscreen mode by escape
                    */
                this.fullscreenChangeHandler = function () {
                    this.fullscreen = !this.fullscreen;
                };


                /**
                    * Show expand/collapse fullscreen button
                    */
                this.showFullscreenButton = function () {
                    if (this.fullscreen) {
                        document.getElementById('fullscreen_expand').style.display = 'none';
                        document.getElementById('fullscreen_collapse').style.display = 'block';
                    } else {
                        document.getElementById('fullscreen_expand').style.display = 'block';
                        document.getElementById('fullscreen_collapse').style.display = 'none';
                    }
                };


                /**
                    * Hide expand/collapse fullscreen button
                    */
                this.hideFullscreenButton = function () {
                    document.getElementById('fullscreen_expand').style.display = 'none';
                    document.getElementById('fullscreen_collapse').style.display = 'none';
                };

                /**
                    * Show the media control
                    */
                this.showMediaControl = function () {
                    document.getElementById('media_control').style.opacity = 0.7;
                };


                /**
                    * Hide the media control
                    */
                this.hideMediaControl = function () {
                    document.getElementById('media_control').style.opacity = 0;
                };


                /**
                    * Show the volume slider
                    */
                this.showVolumeSlider = function () {
                    if (!$scope.castPlayer.playerHandler.isMuted()) {
                        document.getElementById('audio_bg').style.opacity = 1;
                        document.getElementById('audio_bg_track').style.opacity = 1;
                        document.getElementById('audio_bg_level').style.opacity = 1;
                        document.getElementById('audio_indicator').style.opacity = 1;
                    }
                };

                /**
                    * Hide the volume slider
                    */
                this.hideVolumeSlider = function () {
                    document.getElementById('audio_bg').style.opacity = 0;
                    document.getElementById('audio_bg_track').style.opacity = 0;
                    document.getElementById('audio_bg_level').style.opacity = 0;
                    document.getElementById('audio_indicator').style.opacity = 0;
                };

                /**
                    * Reset the volume slider
                    */
                this.resetVolumeSlider = function () {
                    var volumeTrackHeight = document.getElementById('audio_bg_track').clientHeight;
                    var defaultVolumeSliderHeight = DEFAULT_VOLUME * volumeTrackHeight;
                    document.getElementById('audio_bg_level').style.height =
                        defaultVolumeSliderHeight + 'px';
                    document.getElementById('audio_on').style.display = 'block';
                    document.getElementById('audio_off').style.display = 'none';
                };

                /**
                    * Initialize UI components and add event listeners
                    */
                this.initializeUI = function () {
                    // Set initial values for title, subtitle, and description
                    //document.getElementById('media_title').innerHTML =
                    //    $scope.resources[$scope.selectedIndex].OriginalFileName;
                    document.getElementById('media_subtitle').innerHTML =
                        "secondary title";
                    document.getElementById('media_desc').innerHTML =
                        "description";

                    // Add event handlers to UI components
                    document.getElementById('progress_bg').addEventListener(
                        'click', this.seekMedia.bind(this));
                    document.getElementById('progress').addEventListener(
                        'click', this.seekMedia.bind(this));
                    document.getElementById('progress_indicator').addEventListener(
                        'dragend', this.seekMedia.bind(this));
                    document.getElementById('audio_on').addEventListener(
                        'click', $scope.castPlayer.playerHandler.mute.bind($scope.castPlayer.playerHandler));
                    document.getElementById('audio_off').addEventListener(
                        'click', $scope.castPlayer.playerHandler.unMute.bind($scope.castPlayer.playerHandler));
                    document.getElementById('audio_bg').addEventListener(
                        'mouseover', this.showVolumeSlider.bind(this));
                    document.getElementById('audio_on').addEventListener(
                        'mouseover', this.showVolumeSlider.bind(this));
                    document.getElementById('audio_bg_level').addEventListener(
                        'mouseover', this.showVolumeSlider.bind(this));
                    document.getElementById('audio_bg_track').addEventListener(
                        'mouseover', this.showVolumeSlider.bind(this));
                    document.getElementById('audio_bg_level').addEventListener(
                        'click', this.setVolume.bind(this));
                    document.getElementById('audio_bg_track').addEventListener(
                        'click', this.setVolume.bind(this));
                    document.getElementById('audio_bg').addEventListener(
                        'mouseout', this.hideVolumeSlider.bind(this));
                    document.getElementById('audio_on').addEventListener(
                        'mouseout', this.hideVolumeSlider.bind(this));
                    document.getElementById('main_video').addEventListener(
                        'mouseover', this.showMediaControl.bind(this));
                    document.getElementById('main_video').addEventListener(
                        'mouseout', this.hideMediaControl.bind(this));
                    document.getElementById('media_control').addEventListener(
                        'mouseover', this.showMediaControl.bind(this));
                    document.getElementById('media_control').addEventListener(
                        'mouseout', this.hideMediaControl.bind(this));
                    document.getElementById('fullscreen_expand').addEventListener(
                        'click', this.requestFullScreen.bind(this));
                    document.getElementById('fullscreen_collapse').addEventListener(
                        'click', this.cancelFullScreen.bind(this));
                    document.addEventListener(
                        'fullscreenchange', this.fullscreenChangeHandler.bind(this), false);
                    document.addEventListener(
                        'webkitfullscreenchange', this.fullscreenChangeHandler.bind(this), false);

                    // Enable play/pause buttons
                    document.getElementById('play').addEventListener(
                        'click', $scope.castPlayer.playerHandler.play.bind(this.PlayerHandler));
                    document.getElementById('pause').addEventListener(
                        'click', $scope.castPlayer.playerHandler.pause.bind(this.PlayerHandler));
                    document.getElementById('progress_indicator').draggable = true;
                };

                this.initializeCastPlayer = function () {

                    var options = {};

                    // Set the receiver application ID to your own (created in the
                    // Google Cast Developer Console), or optionally
                    // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
                    options.receiverApplicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;

                    // Auto join policy can be one of the following three:
                    // ORIGIN_SCOPED - Auto connect from same appId and page origin
                    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
                    // PAGE_SCOPED - No auto connect
                    options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

                    cast.framework.CastContext.getInstance().setOptions(options);

                    this.remotePlayer = new cast.framework.RemotePlayer();
                    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
                    this.remotePlayerController.addEventListener(
                        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
                        this.switchPlayer.bind(this)
                    );
                };

                /*
                    * PlayerHandler and setup functions
                    */

                this.switchPlayer = function () {
                    this.stopProgressTimer();
                    this.resetVolumeSlider();
                    this.playerHandler.stop();
                    this.playerState = PLAYER_STATE.IDLE;
                    if (cast && cast.framework) {
                        if (this.remotePlayer.isConnected) {
                            this.setupRemotePlayer();
                            return;
                        }
                    }
                    this.setupLocalPlayer();
                };
            /** @type {PlayerHandler} Delegation proxy for media playback */
            this.playerHandler = new PlayerHandler(this);

            /** @type {PLAYER_STATE} A state for media playback */
            this.playerState = PLAYER_STATE.IDLE;

            /* Cast player variables */
            /** @type {cast.framework.RemotePlayer} */
            this.remotePlayer = null;
            /** @type {cast.framework.RemotePlayerController} */
            this.remotePlayerController = null;

            /* Current media variables */
            /** @type {number} A number for current media index */
            this.currentMediaIndex = 0;
            /** @type {number} A number for current media time */
            this.currentMediaTime = 0;
            /** @type {number} A number for current media duration */
            this.currentMediaDuration = -1;
            /** @type {?number} A timer for tracking progress of media */
            this.timer = null;

            /** @type {Object} media contents from JSON */
            this.mediaContents = null;

            /** @type {boolean} Fullscreen mode on/off */
            this.fullscreen = false;

            /** @type {function()} */
                this.incrementMediaTimeHandler = this.incrementMediaTime.bind(this);



                /**
                    * Makes human-readable message from chrome.cast.Error
                    * @param {chrome.cast.Error} error
                    * @return {string} error message
                    */
                this.getErrorMessage = function (error) {
                    switch (error.code) {
                        case chrome.cast.ErrorCode.API_NOT_INITIALIZED:
                            return 'The API is not initialized.' +
                                (error.description ? ' :' + error.description : '');
                        case chrome.cast.ErrorCode.CANCEL:
                            return 'The operation was canceled by the user' +
                                (error.description ? ' :' + error.description : '');
                        case chrome.cast.ErrorCode.CHANNEL_ERROR:
                            return 'A channel to the receiver is not available.' +
                                (error.description ? ' :' + error.description : '');
                        case chrome.cast.ErrorCode.EXTENSION_MISSING:
                            return 'The Cast extension is not available.' +
                                (error.description ? ' :' + error.description : '');
                        case chrome.cast.ErrorCode.INVALID_PARAMETER:
                            return 'The parameters to the operation were not valid.' +
                                (error.description ? ' :' + error.description : '');
                        case chrome.cast.ErrorCode.RECEIVER_UNAVAILABLE:
                            return 'No receiver was compatible with the session request.' +
                                (error.description ? ' :' + error.description : '');
                        case chrome.cast.ErrorCode.SESSION_ERROR:
                            return 'A session could not be created, or a session was invalid.' +
                                (error.description ? ' :' + error.description : '');
                        case chrome.cast.ErrorCode.TIMEOUT:
                            return 'The operation timed out.' +
                                (error.description ? ' :' + error.description : '');
                    }
                };

            //this.addVideoThumbs();
            //this.initializeUI();
        };



        /**
            * PlayerHandler
            *
            * This is a handler through which the application will interact
            * with both the RemotePlayer and LocalPlayer. Combining these two into
            * one interface is one approach to the dual-player nature of a Cast
            * Chrome application. Otherwise, the state of the RemotePlayer can be
            * queried at any time to decide whether to interact with the local
            * or remote players.
            *
            * To set the player used, implement the following methods for a target object
            * and call setTarget(target).
            *
            * Methods to implement:
            *  - play()
            *  - pause()
            *  - stop()
            *  - seekTo(time)
            *  - load(mediaIndex)
            *  - getMediaDuration()
            *  - getCurrentMediaTime()
            *  - setVolume(volumeSliderPosition)
            *  - mute()
            *  - unMute()
            *  - isMuted()
            *  - updateDisplayMessage()
            */
        var PlayerHandler = function (castPlayer) {
            this.target = {};

            this.setTarget = function (target) {
                this.target = target;
            };

            this.play = function () {
                if (castPlayer.playerState !== PLAYER_STATE.PLAYING &&
                    castPlayer.playerState !== PLAYER_STATE.PAUSED &&
                    castPlayer.playerState !== PLAYER_STATE.LOADED) {
                    this.load(castPlayer.currentMediaIndex);
                    return;
                }

                //this.target.play();
                $scope.castPlayer.playerHandler.target.play();
                castPlayer.playerState = PLAYER_STATE.PLAYING;
                document.getElementById('play').style.display = 'none';
                document.getElementById('pause').style.display = 'block';
                $scope.castPlayer.playerHandler.updateDisplayMessage();
            };

            this.pause = function () {
                if (castPlayer.playerState !== PLAYER_STATE.PLAYING) {
                    return;
                }

                $scope.castPlayer.playerHandler.target.pause();
                castPlayer.playerState = PLAYER_STATE.PAUSED;
                document.getElementById('play').style.display = 'block';
                document.getElementById('pause').style.display = 'none';
                $scope.castPlayer.playerHandler.updateDisplayMessage();
            };

            this.stop = function () {
                this.pause();
                castPlayer.playerState = PLAYER_STATE.STOPPED;
                this.updateDisplayMessage();
            };

            this.load = function (mediaIndex) {
                castPlayer.playerState = PLAYER_STATE.LOADING;

                //document.getElementById('media_title').innerHTML =
                //    $scope.selectedResource.OriginalFileName;
                document.getElementById('media_subtitle').innerHTML =
                    "";
                document.getElementById('media_desc').innerHTML =
                    "Description";

                this.target.load(mediaIndex);
                this.updateDisplayMessage();
            };

            this.loaded = function () {
                castPlayer.currentMediaDuration = this.getMediaDuration();
                castPlayer.updateMediaDuration();
                castPlayer.playerState = PLAYER_STATE.LOADED;
                if (castPlayer.currentMediaTime > 0) {
                    this.seekTo(castPlayer.currentMediaTime);
                }
                this.pause();
                castPlayer.startProgressTimer();
                this.updateDisplayMessage();
            };

            this.getCurrentMediaTime = function () {
                return this.target.getCurrentMediaTime();
            };

            this.getMediaDuration = function () {
                return this.target.getMediaDuration();
            };

            this.updateDisplayMessage = function () {
                this.target.updateDisplayMessage();
            }
                ;
            this.setVolume = function (volumeSliderPosition) {
                this.target.setVolume(volumeSliderPosition);
            };

            this.mute = function () {
                this.target.mute();
                document.getElementById('audio_on').style.display = 'none';
                document.getElementById('audio_off').style.display = 'block';
            };

            this.unMute = function () {
                this.target.unMute();
                document.getElementById('audio_on').style.display = 'block';
                document.getElementById('audio_off').style.display = 'none';
            };

            this.isMuted = function () {
                return this.target.isMuted();
            };

            this.seekTo = function (time) {
                this.target.seekTo(time);
                this.updateDisplayMessage();
            };
        };//end of PlayerHandler


        $scope.castPlayer = new CastPlayer();
        window['__onGCastApiAvailable'] = function (isAvailable) {
            if (isAvailable) {
                $scope.castPlayer.initializeCastPlayer();
            }
        };

        initializeCastApi = function () {
            cast.framework.CastContext.getInstance().setOptions({
                receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
            });
        };
            



        
}]);