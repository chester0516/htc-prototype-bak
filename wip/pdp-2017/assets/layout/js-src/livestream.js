/*global Site, isEmail, YT, YKU, moment, tmpl*/
var _gotButtonsStatus = false,
    _buttonInterval;
var youtubeVideo = (function() {
    'use strict';
    var youtubeVideo = {
        init: function(vid, videoContainer) {
            var player;

            function onYouTubePlayerAPIReady() {
                player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: vid,
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
            // 4. The API will call this function when the video player is ready.
            function onPlayerReady(event) {
                event.target.playVideo();
            }
            // 5. The API calls this function when the player's state changes.
            //    The function indicates that when playing a video (state=1),
            //    the player should play for six seconds and then stop.
            function onPlayerStateChange(event) {
                // if (event.data === 0) {}
            }
            onYouTubePlayerAPIReady();
        }
    };
    return youtubeVideo;
}());
var livestream = (function() {
    'use strict';
    var livestream = {
        init: function() {
            $('.live-stream').each(function(index, val) {
                /* iterate through array or object */
                var videoDiv = $(this).find('.player-container'),
                    videoId = videoDiv.data('vid'),
                    videoType = videoDiv.data('vtype');
                if (videoType === 'youtube') {
                    youtubeVideo.init(videoId, videoDiv);
                }
            });
        }
    };
    return livestream;
}());
var commonSetting = (function() {
    'use strict';
    var commonSetting = {
        sessionDetection: function() {
            var sessionName = 'htc-has-view-livestream-page',
                sessionStorageRead = sessionStorage.getItem(sessionName);
            if (sessionStorageRead === null) {
                sessionStorage.setItem(sessionName, true);
            }
        },
        isPrototypeHost: function() {
            var returnResult = false,
                hostName = location.host;
            if (hostName.indexOf('p1.htc.com') > -1 || hostName.indexOf('prototype-www.htc.com') > -1) {
                returnResult = true;
            }
            return returnResult;
        },
        setupBackToDefaultPage: function() {
            $('.back-to-default-page').off('click').on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                var redirectUrl;
                if (commonSetting.isPrototypeHost()) {
                    redirectUrl = 'default.htm';
                } else {
                    redirectUrl = '/' + $('body').data('site') + '/';
                }
                location.href = redirectUrl;
            });
        }
    };
    return commonSetting;
}());
$(document).ready(function() {
    'use strict';
    commonSetting.sessionDetection();
    setTimeout(function() {
        livestream.init();
    }, 500);
});