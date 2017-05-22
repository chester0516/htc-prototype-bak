//Required JS
// <script src="ek-assets/digital-first/js/vendor/purl.js"></script>
// <script src="ek-assets/digital-first/js/vendor/jquery.history.js"></script>


/* global History, commonSetting */
var stateStatus = (function() {
    'use strict';

    var stateStatus = {
        check: function() {
            var hasSetup = false,
                url = $.url(),
                mainInfo = $('.board-large-info'),
                paramMenu = url.param('showmenu'),
                paramContent = url.param('showcontent');

            if (typeof paramMenu !== 'undefined') {
                mainInfo.removeClass('m-show-content');
                mainInfo.addClass('m-show-menu');
                $('body').removeClass('product-content-page-init');
                hasSetup = true;
            }

            if (typeof paramContent !== 'undefined') {
                mainInfo.removeClass('m-show-menu');
                mainInfo.addClass('m-show-content');
                $('body').removeClass('product-content-page-init');
                hasSetup = true;
            }

            if (!hasSetup) {
                if ($('body').hasClass('m-landing-page')) {
                    mainInfo.addClass('m-show-menu');
                    $('body').addClass('product-content-page-init');
                } else {
                    mainInfo.addClass('m-show-content');
                }
            }
        }
    };

    return stateStatus;
}());

var menus = (function() {
    'use strict';

    var menus = {
        init: function() {
            menus.resetLinksForMobile();
            menus.backtoClick();
        },
        backtoClick: function() {
            $('.back-to-menu').unbind('click').bind('click', function() {
                History.pushState({ rand: Math.random(), top: 1 }, '', '?showmenu=1');
            });
        },
        resetLinksForMobile: function() {
            var currentUrl = location.href;
            $.each($('.nav li'), function(index, val) {
                var insideLink = $(this).find('a').attr('href');
                if (commonSetting.isMobile()) {
                    if (typeof insideLink !== 'undefined') {
                        $(this).find('a').attr('href', insideLink + '?showcontent=1');
                    }
                }
            });

        }
    };

    return menus;
}());

$(document).ready(function() {
    'use strict';
    menus.init();
    stateStatus.check();
});

$(window).resize(function(event) {
    'use strict';
    commonSetting.forcePageReload();
});

(function(window, undefined) {
    'use strict';
    // Check Location
    if (document.location.protocol === 'file:') {
        alert('The HTML5 History API (and thus History.js) do not work on files, please upload it to a server.');
    }

    //State change
    History.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
        stateStatus.check();
    });

})(window);