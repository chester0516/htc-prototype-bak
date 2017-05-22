var applications = (function() {
	'use strict';

	var applications = {
		init: function(){
			applications.stopOnSingleContent();
		},
		stopOnSingleContent: function() {
            var currentUrl = decodeURIComponent(location.href);
            $.each($('.nav li'), function(index, val) {
                /* iterate through array or object */
                var insideLink = $(this).find('a').attr('href');
                if (typeof insideLink !== 'undefined' && currentUrl.indexOf(insideLink) > -1) {
                    $(this).parents('ul').addClass('open');
                    $(this).parent().siblings().addClass('open');
                    $(this).parents('ul').siblings('a').addClass('bold');
                    $(this).find('a').addClass('bold');
                }
            });

            var boldLink = $('.nav li a.bold');
            if(boldLink.length > 1){
                //remove top artiles super category
                boldLink.eq(0).removeClass('bold');
            }
        }
	};

	return applications;
}());

$(document).ready(function() {
	'use strict';
	nav.init();
	applications.init();
});