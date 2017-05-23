var isDesktopView = true;


var commonSetting = (function() {
    'use strict';
    var commonSetting = {
        init: function() {
            commonSetting.setupParallaxScroll();
        },
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
        isPrototypeHost: function() {
            var returnResult = false,
                hostName = location.host;
            if (hostName.indexOf('p1.htc.com') > -1 || hostName.indexOf('prototype-www.htc.com') > -1 || hostName.indexOf('rawgit.com') > -1) {
                returnResult = true;
            }
            return returnResult;
        },
        setupParallaxScroll: function() {
            // parallax scroll
            // $(window).scroll(function(event) {
            //     var parallaxImg = $('.parallax-img'),
            //         scrollTopPosition = $(this).scrollTop();
            //     if (parallaxImg.length > 0) {
            //         $('.parallax-img').css('top', -parseInt(scrollTopPosition / 2.5, 10) + 'px');
            //     }
            // });
        },
        forcePageReload: function() {
            //Force page reload when desktop and mobile switch
            if (commonSetting.switchResolution()) {
                location.reload();
            }
        },
        switchResolution: function() {
            var resultSwitch = false;
            if ($(window).width() <= commonSetting.mobileMaxReserlution() && isDesktopView) {
                resultSwitch = true;
            }
            if ($(window).width() > commonSetting.mobileMaxReserlution() && !isDesktopView) {
                resultSwitch = true;
            }
            return resultSwitch;
        },
        addMobilePopupFix: function() {
            $('body').addClass('m-support-popup-fixed');
            $('.htc-main').addClass('m-support-popup-fixed');
            $('.listing-detailed-container').addClass('m-support-popup-fixed');
            if ($('body').hasClass('backuptransfer-page')) {
                $('.backup-transfer-list').addClass('m-support-popup-fixed');
            }
        },
        removeMobilePopupFix: function() {
            $('body').removeClass('m-support-popup-fixed');
            $('.htc-main').removeClass('m-support-popup-fixed');
            $('.listing-detailed-container').removeClass('m-support-popup-fixed');
            if ($('body').hasClass('backuptransfer-page')) {
                $('.backup-transfer-list').removeClass('m-support-popup-fixed');
            }
        }
    };
    return commonSetting;
}());
$(document).ready(function() {
    'use strict';
    var width = $(window).width();
    if (commonSetting.isMobile()) {
        isDesktopView = false;
    }
    commonSetting.init();
});