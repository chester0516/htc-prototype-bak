/* global searchData, commonSetting, History, TimelineLite, TweenLite */
var backupTransfer = (function() {
    'use strict';
    var _hiddenTopic,
        setting={
            'clsNameContainer': '.backup-transfer-list'
        };


    var backupTransfer = {
        itemsInRow: function() {
            var lisInRow = 0;
            $('.product-item').each(function() {

                if ($(this).prev().length > 0) {
                    if ($(this).position().top !== $(this).prev().position().top) {
                        return false;
                    }
                    lisInRow++;
                } else {
                    lisInRow++;
                }
            });
            return lisInRow;
        },
        detectAlignStart: function() {
            var itemsEveryRow = backupTransfer.itemsInRow(),
                totalProducts = $('.product-item').length;
            $('.flex-box-area').removeClass('align-start');
            if (totalProducts % itemsEveryRow !== 0) {
                $('.flex-box-area').addClass('align-start');
            }
        },
        appendAfterItem: function(idx) {
            var itemsEveryRow = backupTransfer.itemsInRow(),
                resultRow = 1;

            for (var i = itemsEveryRow; i < $('.product-item').length; i += itemsEveryRow) {
                // console.log('idx=' + idx + " < i=" + i);
                if (idx < i) {
                    return i - 1;
                } else {
                    resultRow += 1;
                }
            }
        },
        scrollToSubItem: function(detailItemHeight) {

            var headerHeight = 70,
                $carrier = $('.flex-box-area').find('.detail-item'),
                timeLineObj = new TimelineLite();

            //scroll to family section
            //timeLineObj.add(TweenLite.to(window, 0.5, { scrollTo: { y: setting.clsNameContainer, offsetY: headerHeight } }));
            //expand product detail list
            timeLineObj.add(TweenLite.set($carrier, { height: 'auto' }));
            timeLineObj.add(TweenLite.from($carrier, 0.5, { height: detailItemHeight }), '-=0.5');
            //show product items
            timeLineObj.call(function() {
                $carrier.addClass('active');
            }, [], this, '-=0.2');
            //start 
            timeLineObj.play();

        },
        collapseCarrier: function(){
            console.log('test');
            var $carrier = $('.flex-box-area').find('.detail-item'),
                timeLineObj = new TimelineLite();
            //expand product detail list
            
            timeLineObj.add(TweenLite.to($carrier, 0.5, { height: 0 }), '+=0.4');
            //show product items
            timeLineObj.call(function() {
                $carrier.removeClass('active');
            }, [], this);
            //start 
            timeLineObj.play();
        },
        expandList: function(slideAnimation) {
            var detailItemsContainer = $('.flex-box-area').find('.detail-item'),
                detailItemHeight = 0;

            if (detailItemsContainer.length > 0) {
                detailItemHeight = detailItemsContainer.height();
                detailItemsContainer.css('height', 'auto').removeClass('active').html('');
            } else {
                detailItemsContainer = $('<div class="detail-item"></div>');
            }

            $('.product-item').each(function(index, el) {
                /* iterate through array or object */
                var currentItem = $(this);
                if ($(this).hasClass('selected')) {
                    var currentIndex = index,
                        selectedTitle = $(this).find('.product-name').text(),
                        appendItemIndex = backupTransfer.appendAfterItem(currentIndex),
                        itemLength = $(this).find('.related-products').children('a').size(),
                        classCountItems = 'detail-item' + itemLength,
                        appendHtml = '<div class="related-product-group popup-window"><div class="btn-close"></div><div class="popup-title m-popup-title">' + selectedTitle + '</div>' + $(this).find('.related-products').html() + '</div>';

                    if (typeof appendItemIndex === 'undefined') {
                        detailItemsContainer.append(appendHtml).insertAfter($('.product-item').last());
                    } else {
                        detailItemsContainer.append(appendHtml).insertAfter($('.product-item').eq(appendItemIndex));
                    }
                    

                    if (commonSetting.isMobile()) {
                        detailItemsContainer.addClass('active');
                        commonSetting.addMobilePopupFix();
                    } else {
                        backupTransfer.scrollToSubItem(detailItemHeight);
                    }

                    backupTransfer.closeBtnClick();
                    commonSetting.addMobilePopupFix();
                }
            });

            backupTransfer.detectAlignStart();
        },
        restoreTopicSelection: function(initial) {
            $('.product-item').removeClass('selected');
            $('.product-item').eq(_hiddenTopic.val()).addClass('selected');

            backupTransfer.expandList(true);
        },
        topicClick: function() {
            $('.product-item').off('click').on('click', function(event) {
                /* Act on the event */
                if (!$(this).hasClass('selected')) {
                    _hiddenTopic.val($(this).index());
                    backupTransfer.pushParams();
                }
            });
        },
        closeBtnClick: function() {
            //console.log('test');
            $('.btn-close').click(function() {
                backupTransfer.collapseCarrier();
                _hiddenTopic.val('');
                backupTransfer.pushParams();
            });
        },
        //stateUPdate
        initObj: function() {
            _hiddenTopic = $('.hidden-seleted-topic');
        },
        updateHiddenInput: function(callback) {
            var url = $.url(),
                paramTopic = url.param('topic');

            backupTransfer.initObj();

            _hiddenTopic.val('');

            if (typeof paramTopic !== 'undefined') {
                _hiddenTopic.val(paramTopic);
            }
            //update hidden iputs and then
            callback();
        },
        pushParams: function() {
            var selectedTopic = _hiddenTopic.val(),
                urlPath = '';
            if (typeof selectedTopic !== 'undefined' && selectedTopic.length > 0) {
                urlPath += '&topic=' + selectedTopic;
            }

            // if (urlPath.length > 0) {
            //     urlPath = '?' + urlPath.substring(1, urlPath.length);
            // }

            History.pushState({ rand: Math.random(), topic: selectedTopic }, document.title, '?' + urlPath);
        },
        restorePageStatus: function(initial) {
            backupTransfer.topicClick();
            
            // console.log('_hiddenTopic.val()=' + _hiddenTopic.val());
            if (_hiddenTopic.val() !== '') {
                backupTransfer.restoreTopicSelection(initial);
            } else {
                if (!commonSetting.isMobile() && initial) {
                    $('.product-item').eq(0).addClass('selected');
                    backupTransfer.expandList(false);
                } else {
                    $('.detail-item').removeClass('active');
                    commonSetting.removeMobilePopupFix();
                    setTimeout(function() {
                        $('.product-item').removeClass('selected');
                        $('.detail-item').remove();
                    }, 500);
                }
            }
        }
    };

    return backupTransfer;
}());

$(window).resize(function() {
    'use strict';
    commonSetting.forcePageReload();
});

$(document).ready(function() {
    'use strict';
});

(function(window, undefined) {
    'use strict';
    // Check Location
    if (document.location.protocol === 'file:') {
        alert('The HTML5 History API (and thus History.js) do not work on files, please upload it to a server.');
    }

    backupTransfer.updateHiddenInput(function() {
        backupTransfer.restorePageStatus(true);

    });

    History.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
        var State = History.getState();

        backupTransfer.updateHiddenInput(function() {
            backupTransfer.restorePageStatus(false);
        });
    });

})(window);