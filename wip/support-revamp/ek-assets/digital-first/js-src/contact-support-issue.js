/*global Clipboard*/
var contactSupportIssue = (function() {
	'use strict';

	var contactSupportIssue = {
		init: function(){
			contactSupportIssue.popupSingleContent();
			contactSupportIssue.setupClosePopupBtn();
			contactSupportIssue.buildSingleContentShortLink();
		},
		popupSingleContent: function() {
            $('.popup-area').addClass('showed');
            $('body').addClass('support-popup-fixed');
        },
        setupClosePopupBtn: function(){
			var popArea = $('.popup-area'),
                closeBtn = popArea.find('.btn-close'),
                returnUrl = closeBtn.data('url');
            if (closeBtn.length > 0 && typeof returnUrl !== 'undefind') {
                closeBtn.off('click').on('click', function() {
                    location.href = returnUrl;
                });
            }
        },
        buildSingleContentShortLink: function() {
            $('.go-to-page').attr('data-clipboard-text', location.href);
            var clipboard = new Clipboard('.go-to-page');

            clipboard.on('success', function(e) {
                $('.copy-msg').addClass('show');
                // setTimeout(function(){
                //     $('.copy-msg').removeClass('show');
                // }, 1000);
                e.clearSelection();
            });
        },
	};

	return contactSupportIssue;
}());

$(document).ready(function() {
	'use strict';
	contactSupportIssue.init();
});

