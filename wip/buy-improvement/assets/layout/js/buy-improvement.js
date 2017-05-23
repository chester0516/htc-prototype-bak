/*global History, productIDs*/
/*History is a plugin*/

/*
TODO:
1.Call API to update price
2.Add to cart API
 */

var buyJourney = (function() {
    'use strict';

    var _pageTemplate,
        _selectModel,
        _selectCarrier,
        _selectColor,
        _hiddenModal,
        _hiddenCarrier,
        _hiddenColor,
        _selectAddToCart,
        _breadcrumbModel,
        _breadcrumbCarrier,
        _breadcrumbColor,
        _availableCarriersInCarrierSection,
        _availableColorsInColorSection,
        _productImagesInColorSection;

    var buyJourney = {
        initObj: function() {
            _pageTemplate = $('.buy-journey');
            _selectModel = $('.select-model');
            _selectCarrier = $('.select-carrier');
            _selectColor = $('.select-color');
            _selectAddToCart = $('.add-to-cart');
            _breadcrumbModel = $('.breadcrumb-select-model');
            _breadcrumbCarrier = $('.breadcrumb-select-carrier');
            _breadcrumbColor = $('.breadcrumb-select-color');
            _hiddenModal = $('.hidden-seleted-modal');
            _hiddenCarrier = $('.hidden-seleted-carrier');
            _hiddenColor = $('.hidden-seleted-color');
            _productImagesInColorSection = $('.product-image-list img');
            _availableColorsInColorSection = $('.color-list .wrapper');
            _availableCarriersInCarrierSection = $('.select-carrier .carrier-list .in-htc-store');
        },
        init: function() {
            buyJourney.initObj();
        },
        scrollToTop: function(callback) {
            // console.log('scrollToTop 11');
            $('html, body').animate({ scrollTop: 0 }, 300).promise().done(function() {
                // console.log('scrollToTop 22');
                callback();
            });
        },
        hasCarrier: function() {
            if (_pageTemplate.hasClass('no-carrier')) {
                return false;
            } else {
                //EX: US site
                return true;
            }
        },
        resetBreadcrumbActive: function() {
            _breadcrumbModel.removeClass('active');
            _breadcrumbCarrier.removeClass('active');
            _breadcrumbColor.removeClass('active');
            _breadcrumbModel.removeClass('clickable');
            _breadcrumbCarrier.removeClass('clickable');
            _breadcrumbColor.removeClass('clickable');
        },
        setupBreadcrumbClick: function() {
            if (_breadcrumbModel.hasClass('clickable')) {
                _breadcrumbModel.unbind('click').bind('click', function(event) {
                    /* Act on the event */
                    event.preventDefault();
                    _hiddenModal.val('');
                    _hiddenCarrier.val('');
                    _hiddenColor.val('');
                    buyJourney.pushParams();
                });
            }
            if (_breadcrumbCarrier.hasClass('clickable')) {
                _breadcrumbCarrier.unbind('click').bind('click', function(event) {
                    /* Act on the event */
                    event.preventDefault();
                    _hiddenCarrier.val('');
                    _hiddenColor.val('');
                    buyJourney.pushParams();
                });
            }
            if (_breadcrumbColor.hasClass('clickable')) {
                _breadcrumbColor.unbind('click').bind('click', function(event) {
                    /* Act on the event */
                    event.preventDefault();
                    _hiddenColor.val('');
                    buyJourney.pushParams();
                });
            }
        },
        setupBreadcrumb: function(status) {
            buyJourney.resetBreadcrumbActive();
            switch (status) {
                case 'stay-in-modal':
                    _breadcrumbModel.addClass('active');
                    break;
                case 'stay-in-carrier':
                    console.log('stay-in-carrier');
                    _breadcrumbCarrier.addClass('active');
                    _breadcrumbModel.addClass('clickable');
                    break;
                case 'stay-in-color':
                    _breadcrumbColor.addClass('active');
                    _breadcrumbCarrier.addClass('clickable');
                    _breadcrumbModel.addClass('clickable');
                    break;
                case 'stay-in-add':
                    _breadcrumbColor.addClass('clickable');
                    _breadcrumbCarrier.addClass('clickable');
                    _breadcrumbModel.addClass('clickable');
                    break;
            }
            buyJourney.setupBreadcrumbClick();
        },
        pushParams: function() {
            var selectedModal = _hiddenModal.val(),
                selectedCarrier = _hiddenCarrier.val(),
                selectedColor = _hiddenColor.val(),
                urlPath = '';
            if (typeof selectedModal !== 'undefined' && selectedModal.length > 0) {
                urlPath += '&modal=' + selectedModal;
            }
            if (typeof selectedCarrier !== 'undefined' && selectedCarrier.length > 0) {
                urlPath += '&carrier=' + selectedCarrier;
            }
            if (typeof selectedColor !== 'undefined' && selectedColor.length > 0) {
                urlPath += '&color=' + selectedColor;
            }

            console.log('pushParams START');
            History.pushState({ modal: selectedModal, carrier: selectedCarrier, color: selectedColor }, '', '?' + urlPath);
            console.log('pushParams END');
            // console.log(History);
        },
        resetAllSectionsActive: function() {
            _selectModel.removeClass('active');
            _selectCarrier.removeClass('active');
            _selectColor.removeClass('active');
            _selectAddToCart.removeClass('active');
        },
        resetAllSectionsZeroHeight: function() {
            _selectModel.addClass('zero-height');
            _selectCarrier.addClass('zero-height');
            _selectColor.addClass('zero-height');
            _selectAddToCart.addClass('zero-height');
        },
        showModalSection: function() {
            
            buyJourney.scrollToTop(function() {
                buyJourney.resetAllSectionsActive();
                setTimeout(function() {
                    buyJourney.resetAllSectionsZeroHeight();
                    _selectModel.addClass('active');
                    _selectModel.removeClass('zero-height');
                    buyJourney.setupOrderNowClick();
                    buyJourney.setupBreadcrumb('stay-in-modal');
                }, 800);
            });
        },
        showCarrierSection: function() {
            buyJourney.scrollToTop(function() {
                buyJourney.resetAllSectionsActive();
                setTimeout(function() {
                    buyJourney.resetAllSectionsZeroHeight();
                    _selectCarrier.addClass('active');
                    _selectCarrier.removeClass('zero-height');
                    buyJourney.setupCarrierClick();
                    buyJourney.setupBreadcrumb('stay-in-carrier');
                }, 800);
            });
        },
        updateProductSpecInAddToCart: function(){
            var selectedCarrier = _hiddenCarrier.val(),
            carrierWording = _availableCarriersInCarrierSection.parent().find('div[data-carrier-id="' + selectedCarrier + '"]');
            if(typeof carrierWording !== 'undefined'){
                $('.add-to-cart .product-spec .product-desc').text(carrierWording.data('carrier-wording'));
            }
        },
        updateProductImageInAddToCart: function(){
            var selectedColor = _hiddenColor.val(),
            imgHtml = _productImagesInColorSection.parent().find('img[data-color="' + selectedColor + '"]');
            if(typeof imgHtml !== 'undefined'){
                $('.add-to-cart .product-image .main-image').html('').append(imgHtml.clone().addClass('active'));
            }
        },
        updateColorWordingInAddToCart: function(){
            var selectedColor = _hiddenColor.val(),
                selectedObject = _availableColorsInColorSection.parent().find('div[data-color="' + selectedColor + '"]');
            if(typeof selectedObject !== 'undefined'){
                $('.color-desc').text(selectedObject.data('color-wording'));
            }
        },
        updateProductImage: function(idx){
            _productImagesInColorSection.eq(idx).addClass('active');
        },
        resetProductImageActive: function(){
            _productImagesInColorSection.removeClass('active');
        },
        updateColorWording: function(wording){
            $('.color-desc').text(wording);
        },
        checkColorAvailable: function() {
            var hasActive = false;
            buyJourney.resetProductImageActive();
            $.each(_availableColorsInColorSection, function(key, value) {
                var colorWording =  $(this).data('color-wording'),
                color = $(this).data('color'),
                skuId = productIDs[_hiddenCarrier.val() + '.' + color];
                $(this).hide();
                $(this).removeClass('active');
                if (typeof skuId !== 'undefined') {
                    $(this).attr('data-sku', skuId).show();
                    $(this).unbind('click').bind('click', function() {
                        if (!$(this).hasClass('active')) {
                            _availableColorsInColorSection.removeClass('active');
                            buyJourney.resetProductImageActive();
                            $(this).addClass('active');
                            buyJourney.updateProductImage(key);
                            buyJourney.updateColorWording(colorWording);
                        }
                    });
                    if (!hasActive) {
                        $(this).addClass('active');
                        buyJourney.updateProductImage(key);
                        buyJourney.updateColorWording(colorWording);
                        hasActive = true;
                    }
                }
            });
        },
        showColorSection: function() {
            buyJourney.scrollToTop(function() {
                buyJourney.resetAllSectionsActive();
                setTimeout(function() {
                    buyJourney.resetAllSectionsZeroHeight();
                    _selectColor.addClass('active');
                    _selectColor.removeClass('zero-height');
                    buyJourney.checkColorAvailable();
                    buyJourney.setupColorNextClick();
                    buyJourney.setupBreadcrumb('stay-in-color');
                }, 800);
            });
        },
        showAddToCartSection: function() {
            buyJourney.scrollToTop(function() {
                buyJourney.resetAllSectionsActive();
                buyJourney.resetAllSectionsZeroHeight();
                setTimeout(function() {
                    _selectAddToCart.addClass('active');
                    _selectAddToCart.removeClass('zero-height');
                    buyJourney.setupBreadcrumb('stay-in-add');
                    buyJourney.updateProductImageInAddToCart();
                    buyJourney.updateColorWordingInAddToCart();
                    buyJourney.updateProductSpecInAddToCart();
                }, 800);
            });
        },
        setupOrderNowClick: function() {
            var orderNowButton = _selectModel.find('.order-now');
            orderNowButton.unbind('click').bind('click', function(event) {
                event.preventDefault();
                _hiddenModal.val(_pageTemplate.data('product-id'));
                buyJourney.pushParams();
            });
        },
        setupCarrierClick: function() {
            var carrierButton = _selectCarrier.find('.in-htc-store');
            carrierButton.off('click').on('click', function(event) {
                event.preventDefault();
                _hiddenCarrier.val($(this).data('carrier-id'));
                buyJourney.pushParams();
            });
        },
        setupColorNextClick: function() {
            var nextButton = _selectColor.find('.call-to-action-button');
            nextButton.off('click').on('click', function(event) {
                event.preventDefault();

                _hiddenColor.val($('.color-list div.active').data('color'));
                buyJourney.pushParams();
            });
        },
        updateHiddenInput: function() {
            var url = $.url(),
                selectedColor,
                paramModal = url.param('modal'),
                paramCarrier = url.param('carrier'),
                paramColor = url.param('color');

            buyJourney.initObj();

            console.log('updateHiddenInput');
            // console.log('paramModal=' + paramModal + '|paramCarrier=' + paramCarrier + '|paramColor=' + paramColor);

            _hiddenModal.val('');
            _hiddenCarrier.val('');
            _hiddenColor.val('');
            if (typeof paramModal !== 'undefined') {
                if (_pageTemplate.hasClass(paramModal)) {
                    _hiddenModal.val(paramModal);

                    if (_pageTemplate.hasClass('has-carrier')) {
                        //check carrier
                        if (typeof paramCarrier !== 'undefined') {
                            if ($('.in-htc-store').hasClass(paramCarrier)) {
                                _hiddenCarrier.val(paramCarrier);

                                if (typeof paramColor !== 'undefined') {
                                    selectedColor = productIDs[paramCarrier + '.' + paramColor];
                                    if (typeof selectedColor !== 'undefined') {
                                        _hiddenColor.val(paramColor);
                                    }
                                }
                            }
                        }
                    } else {
                        //skip to color selection
                        _hiddenCarrier.val('htc');
                        if (typeof paramColor !== 'undefined') {
                            selectedColor = productIDs[paramCarrier + '.' + paramColor];
                            if (typeof selectedColor !== 'undefined') {
                                _hiddenColor.val(paramColor);
                            }
                        }
                    }
                }
            }
            buyJourney.restorePageStatus();
        },
        restorePageStatus: function() {
            if (_hiddenModal.val() === '') {
                // console.log('_hiddenModal === empty');
                buyJourney.showModalSection();

            } else {
                console.log('_hiddenModal === empty');
                if (_pageTemplate.hasClass('has-carrier')) {


                    if (_hiddenCarrier.val() === '') {
                        buyJourney.showCarrierSection();
                    } else {
                        if (_hiddenColor.val() === '') {
                            console.log('showColorSection');
                            buyJourney.showColorSection();
                        } else {
                            console.log('showAddToCartSection');
                            buyJourney.showAddToCartSection();
                        }
                    }
                } else {
                    console.log('no-carrier');
                    if (_hiddenColor.val() === '') {
                        buyJourney.showColorSection();
                    } else {
                        buyJourney.showAddToCartSection();
                    }

                }
            }
        }
    };

    return buyJourney;
}());

$(document).ready(function() {
    'use strict';

    // var url = $.url(true);


    var pageTemplate = $('.buy-journey');
    if (pageTemplate.length > 0) {
        buyJourney.init();
    }
    // var url = $.url(true);
    // console.log(url.fparam('carrier'));

    var featureSpecAccessorySection = $('.feature-spec-accessory-more');
    if (featureSpecAccessorySection.length > 0) {
        featureSpecAccessorySection.off('click').on('click', '.expand-collapse-btn', function() {
            var flexItem = $(this).parents('.flex-item');
            // console.log(flexItem);
            //if(!flexItem.hasClass('active')){
            //remove active class
            //featureSpecAccessorySection.find('.flex-item').removeClass('active');
            flexItem.toggleClass('active');
            flexItem.find('.content-block').slideToggle(500);
            //}
        });
    }
});

(function(window, undefined) {
    'use strict';
    // Check Location
    if (document.location.protocol === 'file:') {
        alert('The HTML5 History API (and thus History.js) do not work on files, please upload it to a server.');
    }

    // console.log('test');
    buyJourney.updateHiddenInput();

    History.Adapter.bind(window, 'statechange', function() { // Note: We are using statechange instead of popstate
        console.log('statechange');
        //buyJourney.updateHiddenInput();
        var State = History.getState();
        // console.log(State);
        buyJourney.updateHiddenInput();
    });

})(window);