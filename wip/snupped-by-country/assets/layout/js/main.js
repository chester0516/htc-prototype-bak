$(document).ready(function() {
    'use strict';
    if ($('.cta-btn.invite-btn').length) {
        $('.cta-btn.invite-btn').on('click', function(event) {
            event.preventDefault();
            /* Act on the event */
            /*global FB*/
            FB.ui({
                app_id: '1818922835004243',
                method: 'share',
                mobile_iframe: true,
                hashtag: '#HTC網路商店',
                href: 'https://estore.htc.com/tw/promotion/cases-live-travel-adventure?id=1234',
                redirect_uri: 'https://estore.htc.com/tw/promotion/cases-live-travel-adventure',
                title: 'HTC x SNUPPED – HTC你的完美旅伴',
                picture: 'https://estore.htc.com/tw/promotion/cases-live-travel-adventure/assets/layout/img/banner-1200.jpg'
            }, function(response) {});
        });
    }
    if ($('.cta-btn.member-btn').length) {
        $('.cta-btn.member-btn').on('click', function(event) {
            event.preventDefault();
            /* Act on the event */
            location.href = location.href = 'https://estore.htc.com/tw/buy/zh-TW/shop/LogonForm?catalogId=10001&myAcctMain=1&langId=-7&storeId=10001&prevUrl=' + encodeURIComponent(document.location.href);
        });
    }
    if ($('#back-to-top').length) {
        var scrollTrigger = 100, // px
            backToTop = function() {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            };
        backToTop();
        $(window).on('scroll', function() {
            backToTop();
        });
        $('#back-to-top').on('click', function(e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }
});
