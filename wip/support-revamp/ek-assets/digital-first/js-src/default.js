/*global commonSetting, History, TweenLite, TimelineLite*/
var subPromo = (function() {
    'use strict';
    var subPromo = {
        init: function() {
            subPromo.itemClick();
        },
        itemClick: function() {
            var promoItmes = $('.subpromo .promo-item');
            if (promoItmes.length > 0) {
                promoItmes.on('click', function() {
                    var urlLink = $(this).find('a').attr('href');
                    location.href = urlLink;
                });
            }
        }
    };
    return subPromo;
}());
var topicList = (function() {
    'use strict';
    var topicList = {
        init: function() {
            topicList.topicClick();
        },
        topicClick: function() {
            $('.topic-item').click(function() {
                if (!$(this).hasClass('selected')) {
                    $('.topic-item').removeClass('selectes');
                    $(this).addClass('selected');
                }
            });
        }
    };
    return topicList;
}());
var productList = (function() {
    'use strict';
    var _hiddenFamily,
        _hiddenProduct,
        setting = {
            'clsNameContainer': '.listing-detailed-container'
        };
    var productList = {
        init: function() {},
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
        appendAfterItem: function(idx) {
            var itemsEveryRow = productList.itemsInRow(),
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
        removeDetailItem: function(callback) {
            $('.detail-item').removeClass('active');
            commonSetting.removeMobilePopupFix();
            setTimeout(function() {
                $('.product-item').removeClass('selected');
                $('.detail-item').remove();
                callback();
            }, 500);
        },
        removePopupItem: function() {
            $('.carrier-popup').removeClass('show');
            $('body').removeClass('support-popup-fixed');
        },
        scrollToSubItem: function(detailItemHeight) {
            var headerHeight = 70,
                $carrier = $('.flex-box-area').find('.detail-item'),
                timeLineObj = new TimelineLite({immediateRender: false});

            //scroll to family section
            // timeLineObj.add(TweenLite.to(window, 0.5, {
            //     scrollTo: {
            //         y: setting.clsNameContainer,
            //         offsetY: headerHeight
            //     }
            // }));
            
            //use jquery animation
            var scrollHeightPosition = $(setting.clsNameContainer).offset().top - headerHeight;
             $("html, body").animate({ scrollTop: scrollHeightPosition }, 500);
            //expand product detail list
            timeLineObj.add(TweenLite.set($carrier, {
                height: 'auto'
            }));
            timeLineObj.add(TweenLite.from($carrier, 0.5, {
                height: detailItemHeight
            }), '-=0.49');
            //show product items
            timeLineObj.call(function() {
                $carrier.addClass('active');
            }, [], this, '-=0.49');
            //start 
            timeLineObj.play();
        },
        collapseCarrier: function() {
            var $carrier = $('.flex-box-area').find('.detail-item'),
                timeLineObj = new TimelineLite();
            //expand product detail list
            timeLineObj.add(TweenLite.to($carrier, 0.5, {
                height: 0
            }), '+=0.4');
            //show product items
            timeLineObj.call(function() {
                $carrier.removeClass('active');
            }, [], this);
            //start 
            timeLineObj.play();
        },
        expandList: function(slideAnimation) {
            var detailItemsContainer = $('.detail-item'),
                detailItemHeight = 0;
            if (!commonSetting.isMobile()) {
                $('.flex-box-area').removeClass('add-padding');
            }
            if (detailItemsContainer.length > 0) {
                detailItemHeight = detailItemsContainer.height();
                detailItemsContainer.css('height', 'auto').removeClass('active').html('');
            } else {
                detailItemsContainer = $('<div class="detail-item"></div>');
            }
            $('.product-item').each(function(index, el) {
                /* iterate through array or object */
                if ($(this).hasClass('selected')) {
                    var currentIndex = index,
                        appendItemIndex = productList.appendAfterItem(currentIndex),
                        appendHtml = '<div class="related-product-group popup-window"><div class="btn-close"></div><div class="popup-title m-popup-title">' + $('.hidden-select-product-model').val() + '</div>' + $(this).find('.related-products').html() + '</div>';
                    if (typeof appendItemIndex === 'undefined') {
                        detailItemsContainer.append(appendHtml).insertAfter($('.product-item').last());
                    } else {
                        detailItemsContainer.append(appendHtml).insertAfter($('.product-item').eq(appendItemIndex));
                    }
                    if (commonSetting.isMobile()) {
                        detailItemsContainer.addClass('active');
                        commonSetting.addMobilePopupFix();
                    } else {
                        productList.scrollToSubItem(detailItemHeight);
                    }
                    productList.closeBtnClick();
                    productList.productClick();
                }
            });
        },
        familyClick: function() {
            $('.product-item').click(function(event) {
                /* Act on the event */
                var outsideLink = $(this).data('url');
                if (typeof outsideLink !== 'undefined' && outsideLink.length > 0) {
                    location.href = outsideLink;
                } else {
                    if (!$(this).hasClass('selected')) {
                        _hiddenProduct.val('');
                        _hiddenFamily.val($(this).index());
                        productList.pushParams();
                    }
                }
            });
        },
        restoreFamilySelection: function() {
            $('.product-item').removeClass('selected');
            $('.product-item').eq(_hiddenFamily.val()).addClass('selected');
            productList.expandList(true);
        },
        productClick: function() {
            $('.product-list-container .related-product-item').off('click').on('click', function(event) {
                event.preventDefault();
                var carrierList = $(this).find('.hidden-carrier-block');
                if (carrierList.length > 0) {
                    //show popup
                    _hiddenProduct.val($(this).index());
                    productList.pushParams();
                } else {
                    //page redirect
                    var newUrl;
                    if (commonSetting.isPrototypeHost()) {
                        newUrl = 'product-landing.htm?pname_id=' + $(this).data('pname-id');
                    } else {
                        newUrl = $(this).attr('href');
                    }
                    location.href = newUrl;
                }
            });
        },
        restoreProductSelection: function() {
            var carrierListHtml = $('.detail-item .related-product-item').eq(_hiddenProduct.val()).find('.hidden-carrier-block').html();
            $('.carrier-popup').find('.popup-list').html(carrierListHtml);
            productList.openPopupWindow();
            productList.closePopupWindowClick();
        },
        openPopupWindow: function() {
            $('.carrier-popup').addClass('show');
            productList.carrierPopupListClick();
            $('body').addClass('support-popup-fixed');
        },
        closePopupWindowClick: function() {
            $('.carrier-popup').find('.btn-close').click(function() {
                _hiddenProduct.val('');
                if (commonSetting.isMobile()) {
                    _hiddenFamily.val('');
                }
                productList.pushParams();
            });
        },
        carrierPopupListClick: function() {
            var value = '';
            $('.carrier-popup').find('.popup-list > li').click(function() {
                location.href = $(this).data('url');
            });
        },
        closeBtnClick: function() {
            $('.detail-item').find('.btn-close').click(function() {
                productList.collapseCarrier();
                _hiddenProduct.val('');
                _hiddenFamily.val('');
                productList.pushParams();
            });
        },
        //stateUPdate
        initObj: function() {
            _hiddenFamily = $('.hidden-seleted-family');
            _hiddenProduct = $('.hidden-seleted-product');
        },
        updateHiddenInput: function(callback) {
            var url = $.url(),
                paramFamily = url.param('family'),
                paramProduct = url.param('product');
            productList.initObj();
            _hiddenFamily.val('');
            _hiddenProduct.val('');
            if (typeof paramFamily !== 'undefined') {
                _hiddenFamily.val(paramFamily);
                if (typeof paramProduct !== 'undefined') {
                    _hiddenProduct.val(paramProduct);
                }
            }
            //update hidden iputs and then
            callback();
        },
        pushParams: function() {
            var selectedFamily = _hiddenFamily.val(),
                selectedProduct = _hiddenProduct.val(),
                urlPath = '';
            // console.log('selectedFamily.length=' + selectedFamily.length);
            // console.log('selectedFamily=' + selectedFamily + '||selectedProduct=' + selectedProduct);
            if (typeof selectedFamily !== 'undefined' && selectedFamily.length > 0) {
                urlPath += '&family=' + selectedFamily;
            }
            if (typeof selectedProduct !== 'undefined' && selectedProduct.length > 0) {
                urlPath += '&product=' + selectedProduct;
            }
            History.pushState({
                rand: Math.random(),
                family: selectedFamily,
                product: selectedProduct
            }, document.title, '?' + urlPath);
        },
        restorePageStatus: function() {
            productList.familyClick();
            if (_hiddenFamily.val() !== '') {
                productList.restoreFamilySelection();
                if (_hiddenProduct.val() !== '') {
                    productList.restoreProductSelection();
                }
            } else {
                if (!commonSetting.isMobile()) {
                    $('.flex-box-area').addClass('add-padding');
                }
            }
        },
        setupClickStatus: function() {
            productList.familyClick();
            if (_hiddenProduct.val() !== '') {
                productList.restoreProductSelection();
            } else {
                productList.removePopupItem();
                if (_hiddenFamily.val() !== '') {
                    productList.restoreFamilySelection();
                } else {
                    productList.removeDetailItem(function() {
                        if (!commonSetting.isMobile()) {
                            $('.flex-box-area').addClass('add-padding');
                        }
                    });
                }
            }
        }
    };
    return productList;
}());
$(document).ready(function() {
    'use strict';
    topicList.init();
    subPromo.init();
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
    productList.updateHiddenInput(function() {
        productList.restorePageStatus();
    });
    History.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
        var State = History.getState();
        productList.updateHiddenInput(function() {
            productList.setupClickStatus();
            // console.log('Adapter');
        });
    });
})(window);