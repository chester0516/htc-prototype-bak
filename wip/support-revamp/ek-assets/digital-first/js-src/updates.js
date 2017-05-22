$(document).ready(function() {
    'use strict';
    updates.init();
});

var updates = (function() {
	'use strict';
    var updates = {
        init: function() {
            updates.openPopupWindow();
            updates.closeBtnClick();
            updates.popupListClick();
            updates.filterDownload(0);
        },
        openPopupWindow: function() {
            $('.btn-open-popup').click(function() {
                $('.popup-area').addClass('show');
                $('body').addClass('support-popup-fixed');
            });
        },
        closeBtnClick: function() {
            $('.popup-window').find('.btn-close').click(function() {
                $('.popup-area').removeClass('show');
                $('body').removeClass('support-popup-fixed');
            });
        },
        popupListClick: function() {
            var value = '';
            $('.popup-list').find('li').click(function() {
                value = $(this).html().replace(/&amp;/g, '&');
                $('.popup-area').removeClass('show');
                $('body').removeClass('support-popup-fixed');
                $('.btn-open-popup .btn-wording').text(value);

                updates.filterDownload($(this).index());
            });
        },
        filterDownload: function(carrierIndex){
            var rowItems = $('.download-list-area .table-row');
            rowItems.removeClass('show').removeClass('last-one-remove-padding');
            $.each(rowItems, function(index, val) {
                 /* iterate through array or object */
                 if($(this).hasClass('carrier_' + carrierIndex)){
                    $(this).addClass('show');
                 }
            });
            rowItems.filter('.show:last').addClass('last-one-remove-padding');
        }
    };

    return updates;
}());