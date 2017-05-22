var vcode = '';
var appointment = (function() {
    'use strict';

    var appointment = {
        setupSlider: function() {
            var stageWidth = $('.sliderkit').width();
            $('.sliderkit-nav-clip').width(stageWidth);
            $('.singleslot').width(stageWidth);
        },
        init: function() {
            $('.reservation-button .call').on('click', function(e) {
                e.preventDefault();
                changetype('call');
            });
            $('.reservation-button .in-store').on('click', function(e) {
                e.preventDefault();
                changetype('service');
            });

            $('.time-vertical').sliderkit({
                shownavitems: 6,
                verticalnav: true,
                navclipcenter: true,
                auto: false,
                navfxbefore: function() {
                    $('.singleslot').removeClass('sliderkit-selected');
                }
            });
            $('.singleslot').removeClass('sliderkit-selected');
            $('.singleslot').on('click', function(e) {
                e.preventDefault();
                $('.singleslot').removeClass('sliderkit-selected');
                $(this).addClass('sliderkit-selected');
                $(this).children('label').children("input[type=radio]").attr('checked', 'checked');

                var DateTimeString = $('#alternate').val() + ' @ ' + $(this).children('label').text();
                $('.time-value').html(DateTimeString);

                //show message at final step
                if (problemtype == 'call') {
                    $('.at-value').hide();
                    $('.store-value').hide();
                    $('.address-value').hide();
                } else {
                    var ShopId = $('input[name=rdShop]:checked').val();
                    var storename = $("#shop" + ShopId).children("div .location-title").html();
                    var address = $("#shop" + ShopId).children("div .location-text").html();
                    $('.store-value').html(storename);
                    $('.address-value').html(address);
                }

                //show final step
                $('.confirm-form-column').slideDown(300, function() {
                    //scroll to final step
                    $('html, body').animate({
                        scrollTop: $('.confirm-form-column').offset().top - $('.d-header').height()
                    }, 300);
                });

            });
        }
    };
    return appointment;
}());

$(document).ready(function() {
    appointment.init();
    if ($('body').data('site') == 'vn') {
        $(".call").hide();
    }
    if ($('body').data('site') == 'de' || $('body').data('site') == 'ru') {
        $(".in-store").hide();
    }
});
$(window).resize(function() {
    appointment.setupSlider();
});