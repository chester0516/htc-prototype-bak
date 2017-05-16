/*global ScrollMagic, TimelineLite, TweenLite, YKU, YT*/
/**

    TODO:
    - compress images
    -accessory mobile
    -logo replacement 

 */
var controller = new ScrollMagic.Controller({
    loglevel: 3
});
var isDesktopView = true;
$(window).resize(function() {
    'use strict';
    commonSetting.forcePageReload();
});
$(document).ready(function() {
    'use strict';
    if (commonSetting.isMobile()) {
        isDesktopView = false;
    }
    infoBar.init();
    modalVideo.init();
    videoBgSection.init();
    videoSwitch.init();
    jumpingAnimation.init();
});
/*=========================================================
=       Section: Video Switch                             =
=========================================================*/
var videoSwitch = (function() {
    'use strict';
    var _selectedIndex;
    var videoSwitch = {
        init: function() {
            if ($('.video-switch').length > 0) {
                if (commonSetting.isMobile()) {
                    //setup carousel
                    $(window).load(function() {
                        // Run code
                        videoSwitch.setupCarousel();
                    });
                } else {
                    //setup icon click
                    _selectedIndex = 0;
                    videoSwitch.setupPoster(0);
                    videoSwitch.setupCaption(0);
                    videoSwitch.setupIconClick();
                }
            }
        },
        setupCarousel: function() {
            $('.video-switch .owl-carousel').owlCarousel({
                items: 1,
                autoHeight: true,
                onInitialized: setOwlHeight,
                onResized: setOwlHeight,
                onTranslated: setOwlHeight
            });

            function setOwlHeight(event) {
                var maxHeight = 0,
                    imageHeight;
                $('.video-switch .owl-item.active').each(function() { // LOOP THROUGH ACTIVE ITEMS
                    var thisHeight = parseInt($(this).height(), 10);
                    imageHeight = $(this).find('.image-block').height();
                    maxHeight = (maxHeight >= thisHeight ? maxHeight : thisHeight);
                });
                setTimeout(function() {
                    $('.video-switch .owl-carousel').css('height', maxHeight);
                    $('.video-switch .owl-stage-outer').css('height', maxHeight); // CORRECT DRAG-AREA SO BUTTONS ARE CLICKABLE
                    $('.video-switch .owl-dots').css('top', imageHeight);
                }, 10);
            }
        },
        setupCaption: function(idx) {
            var $currentItem = $('.video-switch .text-area .caption-block'),
                selectedCaptionHtml = $('.video-switch .carousel-container .carousel-item').eq(idx).find('.caption-block').html();
            $currentItem.html(selectedCaptionHtml);
        },
        setupPoster: function(idx) {
            var mainVideo = $('.video-switch .video-container'),
                selectedVideoPoster = $('.video-switch .carousel-container .carousel-item').eq(idx).data('poster-path');
            if (typeof selectedVideoPoster !== 'undefined') {
                mainVideo.attr('poster', selectedVideoPoster);
            }
        },
        setupIconClick: function() {
            $('.video-switch .icons-group .icon-item').on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                if (!$(this).hasClass('selected')) {
                    var selectedIndex = $(this).index(),
                        allIcons = $('.video-switch .icons-group .icon-item'),
                        $currentItem = $('.video-switch .text-area .caption-block'),
                        currentItemHeight = $currentItem.height() + 'px',
                        newHeight,
                        mainVideo = $('.video-switch .video-container'),
                        mainVideoHeight = mainVideo.height(),
                        videoBlock = mainVideo[0],
                        selectedVideoPath = $('.video-switch .carousel-container .carousel-item').eq(selectedIndex).data('video-path'),
                        selectedVideoPoster = $('.video-switch .carousel-container .carousel-item').eq(selectedIndex).data('poster-path'),
                        selectedCaptionHtml = $('.video-switch .carousel-container .carousel-item').eq(selectedIndex).find('.caption-block').html();
                    _selectedIndex = selectedIndex;
                    allIcons.removeClass('selected');
                    // mainVideo.removeClass('show');
                    $(this).addClass('selected');
                    videoSwitch.setupPoster(selectedIndex);
                    videoSwitch.setupCaption(selectedIndex);
                    mainVideo.attr('loop', 'loop');
                    videoBlock.pause();
                    videoBlock.src = selectedVideoPath;
                    videoBlock.load();
                    videoBlock.play();
                    // setTimeout(function(){
                    //     mainVideo.addClass('show');
                    // },500);
                }
            });
        }
    };
    return videoSwitch;
}());
/*=========================================================
=       Section: Jumping Animation                         =
=========================================================*/
var jumpingAnimation = (function() {
    'use strict';
    var jumpingAnimation = {
        init: function() {
            if ($('.jumping-animation').length > 0) {
                if (commonSetting.isMobile()) {
                    $(window).load(function() {
                        jumpingAnimation.setupCarousel();
                    });
                } else {
                    jumpingAnimation.setupIconClick();
                }
            }
        },
        setupCarousel: function() {
            $('.jumping-animation .owl-carousel').owlCarousel({
                items: 1,
                autoHeight: true,
                onInitialized: setOwlStageHeight,
                onResized: setOwlStageHeight,
                onTranslated: setOwlStageHeight
            });

            function setOwlStageHeight(event) {
                var maxHeight = 0,
                    imageHeight;
                $('.jumping-animation .owl-item.active').each(function() { // LOOP THROUGH ACTIVE ITEMS
                    var thisHeight = parseInt($(this).height(), 10);
                    imageHeight = $(this).find('.image-block').height();
                    maxHeight = (maxHeight >= thisHeight ? maxHeight : thisHeight);
                });
                $('.jumping-animation .owl-carousel').css('height', maxHeight);
                $('.jumping-animation .owl-stage-outer').css('height', maxHeight); // CORRECT DRAG-AREA SO BUTTONS ARE CLICKABLE
                $('.jumping-animation .owl-dots').css('top', imageHeight);
            }
        },
        setupIconClick: function() {
            $('.jumping-animation .icons-group .icon-item').on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                if (!$(this).hasClass('selected')) {
                    var selectedIndex = $(this).index(),
                        allIcons = $('.jumping-animation .icons-group .icon-item'),
                        $currentItem = $('.jumping-animation .text-area .caption-block'),
                        currentItemHeight = $currentItem.height() + 'px',
                        newHeight,
                        $imageBlock = $('.jumping-animation .image-animation'),
                        $mainImage = $('.jumping-animation .image-animation .main-image'),
                        selectedImageHtml = $('.jumping-animation .carousel-container .carousel-item').eq(selectedIndex).find('.image-block').html(),
                        selectedCaptionHtml = $('.jumping-animation .carousel-container .carousel-item').eq(selectedIndex).find('.caption-block').html();
                    $imageBlock.removeClass('show');
                    allIcons.removeClass('selected');
                    $(this).addClass('selected');
                    $currentItem.html(selectedCaptionHtml);
                    newHeight = $currentItem.height() + 'px';
                    var timeLineObj = new TimelineLite({
                        immediateRender: false
                    });
                    //expand product detail list
                    timeLineObj.add(TweenLite.set($currentItem, {
                        height: 'auto'
                    }));
                    timeLineObj.add(TweenLite.from($currentItem, 0.3, {
                        height: currentItemHeight
                    }));
                    //show product items
                    timeLineObj.call(function() {
                        $mainImage.html(selectedImageHtml);
                        $imageBlock.addClass('show');
                    }, [], this, '+=0.4');
                    //start 
                    timeLineObj.play();
                }
            });
            $('.jumping-animation .icons-group .icon-item').eq(0).trigger('click');
        }
    };
    return jumpingAnimation;
}());
/*=========================================================
=       Section: modal video                              =
=========================================================*/
var modalVideo = (function() {
    'use strict';
    var modalVideo = {
        init: function() {
            var modalVideo = $('.modal-video');
            if (modalVideo.length > 0) {
                $.each(modalVideo, function(index, val) {
                    /* iterate through array or object */
                    var currentSection = $(this),
                        playBtn = $(this).find('.play-modal-video-btn'),
                        playArea = $('.modal-video-play-block'),
                        videoType = playBtn.data('vtype'),
                        videoId = playBtn.data('vid');
                    playBtn.on('click', function(event) {
                        event.preventDefault();
                        /* Act on the event */
                        if (videoType === 'youtube') {
                            //Youtube
                            youtubeVideo.init(videoId, playArea);
                        } else {
                            //YouKu
                            youkuVideo.init(videoId, playArea);
                        }
                    });
                });
            }
        },
        setupCloseModalBtn: function() {
            $('.modal-overlap-container .btn-close').off('click').on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                modalVideo.hideModal();
            });
        },
        showModal: function() {
            $('.modal-overlap-container').addClass('show');
            $('body').addClass('fixed');
        },
        hideModal: function() {
            $('.modal-overlap-container').removeClass('show');
            $('body').removeClass('fixed');
            $('.modal-video-play-block').html('<div id="player"></div>');
        }
    };
    return modalVideo;
}());
/*=========================================================
=       Section: video BG                                 =
=========================================================*/
var videoBgSection = (function() {
    'use strict';
    var videoBgSection = {
        init: function() {
            if ($('.video-bg').length > 0) {
                videoBgSection.setupVideoSource();
            }
        },
        setupVideoSource: function() {
            if (!commonSetting.isMobile()) {
                $.each($('.video-bg'), function(index, val) {
                    var sectionObj = $(this),
                        sectionDom = sectionObj[0],
                        videoObj = sectionObj.find('video'),
                        videoDom = videoObj[0],
                        videoPath = videoObj.data('video-path');
                    // .addIndicators({
                    //     name: 'video (duration: 0)'
                    // })
                    var scene = new ScrollMagic.Scene({
                        triggerElement: sectionDom,
                        offset: -700
                    }).addTo(controller).on('enter', function(e) {
                        if (e.type === 'enter' && !videoObj.hasClass('loaded')) {
                            videoDom.pause();
                            videoDom.src = videoPath;
                            videoDom.load();
                            videoObj.addClass('loaded');
                            videoBgSection.setupScrollAndPlay(sectionObj, sectionDom, videoObj, videoDom);
                        }
                    });
                });
            }
        },
        getPosition: function(sectionObj, videoObj) {
            var topTrigger = 0,
                bottomTrigger = 0,
                defaultTop = 5,
                defaultBottom = 5,
                sectionHeight = sectionObj.height();
            if (typeof videoObj.data('top-trigger-playing') !== 'undefined') {
                defaultTop = videoObj.data('top-trigger-playing');
            }
            topTrigger = parseInt(sectionHeight * (defaultTop / 100), 10);
            if (typeof videoObj.data('bottom-trigger-playing') !== 'undefined') {
                defaultBottom = videoObj.data('bottom-trigger-playing');
            }
            bottomTrigger = sectionHeight - parseInt(sectionHeight * (defaultBottom / 100), 10) - topTrigger;
            return [topTrigger, bottomTrigger];
        },
        updatePosition: function(sectionObj, videoObj, scene) {
            var positionArray = videoBgSection.getPosition(sectionObj, videoObj),
                topTrigger = positionArray[0],
                bottomTrigger = positionArray[1];
            scene.offset(topTrigger);
            scene.duration(bottomTrigger);
        },
        setupScrollAndPlay: function(sectionObj, sectionDom, videoObj, videoDom) {
            if (!commonSetting.isMobile()) {
                // .addIndicators({
                //     name: 'scroll (sHeight:' + sectionHeight + ' | vHeight:' + videoHeight + ' | offset:' + topTrigger + ' | duration:' + bottomTrigger + ')'
                // })
                var scene,
                    loop = videoObj.data('loop'),
                    positionArray = videoBgSection.getPosition(sectionObj, videoObj),
                    topTrigger = positionArray[0],
                    bottomTrigger = positionArray[1],
                    videoHeight = videoObj.height(),
                    sectionHeight = sectionObj.height();
                scene = new ScrollMagic.Scene({
                    triggerElement: sectionDom,
                    offset: topTrigger,
                    duration: bottomTrigger
                }).addTo(controller).on('enter leave', function(e) {
                    if (e.type === 'enter' && !videoObj.hasClass('played') && videoObj.hasClass('loaded')) {
                        videoDom.play();
                        videoObj.addClass('played'); //Play once
                    }
                });
                videoDom.addEventListener('ended', function() {
                    if (typeof loop !== 'undefined' && loop === 'no') {
                        videoObj.removeClass('played');
                    } else {
                        videoObj.attr('loop', 'loop');
                        videoDom.play();
                    }
                }, false);
                $(window).resize(function(event) {
                    /* Act on the event */
                    videoBgSection.updatePosition(sectionObj, videoObj, scene);
                });
            }
        }
    };
    return videoBgSection;
}());
/*=========================================================
=       Info bar related                                  =
=========================================================*/
var infoBar = (function() {
    'use strict';
    var infoBar = {
        init: function() {
            if ($('.info-bar').length > 0) {
                infoBar.setupSticky();
                infoBar.setupScroll();
                infoBar.setupToggleMobileMenu();
            }
        },
        setupSticky: function() {
            // init controller
            var scene = new ScrollMagic.Scene({
                triggerElement: '.info-bar',
                triggerHook: 'onLeave'
            }).setPin('.info-bar').addTo(controller);
            var $headerDiv = $('.info-bar');
            var $rowDiv = $(window);
            if ($('body').hasClass('rtl')) {
                $rowDiv.scroll(function(e) {
                    if ($headerDiv.css('position') === 'fixed') {
                        $headerDiv.css({
                            left: 'auto',
                            right: $rowDiv.scrollLeft() + 'px'
                        });
                    } else {
                        $headerDiv.css({
                            left: 'auto',
                            right: '0px'
                        });
                    }
                });
            } else {
                $rowDiv.scroll(function(e) {
                    if ($headerDiv.css('position') === 'fixed') {
                        $headerDiv.css({
                            left: -$rowDiv.scrollLeft() + 'px'
                        });
                    } else {
                        $headerDiv.css({
                            left: '0px'
                        });
                    }
                });
            }
        },
        setupScroll: function() {
            $('.scroll-btn').on('click', function(event) {
                event.preventDefault();
                var scrollToItem = $(this).data('scroll-to'),
                    scrollPosition;
                if (typeof scrollToItem !== 'undefined') {
                    if (commonSetting.isMobile()) {
                        infoBar.toggleMenu();
                    }
                    scrollPosition = $('#' + scrollToItem).offset().top - $('.info-bar').height();
                    $('html, body').animate({
                        scrollTop: scrollPosition
                    }, 1000);
                }
            });
        },
        setupToggleMobileMenu: function() {
            if (commonSetting.isMobile()) {
                $('.m-toggle-menu').on('click', function(event) {
                    event.preventDefault();
                    infoBar.toggleMenu();
                });
            }
        },
        toggleMenu: function() {
            $('.m-toggle-menu').toggleClass('active');
            $('.scroll-btn-group').toggleClass('show');
        }
    };
    return infoBar;
}());
var commonSetting = (function() {
    'use strict';
    var commonSetting = {
        mobileMaxReserlution: function() {
            return 720;
        },
        isMobile: function() {
            if ($(window).width() <= commonSetting.mobileMaxReserlution()) {
                return true;
            } else {
                return false;
            }
        },
        forcePageReload: function() {
            //Force page reload when desktop and mobile switch
            if ($(window).width() <= commonSetting.mobileMaxReserlution() && isDesktopView) {
                location.reload();
            }
            if ($(window).width() > commonSetting.mobileMaxReserlution() && !isDesktopView) {
                location.reload();
            }
        },
    };
    return commonSetting;
}());
/*=========================================================
=       Detect Youtube or Youku plugin                    =
=========================================================*/
var youkuVideo = (function() {
    'use strict';
    var youkuVideo = {
        init: function(vid) {
            var player;
            // youkuVideo.resetPlayerHeight();
            player = new YKU.Player('player', {
                styleid: '0',
                client_id: '2a8fda48fc709b73',
                vid: vid,
                newPlayer: false,
                autoplay: true,
                show_related: false,
                events: {
                    onPlayEnd: function() {
                        modalVideo.hideModal();
                    },
                    onPlayerReady: function() {
                        // youkuVideo.resetPlayerHeight();
                        modalVideo.showModal();
                        modalVideo.setupCloseModalBtn();
                    }
                }
            });
            // $(window).resize(function(event) {
            //      Act on the event 
            //     youkuVideo.resetPlayerHeight();
            // });
        },
        resetPlayerHeight: function() {
            if ($('.player-container').data('vtype') === 'youku') {
                $('#player').height($('picture').height());
            }
        }
    };
    return youkuVideo;
}());
var youtubeVideo = (function() {
    'use strict';
    var youtubeVideo = {
        init: function(vid) {
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

            function onPlayerReady(event) {
                event.target.playVideo();
                modalVideo.showModal();
                modalVideo.setupCloseModalBtn();
            }

            function onPlayerStateChange(event) {
                if (event.data === 0) {
                    modalVideo.hideModal();
                }
            }
            onYouTubePlayerAPIReady();
        }
    };
    return youtubeVideo;
}());
(function($) {
    'use strict';
    $.fn.videobject = function(callerSettings) {
        var settings = $.extend({
            //flash: '<object width="mywidth" height="myheight" type="application/x-shockwave-flash" data="myurl" id="youku_player" style="visibility: visible;"><param name="quality" value="high"><param name="wmode" value="opaque"><param name="allowScriptAccess" value="always"><param name="SCALE" value="exactfit"><param name="flashvars" value="playMovie=true&isAutoPlay=true"></object>',
            flash: '<iframe width="mywidth" height="myheight" src="myurl" frameborder="0" allowfullscreen></iframe>',
            id: 'XMTcwMDMxNTA4',
            url: 'youtube',
            width: '500',
            height: '282',
            warning: 'You need Flash Player enabled.'
        }, callerSettings || {});
        var checkFlash = function() {
            //checks if flash is installed/enabled on the browser
            var hasFlash = false;
            try {
                var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (fo) {
                    hasFlash = true;
                }
            } catch (e) {
                if (navigator.mimeTypes["application/x-shockwave-flash"] !== undefined) {
                    hasFlash = true;
                }
            }
            return hasFlash;
        };
        var showvideo = function(uri) {
            var okFlash = true,
                yk,
                ytb = 'http' + (/^https/.test(location.protocol) ? 's' : '') + '://www.youtube.com/embed/myid?autoplay=1&wmode=opaque';
            if ($('html').hasClass('desktop')) {
                okFlash = checkFlash();
                yk = 'http://static.youku.com/v/swf/qplayer.swf?VideoIDS=myid=&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0';
            } else {
                //yk = 'http://player.youku.com/embed/myid';
                yk = 'http://static.youku.com/v1.0.0149/v/swf/loader.swf?VideoIDS=myid&quality=high&isAutoPlay=true&winType=adshow';
            }
            if (okFlash) {
                // youku or youtube
                if (uri.length === 11) {
                    //Youtube
                    settings.id = ytb.replace(/myid/, uri);
                } else {
                    //Youku
                    settings.id = yk.replace(/myid/, uri);
                    settings.flash = "<embed src='myurl' allowFullScreen='true' quality='high' width='mywidth' height='myheight' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash'></embed>";
                }
                return uri === 'youku' ? settings.flash.replace(/myurl/, settings.id).replace(/mywidth/, settings.width).replace(/myheight/, settings.height) : settings.flash.replace(/myurl/, settings.id).replace(/mywidth/, settings.width).replace(/myheight/, settings.height);
            } else {
                return settings.warning;
            }
        };
        return this.empty().html(showvideo(settings.id));
    };
})(jQuery);