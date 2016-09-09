/*global ScrollMagic, picturefill, Site, isEmail*/
var scrollMagicController;
var videoBackgroundSection = (function() {
    'use strict';

    var videoBackgroundSection = {
        init: function() {
            if ($('section.video-background').length > 0) {
                $.each($('section.video-background'), function(index, val) {
                    if ($('html').hasClass('video')) {
                        //show mp4
                        // $(this).find('.bg-block picture').hide();
                        var currentObj = $(this),
                            videoItem = currentObj.find('.bg-block .video-block'),
                            captionBlock = currentObj.find('.caption-block'),
                            videoPath = videoItem.data('video-path'),
                            paddingHeight = 80,
                            // durationHeight = currentObj.height() - paddingHeight * 2,
                            durationHeight = $(window).width() * 0.417 - paddingHeight * 2,
                            videoInstance, videoObj, scene;

                        // console.log(index + ':durationHeight=' + durationHeight);
                        videoItem.vide(videoPath, {
                            muted: true,
                            loop: false,
                            autoplay: false,
                            posterType: 'jpg'
                        });
                        videoInstance = videoItem.data('vide');
                        videoObj = videoInstance.getVideoObject();


                        videoObj.addEventListener('ended', function() {
                            $(videoObj).removeClass('played');
                            captionBlock.addClass('fadein-after-video');
                        }, false);



                        // build scene:
                        // debug
                        // .addIndicators({
                        //     name: index + '(offset: 100)'
                        // })
                        scene = new ScrollMagic.Scene({
                            triggerElement: videoObj,
                            offset: paddingHeight,
                            duration: durationHeight,
                        }).addTo(scrollMagicController).on("enter leave", function(e) {
                            // console.log('test');
                            if (e.type === 'enter' && !$(videoObj).hasClass('played')) {
                                videoObj.play();
                                $(videoObj).addClass('played'); //Play once
                                captionBlock.removeClass('fadein-after-video');
                            }
                        });
                        // scene.addIndicators({
                        //     name: index + '(offset: 100)'
                        // });
                        // console.log(videoObj);
                        // console.log(scene);

                        $(window).resize(function(event) {
                            /* Act on the event */
                            scene.duration(currentObj.height() - paddingHeight * 2);
                        });

                    }
                    //else {
                    //     //show picture
                    // }
                });
            }
        }
    };

    return videoBackgroundSection;
}());

var customizeAnimationSection = (function() {
    'use strict';

    var customizeAnimationSection = {
        init: function() {
            if ($('section.customized-animation').length > 0) {
                $.each($('section.customized-animation'), function(index, val) {
                    /* iterate through array or object */
                    var currentObj = $(this),
                        flyingPhone = currentObj.find('.animation-phone-flying'),
                        paddingHeight = 80,
                        durationHeight = $(window).width() * 0.417 - paddingHeight * 2;

                    // console.log('height=' + currentObj.height());
                    // build scene
                    var scene = new ScrollMagic.Scene({
                        triggerElement: ".customized-animation",
                        offset: paddingHeight,
                        duration: durationHeight
                    }).addTo(scrollMagicController).on("update enter leave", function(e) {
                        // $("#scrollDirection").text(e.target.controller().info("scrollDirection"));
                        if (e.type === "enter") {
                            // console.log('enter');
                            if (e.target.controller().info("scrollDirection") === 'FORWARD') {
                                // console.log('FORWARD');
                                flyingPhone.addClass('move-up');
                            } else {
                                // console.log('FORWARD opp');
                                flyingPhone.addClass('move-down');
                            }
                        } else {
                            flyingPhone.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                                function(e) {
                                    flyingPhone.removeClass('move-up');
                                    flyingPhone.removeClass('move-down');
                                });
                        }
                    });

                    // scene.addIndicators({
                    //     name: index,
                    //     colorEnd: "transparent"
                    // });

                    $(window).resize(function(event) {
                        /* Act on the event */
                        scene.duration(currentObj.height() - paddingHeight * 2);
                    });
                });
            }

        }
    };

    return customizeAnimationSection;
}());

var videoInPhoneSection = (function() {
    'use strict';

    var videoInPhoneSection = {
        init: function() {
            if ($('section.video-in-phone').length > 0) {
                $.each($('section.video-in-phone'), function(index, val) {
                    if ($('html').hasClass('video')) {
                        var currentObj = $(this),
                            videoItem = currentObj.find('.video-block'),
                            videoPath = videoItem.data('video-path');

                        videoItem.vide(videoPath, {
                            muted: true,
                            loop: false,
                            autoplay: true,
                            posterType: 'jpg'
                        });
                    }
                });
            }
        }

    };

    return videoInPhoneSection;
}());

var carouselColorSection = (function() {
    'use strict';

    var carouselColorSection = {
        init: function() {
            if ($('section.carousel-colors').length > 0) {
                $.each($('section.carousel-colors'), function(index, val) {
                    /* iterate through array or object */
                    var currentObj = $(this),
                        owl;
                    owl = currentObj.find('.carousel-block');
                    owl.owlCarousel({
                        animateOut: 'fadeOut',
                        animateIn: 'fadeIn',
                        nav: false,
                        dots: true,
                        items: 1,
                        smartSpeed: 450,
                        dotsContainer: '.dots-flex-box'
                    });
                });
            }
        }
    };

    return carouselColorSection;
}());

var infoBar = (function() {
    'use strict';

    var infoBar = {
        init: function() {
            infoBar.setupSticky();
            infoBar.scrollToSpec();
            infoBar.kspLinksClick();
        },
        scrollToSpec: function() {
            if ($('.specs-toggle').length > 0) {
                $('.specs-toggle').click(function(e) {
                    e.preventDefault();
                    var specsPosition = $('.specs-container').offset().top - 30;
                    $('html, body').animate({
                        scrollTop: specsPosition
                    }, 1000);
                });
            }
        },
        setupSticky: function() {
            // passing options
            if (!$('.info-bar').parent().hasClass('scrollmagic-pin-spacer')) {
                var scene, controller;
                controller = new ScrollMagic.Controller({
                    loglevel: 3,
                    globalSceneOptions: {
                        // set trigger hook to top of viewport
                        triggerHook: 'onLeave'
                    }
                });
                scene = new ScrollMagic.Scene({
                    triggerElement: '.info-bar'
                }).setPin('.info-bar').addTo(controller);
            }

        },
        kspLinksClick: function() {
            // ksp dropdown menu on mobile
            if ($('.ksp-links a').length > 0) {
                $('.ksp-toggle').addClass('has-links');
                $('html').click(function() {
                    $('.ksp-toggle').removeClass('active');
                    $('.ksp-links').removeClass('show');
                });
                $('.ksp-toggle').click(function(e) {
                    e.stopPropagation();
                    $(this).toggleClass('active');
                    $('.ksp-links').toggleClass('show');
                });
            }
        }
    };

    return infoBar;
}());

var sigupBox = (function() {
    'use strict';

    var sigupBox = {
        init: function() {
            // signup email processing
            if ($('.email-signup form.signup-form').length > 0) {
                $('.email-signup form.signup-form input.submit-button').click(function(e) {
                    // prevent default behavior
                    if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }

                    var reviewSite = new Site();

                    reviewSite.emailAddPDP = $(this).parent().find('input.launch-email').val();

                    if (isEmail(reviewSite.emailAddPDP)) { // email is valid
                        $('form.signup-form input.launch-email').removeClass('invalid');

                        var product_id = $('meta[name=product_name_id]').attr('content');

                        product_id = (typeof product_id === 'undefined') ? '' : product_id;
                        var cta_id = (product_id === '') ? 'review-form' : (product_id + '-signup'),
                            pname = (product_id === '') ? '' : (product_id.replace(/-/g, ' '));


                        reviewSite.subscriptionSubmission('pdp', cta_id, product_id, pname);

                    } else { // email NOT valid
                        $('.email-signup .error-message').show();
                        $('form.signup-form input.launch-email').addClass('invalid');
                    }
                });
            }
            // END: email sign-up submission
        }
    };

    return sigupBox;
}());

$(document).ready(function() {
    'use strict';
    if ($('body').hasClass('template_free_scroll_2016')) {
        picturefill();
        scrollMagicController = new ScrollMagic.Controller();
        infoBar.init();
        videoBackgroundSection.init();
        videoInPhoneSection.init();
        carouselColorSection.init();
        sigupBox.init();
        customizeAnimationSection.init();
    }


});
