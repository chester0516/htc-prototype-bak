/*global tmpl, commonSetting, History, Clipboard, TimelineLite, TweenLite*/
var _hiddenFamily,
    _hiddenIndex,
    _hiddenProduct,
    _hiddenCategory,
    _hiddenContent,
    _hiddenPopup,
    _productListFirstMainContainer,
    _productListFirstLevelItems,
    _problemListTitleContainer,
    _problemListFirstMainContainer,
    _carrierListContainer,
    _productListDetailItemHeight = 0,
    _selectedProductName = '',
    _selectedCategoryName = '',
    _selectedContentTitle,
    _carrierExisted,
    _jumpToLastSection;
var productSection = (function() {
    'use strict';
    var productSection = {
        activeDetailItem: function() {
            _productListFirstMainContainer.find('.detail-item').addClass('active');
        },
        removeFamilyIconHighline: function() {
            _productListFirstMainContainer.find('.product-item').removeClass('selected');
        },
        highlineFamilyIconSelected: function() {
            productSection.removeFamilyIconHighline();
            _productListFirstMainContainer.find('.product-item[data-family="' + _hiddenFamily.val() + '"]').addClass('selected');
        },
        removeProductIconHighline: function() {
            var productItemsInDetail = _productListFirstMainContainer.find('.detail-item .related-product-item');
            //remove selected class for all product list
            productItemsInDetail.removeClass('selected');
        },
        highlineProductIconSelected: function() {
            var productItemsInDetail = _productListFirstMainContainer.find('.detail-item .related-product-item'),
                selectedProductGroup;
            //remove selected class for all product list
            productSection.removeProductIconHighline();
            selectedProductGroup = productItemsInDetail.filter('[data-pname="' + _hiddenIndex.val() + '"]');
            if (selectedProductGroup.length > 0) {
                //add seelcted class to a specific product
                selectedProductGroup.addClass('selected');
                //remove selected class for all carrier list
                //selectedProductGroup.find('.hidden-carrier-block li').removeClass('selected');
                //get product name
                _selectedProductName = selectedProductGroup.find('.product-name').text();
            }
        },
        addProductListPadding: function() {
            _productListFirstMainContainer.addClass('add-padding');
        },
        revmoveProductListPadding: function() {
            if (!commonSetting.isMobile()) {
                _productListFirstMainContainer.removeClass('add-padding');
            }
        },
        /*---------------------------Family---------------------------*/
        familyIconClick: function(parentElement) {
            parentElement.find('div.product-item').off('click').on('click', function(event) {
                /* Act on the event */
                var canClick = false;
                if (commonSetting.isMobile()) {
                    canClick = true;
                } else {
                    if (!$(this).hasClass('selected')) {
                        canClick = true;
                    }
                }
                if (canClick) {
                    //reset hidden input
                    _hiddenPopup.val('');
                    _hiddenContent.val('');
                    _hiddenCategory.val('');
                    _hiddenProduct.val('');
                    _hiddenIndex.val('');
                    _hiddenFamily.val($(this).data('family'));
                    contactSupport.pushParams();
                }
            });
        },
        expandProductList: function(parentElement, familyValue, callback) {
            contactSupport.expandSecondLevelList(true, parentElement, familyValue, function(currentItem) {
                callback(currentItem);
            });
        },
        setupCloseProductListForMobile: function(parentElement) {
            var closeBtn = parentElement.find('.detail-item .btn-close');
            closeBtn.off('click').on('click', function() {
                _hiddenPopup.val('');
                _hiddenContent.val('');
                _hiddenCategory.val('');
                _hiddenProduct.val('');
                _hiddenFamily.val('');
                contactSupport.pushParams();
            });
        },
        /*---------------------------Product---------------------------*/
        showProductListSection: function() {
            //no css style, only for scroll to this section
            $('.product-listing').addClass('showed');
        },
        productIconClick: function(parentElement) {
            var productItems = parentElement.find('.related-product-item'),
                detailItem = parentElement.find('.detail-item');
            if (productItems.length) {
                productItems.off('click').on('click', function() {
                    var pnameId = $(this).data('pname-id');
                    if (typeof pnameId !== 'undefined') {
                        /**
                         *
                         * No carrier section
                         *
                         */
                        /***For accessory**/
                        productItems.removeClass('selected');
                        $(this).addClass('selected');
                        _selectedProductName = $(this).find('.product-name').text();
                        _selectedCategoryName = '';
                        /*****/
                        carrierSection.hideCarrierSection();
                        _hiddenPopup.val('');
                        _hiddenContent.val('');
                        _hiddenCategory.val('');
                        _hiddenIndex.val($(this).data('pname'));
                        _hiddenProduct.val(pnameId);
                        contactSupport.pushParams();
                    } else {
                        /**
                         *
                         * Has carrier section
                         *
                         */
                        _hiddenPopup.val('');
                        _hiddenContent.val('');
                        _hiddenCategory.val('');
                        _hiddenProduct.val('');
                        _hiddenIndex.val($(this).data('pname'));
                        contactSupport.pushParams();
                    }
                });
            }
        }
    };
    return productSection;
}());
var carrierSection = (function() {
    'use strict';
    var carrierSection = {
        highlineCarrierNameSelected: function() {
            if (_carrierListContainer.find('li').length > 0) {
                var selectedCarrierLiItem = _carrierListContainer.find('li').filter('[data-pname-id="' + _hiddenProduct.val() + '"]');
                if (selectedCarrierLiItem.length > 0) {
                    selectedCarrierLiItem.addClass('selected');
                    _selectedProductName = selectedCarrierLiItem.data('pname');
                }
            }
        },
        showCarrierSection: function() {
            $('.carrier-listing').addClass('showed');
        },
        hideCarrierSection: function() {
            $('.carrier-listing').removeClass('showed');
        },
        expandCarrierlist: function() {
            //Show carrier
            _carrierExisted = false;
            var productItems = _productListFirstMainContainer.find('.product-item.selected .related-product-item'),
                selectedProductGroup = productItems.filter('[data-pname="' + _hiddenIndex.val() + '"]'),
                selectedCarrierList = selectedProductGroup.find('.hidden-carrier-block');
            if (selectedCarrierList.length > 0) {
                carrierSection.updateCarrierContainer(selectedCarrierList.clone());
                _carrierExisted = true;
            }
        },
        carrierNameClick: function() {
            _carrierListContainer.find('li').off('click').on('click', function() {
                var pnameId = $(this).data('pname-id');
                _carrierListContainer.find('li').removeClass('selected');
                $(this).addClass('selected');
                _hiddenContent.val('');
                _hiddenCategory.val('');
                _hiddenProduct.val(pnameId);
                contactSupport.pushParams();
            });
        },
        updateCarrierContainer: function(inputList) {
            var styleLessThan3Items = '';
            if (inputList.find('li').length < 4) {
                styleLessThan3Items = 'less-than-3-items';
            }
            inputList.find('li').removeClass('selected');
            inputList.find('ul').addClass(styleLessThan3Items);
            _carrierListContainer.html(inputList.html());
        }
    };
    return carrierSection;
}());
var problemSection = (function() {
    'use strict';
    var problemSection = {
        activeDetailItem: function() {
            _problemListFirstMainContainer.find('.detail-item').addClass('active');
        },
        highlineCategoryIconSelected: function() {
            _problemListFirstMainContainer.find('.product-item').removeClass('selected');
            var categoryItem = _problemListFirstMainContainer.find('.product-item[data-category="' + _hiddenCategory.val() + '"]');
            if (typeof categoryItem !== 'undefined') {
                categoryItem.addClass('selected');
                _selectedCategoryName = categoryItem.find('.product-name').text();
            }
        },
        showProblemListSection: function() {
            $('.problem-listing').addClass('showed');
        },
        hideProblemListSection: function() {
            $('.problem-listing').removeClass('showed');
        },
        callProblemList: function(productNameId, callback) {
            var resultContainer = _problemListFirstMainContainer,
                calllUrl = '',
                request;
            if (commonSetting.isPrototypeHost()) {
                calllUrl = 'ek-assets/digital-first/json/list.json';
            } else {
                calllUrl = '/' + $('body').data('site') + '/support/troubleshootingjson.aspx?p_name=' + encodeURIComponent(productNameId);
            }
            request = $.ajax({
                url: calllUrl,
                method: 'GET',
                dataType: 'json',
                beforeSend: function(xhr) {
                    _jumpToLastSection = false;
                }
            });
            request.done(function(data) {
                if (typeof data.lineItem !== 'undefined' && data.lineItem.length > 0) {
                    var problemArray = data.lineItem;
                    var resultData = {
                        'problemArray': problemArray
                    };
                    resultContainer.html('');
                    resultContainer.append(tmpl('problem-type-list', resultData));
                    callback();
                } else {
                    _jumpToLastSection = true;
                    _selectedCategoryName = '';
                    //accessory link to need help section
                    resultContainer.html('');
                    _hiddenPopup.val('');
                    _hiddenContent.val('0');
                    _hiddenCategory.val('0');
                    contactSupport.pushParams(false);
                }
            });
            request.fail(function(jqXHR, textStatus) {});
        },
        /*---------------------------Category---------------------------*/
        categoryIconClick: function(parentElement) {
            parentElement.find('div.product-item').off('click').on('click', function(event) {
                /* Act on the event */
                var canClick = false;
                if (commonSetting.isMobile()) {
                    canClick = true;
                } else {
                    if (!$(this).hasClass('selected')) {
                        canClick = true;
                    }
                }
                if (canClick) {
                    var categoryValue = $(this).data('category');
                    //reset hidden input
                    _hiddenPopup.val('');
                    _hiddenContent.val('');
                    _hiddenCategory.val(categoryValue);
                    if (event.originalEvent === undefined) {
                        //by trigger
                        contactSupport.pushParams(false);
                    } else {
                        //by click
                        contactSupport.pushParams();
                    }
                }
            });
        },
        unselectSingleContent: function() {
            _problemListFirstMainContainer.find('.single-content').removeClass('selected');
            _problemListFirstMainContainer.find('.related-help-content-item.btn-need-more-help').removeClass('selected');
        },
        setupCloseContentListForMobile: function(parentElement) {
            var closeBtn = parentElement.find('.detail-item .btn-close');
            closeBtn.off('click').on('click', function() {
                _hiddenPopup.val('');
                _hiddenContent.val('');
                _hiddenCategory.val('');
                contactSupport.pushParams();
            });
        },
        expandContentList: function(parentElement, categoryValue, callback) {
            contactSupport.expandSecondLevelList(true, parentElement, categoryValue, function(currentItem) {
                callback(currentItem);
            });
        },
        singleContentClick: function(parentElement) {
            var contentItems = parentElement.find('.related-help-content-item.single-content');
            problemSection.unselectSingleContent();
            contentItems.off('click').on('click', function() {
                var contentId = $(this).data('content-id');
                _hiddenPopup.val('');
                _hiddenContent.val(contentId);
                contactSupport.pushParams();
            });
        },
        triggerFirstCategoryClick: function() {
            //trigger fisrt item
            if (!commonSetting.isMobile()) {
                _problemListFirstMainContainer.find('.product-item').eq(0).trigger('click');
            }
        },
        setupNeedMoreHelpClick: function() {
            problemSection.unselectSingleContent();
            $('.btn-need-more-help').off('click').on('click', function() {
                _hiddenPopup.val('');
                if ($(this).hasClass('related-help-content-item')) {
                    _hiddenContent.val(0);
                } else {
                    _hiddenContent.val(-1);
                    if (commonSetting.isMobile()) {
                        //mobile not trigger first category click
                        _hiddenCategory.val(0);
                        _selectedCategoryName = '';
                    }
                }
                contactSupport.pushParams();
            });
        },
        updateProductName: function(productName) {
            var titleDiv = _problemListTitleContainer.find('h4');
            titleDiv.find('span').text(productName);
        },
        updateMobileTitleProductName: function(productName) {
            var titleDiv = _problemListTitleContainer.find('h4');
            titleDiv.find('span').text(productName);
            _problemListFirstMainContainer.find('.m-popup-title').text(titleDiv.text());
        }
    };
    return problemSection;
}());
var contentSection = (function() {
    'use strict';
    var contentSection = {
        resetEmailIconClick: function(productName, categoryName) {
            $('.help-contact-list .email > a').off('click').on('click', function(event) {
                event.preventDefault();
                var newLink;
                if (categoryName !== '') {
                    newLink = $(this).attr('href') + '?pname=' + encodeURIComponent(productName) + '&pname_id=' + encodeURIComponent(_hiddenProduct.val()) + '&category_name=' + encodeURIComponent(categoryName) + '&category_id=' + encodeURIComponent(_hiddenCategory.val());
                } else {
                    newLink = $(this).attr('href') + '?pname=' + encodeURIComponent(productName) + '&pname_id=' + encodeURIComponent(_hiddenProduct.val());
                }
                location.href = newLink;
            });
        },
        highlineContentBlockSelected: function() {
            var selectedContent = _problemListFirstMainContainer.find('.single-content[data-content-id="' + _hiddenContent.val() + '"]');
            problemSection.unselectSingleContent();
            if (selectedContent.length > 0) {
                selectedContent.addClass('selected');
                _selectedContentTitle = selectedContent.find('.product-help-info').eq(0).text();
            } else {
                //seelct "not list" content
                if (_hiddenContent.val() === '0') {
                    _problemListFirstMainContainer.find('.related-help-content-item.btn-need-more-help').addClass('selected');
                }
            }
        },
        /*---------------------------Content---------------------------*/
        showMoreHelpSection: function() {
            $('.more-help-result').addClass('showed');
        },
        hideMoreHelpSection: function() {
            $('.more-help-result').removeClass('showed');
        },
        showContentAbstractSection: function() {
            $('.abstract-content').addClass('showed');
        },
        hideContentAbstractSection: function() {
            $('.abstract-content').removeClass('showed');
        },
        showPopup: function() {
            $('.popup-area').addClass('showed');
            $('body').addClass('support-popup-fixed');
            $('.popup-window').scrollTop(0);
        },
        hidePopup: function() {
            $('.popup-area').removeClass('showed');
            $('body').removeClass('support-popup-fixed');
        },
        abstractContentClick: function() {
            $('.abstract-single-content-block').off('click').on('click', function() {
                _hiddenPopup.val('1');
                contactSupport.pushParams();
            });
        },
        updateAbstractContent: function(contentId, callback) {
            contentSection.callSingleContent(_hiddenProduct.val(), contentId, function() {
                callback();
            });
        },
        popupSingleContent: function() {
            //setup close popup button click
            contentSection.setupClosePopupBtn();
            contentSection.showPopup();
        },
        callSingleContent: function(productNameId, contentId, callback) {
            var calllUrl = '',
                request;
            if (commonSetting.isPrototypeHost()) {
                calllUrl = 'ek-assets/digital-first/json/content.json';
            } else {
                calllUrl = '/' + $('body').data('site') + '/support/troubleshootingjson.aspx?p_name=' + productNameId + '&id=' + contentId;
            }
            request = $.ajax({
                url: calllUrl,
                method: 'GET',
                dataType: 'json'
            });
            request.done(function(data) {
                if (typeof data.content !== 'undefined') {
                    $('.single-article').html(data.content);
                    contentSection.buildAbstractContent(data.content);
                    callback();
                }
            });
            request.fail(function(jqXHR, textStatus) {});
        },
        buildAbstractContent: function(fullContent) {
            var tempDiv = $('<div class="temp-content-block"></div>');
            tempDiv.html(fullContent);
            var abstractContent = tempDiv.text().substring(0, 300);
            $('.abstract-content-block').text(abstractContent + '...');
        },
        buildSingleContentTitle: function(title) {
            $('.abstract-single-content-block .title-block').text(title);
            $('.popup-article .popup-title').text(title);
        },
        buildSingleContentShortLink: function() {
            var newLink = '#prototype';
            if (!commonSetting.isPrototypeHost()) {
                newLink = location.protocol + '//' + location.host + '/' + $('body').data('site') + '/contact/productissue/' + _hiddenProduct.val() + '/' + _hiddenContent.val() + '/';
            }
            $('.go-to-page').attr('data-clipboard-text', newLink);
            var clipboard = new Clipboard('.go-to-page');
            clipboard.on('success', function(e) {
                $('.copy-msg').addClass('show');
                //auto hide msg after
                // setTimeout(function() {
                //     $('.copy-msg').removeClass('show');
                // }, 1000);
                e.clearSelection();
            });
        },
        hideCopiedMsgText: function() {
            $('.copy-msg').removeClass('show');
        },
        setupClosePopupBtn: function() {
            var closeBtn = $('.popup-area .btn-close');
            if (closeBtn.length > 0) {
                closeBtn.off('click').on('click', function() {
                    contentSection.hidePopup();
                    _hiddenPopup.val('');
                    contactSupport.pushParams();
                });
            }
        },
    };
    return contentSection;
}());
var contactSupport = (function() {
    'use strict';
    var contactSupport = {
        //Page initial
        restorePageStatus: function(callFromNavigation) {
            var deferred = $.Deferred();
            productSection.addProductListPadding();
            productSection.familyIconClick(_productListFirstMainContainer);
            if (callFromNavigation) {
                _productListFirstMainContainer.find('.detail-item').remove();
                carrierSection.hideCarrierSection();
                problemSection.hideProblemListSection();
                contentSection.hideContentAbstractSection();
                contentSection.hideMoreHelpSection();
                contentSection.hidePopup();
            }
            if (_hiddenFamily.val() !== '') {
                productSection.revmoveProductListPadding();
                productSection.highlineFamilyIconSelected();
                productSection.showProductListSection();
                productSection.expandProductList(_productListFirstMainContainer, _hiddenFamily.val(), function(currentItem) {
                    productSection.productIconClick(_productListFirstMainContainer);
                    productSection.setupCloseProductListForMobile(_productListFirstMainContainer);
                    if (_hiddenIndex.val() !== '') {
                        productSection.activeDetailItem();
                        contentSection.hideMoreHelpSection();
                        contentSection.hideContentAbstractSection();
                        problemSection.hideProblemListSection();
                        productSection.highlineProductIconSelected();
                        carrierSection.expandCarrierlist();
                        if (_carrierExisted) {
                            carrierSection.carrierNameClick();
                            carrierSection.showCarrierSection();
                        }
                        if (_hiddenProduct.val() !== '') {
                            carrierSection.highlineCarrierNameSelected();
                            problemSection.callProblemList(_hiddenProduct.val(), function() {
                                problemSection.updateProductName(_selectedProductName);
                                problemSection.categoryIconClick(_problemListFirstMainContainer);
                                problemSection.showProblemListSection();
                                if (_hiddenCategory.val() !== '') {
                                    if (_hiddenCategory.val() === '0') {
                                        if (commonSetting.isMobile()) {
                                            commonSetting.removeMobilePopupFix();
                                            contactSupport.removeDetailItemForMobile();
                                            contentSection.resetEmailIconClick(_selectedProductName, _selectedCategoryName);
                                        }
                                        contentSection.highlineContentBlockSelected();
                                        contentSection.showMoreHelpSection();
                                        deferred.resolve();
                                    } else {
                                        problemSection.expandContentList(_problemListFirstMainContainer, _hiddenCategory.val(), function(currentItem) {
                                            problemSection.highlineCategoryIconSelected();
                                            problemSection.singleContentClick(_problemListFirstMainContainer);
                                            problemSection.setupCloseContentListForMobile(_problemListFirstMainContainer);
                                            problemSection.updateMobileTitleProductName(_selectedProductName);
                                            contentSection.resetEmailIconClick(_selectedProductName, _selectedCategoryName);
                                            problemSection.setupNeedMoreHelpClick();
                                            if (_hiddenContent.val() !== '') {
                                                problemSection.activeDetailItem();
                                                contentSection.hideContentAbstractSection();
                                                contentSection.hideMoreHelpSection();
                                                if (commonSetting.isMobile()) {
                                                    commonSetting.removeMobilePopupFix();
                                                    contactSupport.removeDetailItemForMobile();
                                                }
                                                if (_hiddenContent.val() === '0' || _hiddenContent.val() === '-1') {
                                                    contentSection.highlineContentBlockSelected();
                                                    contentSection.showMoreHelpSection();
                                                    deferred.resolve();
                                                } else {
                                                    contentSection.updateAbstractContent(_hiddenContent.val(), function() {
                                                        contentSection.highlineContentBlockSelected();
                                                        contentSection.buildSingleContentTitle(_selectedContentTitle);
                                                        contentSection.hideCopiedMsgText();
                                                        contentSection.buildSingleContentShortLink();
                                                        contentSection.abstractContentClick();
                                                        contentSection.showContentAbstractSection();
                                                        if (_hiddenPopup.val() !== '') {
                                                            contentSection.popupSingleContent();
                                                        } else {
                                                            deferred.resolve();
                                                        }
                                                    });
                                                }
                                            } else {
                                                deferred.resolve();
                                            }
                                        });
                                    }
                                } else {
                                    if (commonSetting.isMobile()) {
                                        commonSetting.removeMobilePopupFix();
                                        contactSupport.removeDetailItemForMobile();
                                        problemSection.setupNeedMoreHelpClick();
                                        deferred.resolve();
                                    } else {
                                        //trigger fisrt item, only in desktop
                                        problemSection.triggerFirstCategoryClick();
                                    }
                                }
                            });
                        } else {
                            if (commonSetting.isMobile()) {
                                commonSetting.removeMobilePopupFix();
                                contactSupport.removeDetailItemForMobile();
                            }
                            deferred.resolve();
                        }
                    } else {
                        deferred.resolve();
                    }
                });
            } else {
                if (callFromNavigation) {
                    productSection.removeFamilyIconHighline();
                }
                deferred.resolve();
            }
            return deferred.promise();
        },
        //Any history add
        setupClickStatus: function() {
            var deferred = $.Deferred();
            if (_hiddenPopup.val() !== '') {
                contentSection.popupSingleContent();
                deferred.resolve();
            } else {
                if (_hiddenContent.val() !== '') {
                    contentSection.hideContentAbstractSection();
                    contentSection.hideMoreHelpSection();
                    if (commonSetting.isMobile()) {
                        commonSetting.removeMobilePopupFix();
                        contactSupport.removeDetailItemForMobile();
                    }
                    if (_hiddenContent.val() === '0' || _hiddenContent.val() === '-1') {
                        if (commonSetting.isMobile()) {
                            commonSetting.removeMobilePopupFix();
                            contactSupport.removeDetailItemForMobile();
                        }
                        if (!_jumpToLastSection) {
                            contentSection.highlineContentBlockSelected();
                        }
                        contentSection.resetEmailIconClick(_selectedProductName, _selectedCategoryName);
                        contentSection.showMoreHelpSection();
                        deferred.resolve();
                    } else {
                        contentSection.updateAbstractContent(_hiddenContent.val(), function() {
                            contentSection.highlineContentBlockSelected();
                            contentSection.buildSingleContentTitle(_selectedContentTitle);
                            contentSection.hideCopiedMsgText();
                            contentSection.buildSingleContentShortLink();
                            contentSection.abstractContentClick();
                            contentSection.showContentAbstractSection();
                            deferred.resolve();
                        });
                    }
                } else {
                    if (_hiddenCategory.val() !== '') {
                        problemSection.expandContentList(_problemListFirstMainContainer, _hiddenCategory.val(), function(currentItem) {
                            contentSection.hideContentAbstractSection();
                            contentSection.hideMoreHelpSection();
                            problemSection.highlineCategoryIconSelected();
                            problemSection.unselectSingleContent();
                            /*****For no carrier product, eg: htc-bolt****/
                            productSection.highlineProductIconSelected();
                            carrierSection.highlineCarrierNameSelected();
                            problemSection.updateProductName(_selectedProductName);
                            /**********************/
                            problemSection.singleContentClick(_problemListFirstMainContainer);
                            problemSection.setupCloseContentListForMobile(_problemListFirstMainContainer);
                            problemSection.updateMobileTitleProductName(_selectedProductName);
                            contentSection.resetEmailIconClick(_selectedProductName, _selectedCategoryName);
                            problemSection.setupNeedMoreHelpClick();
                            deferred.resolve();
                        });
                    } else {
                        if (_hiddenProduct.val() !== '') {
                            contentSection.hideContentAbstractSection();
                            contentSection.hideMoreHelpSection();
                            carrierSection.highlineCarrierNameSelected();
                            problemSection.callProblemList(_hiddenProduct.val(), function() {
                                problemSection.updateProductName(_selectedProductName);
                                problemSection.categoryIconClick(_problemListFirstMainContainer);
                                problemSection.showProblemListSection();
                                if (commonSetting.isMobile()) {
                                    commonSetting.removeMobilePopupFix();
                                    contactSupport.removeDetailItemForMobile();
                                    problemSection.setupNeedMoreHelpClick();
                                    deferred.resolve();
                                } else {
                                    problemSection.triggerFirstCategoryClick();
                                }
                            });
                        } else {
                            if (_hiddenIndex.val() !== '') {
                                contentSection.hideMoreHelpSection();
                                contentSection.hideContentAbstractSection();
                                problemSection.hideProblemListSection();
                                productSection.highlineProductIconSelected();
                                carrierSection.expandCarrierlist();
                                carrierSection.carrierNameClick();
                                if (commonSetting.isMobile()) {
                                    commonSetting.removeMobilePopupFix();
                                    contactSupport.removeDetailItemForMobile();
                                }
                                if (_carrierExisted) {
                                    carrierSection.carrierNameClick();
                                    carrierSection.showCarrierSection();
                                }
                                deferred.resolve();
                            } else {
                                if (_hiddenFamily.val() !== '') {
                                    carrierSection.hideCarrierSection();
                                    problemSection.hideProblemListSection();
                                    contentSection.hideContentAbstractSection();
                                    contentSection.hideMoreHelpSection();
                                    productSection.revmoveProductListPadding();
                                    productSection.highlineFamilyIconSelected();
                                    productSection.showProductListSection();
                                    productSection.expandProductList(_productListFirstMainContainer, _hiddenFamily.val(), function(currentItem) {
                                        productSection.productIconClick(_productListFirstMainContainer);
                                        productSection.setupCloseProductListForMobile(_productListFirstMainContainer);
                                        deferred.resolve();
                                    });
                                } else {
                                    if (commonSetting.isMobile()) {
                                        productSection.removeFamilyIconHighline();
                                        commonSetting.removeMobilePopupFix();
                                        contactSupport.removeDetailItemForMobile();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return deferred.promise();
        },
        /*---------------------------Common setting---------------------------*/
        expandSecondLevelList: function(slideAnimation, parentElement, filterValue, callback) {
            var detailItemsContainer = parentElement.find('.detail-item');
            //reset _productListDetailItemHeight
            _productListDetailItemHeight = 0;
            if (commonSetting.isMobile()) {
                commonSetting.removeMobilePopupFix();
                contactSupport.removeDetailItemForMobile();
            }
            if (detailItemsContainer.length > 0) {
                _productListDetailItemHeight = detailItemsContainer.height();
                detailItemsContainer.css('height', _productListDetailItemHeight).removeClass('active').html('');
            } else {
                detailItemsContainer = $('<div class="detail-item"></div>');
            }
            parentElement.find('.product-item').each(function(index, el) {
                var filterClass = 'family';
                if (parentElement.parents('section').hasClass('problem-listing')) {
                    filterClass = 'category';
                }
                /* iterate through array or object */
                if ($(this).data(filterClass) === filterValue) {
                    var currentItem = $(this),
                        currentIndex = index,
                        appendItemIndex = contactSupport.appendAfterItem(currentIndex, parentElement),
                        appendHtml = '<div class="related-product-group"><div class="btn-close"></div><div class="popup-title m-popup-title">' + $('.hidden-select-product-model').val() + '</div>' + $(this).find('.related-products').html() + '</div>';
                    if (parentElement.parents('section').hasClass('problem-listing')) {
                        appendHtml = '<div class="related-product-group related-problem-group"><div class="btn-close"></div><div class="popup-title m-popup-title">' + $('.hidden-select-your-issue').val() + '</div>' + $(this).find('.related-products').html() + '</div>';
                    }
                    if (typeof appendItemIndex === 'undefined') {
                        detailItemsContainer.append(appendHtml).insertAfter(parentElement.find('.product-item').last());
                    } else {
                        detailItemsContainer.append(appendHtml).insertAfter(parentElement.find('.product-item').eq(appendItemIndex));
                    }
                    if (commonSetting.isMobile()) {
                        if ((parentElement.parents('section').hasClass('product-listing') && _hiddenProduct.val() === '') || (parentElement.parents('section').hasClass('problem-listing') && _hiddenContent.val() === '')) {
                            // detailItemsContainer.addClass('active');
                            commonSetting.addMobilePopupFix();
                            // detailItemsContainer.css('min-height', 'inherit');
                        }
                        callback(currentItem);
                    } else {
                        setTimeout(function() {
                            // detailItemsContainer.addClass('active');
                            commonSetting.addMobilePopupFix();
                            //detailItemsContainer.css('min-height', 'inherit');
                        }, 0);
                        callback(currentItem);
                    }
                }
            });
        },
        scrollToLastSection: function(waitUntilLoad) {
            if ($('section.showed').length > 0) {
                var sectionItem = $('section.showed').last(),
                    scrollItem;
                if (sectionItem.hasClass('product-listing')) {
                    scrollItem = sectionItem.find('.title h4');
                } else {
                    scrollItem = sectionItem;
                }
                contactSupport.screenScroll(sectionItem, scrollItem);
            }
        },
        screenScroll: function(sectionItem, scrollItem, callback) {
            var headerHeight = 70,
                $detailItem = null,
                scrollHeightPosition = $(scrollItem).offset().top - headerHeight,
                timeLineObj;
            timeLineObj = new TimelineLite();
            if (sectionItem.hasClass('product-listing') || sectionItem.hasClass('problem-listing')) {
                $detailItem = sectionItem.find('.detail-item');
                //expand 
                if (!commonSetting.isMobile()) {
                    timeLineObj.add(TweenLite.set($detailItem, {
                        height: 'auto'
                    }));
                    timeLineObj.add(TweenLite.from($detailItem, 0.5, {
                        height: _productListDetailItemHeight
                    }));
                }
                //scroll to section
                timeLineObj.to(window, 0.5, {
                    scrollTo: {
                        y: scrollHeightPosition
                    }
                }, '-=0.45');
                timeLineObj.call(function() {
                    $detailItem.addClass('active');
                }, [], this, '-=0.40');
                //play
                setTimeout(function() {
                    timeLineObj.play();
                }, 100);
            } else {
                //scroll to section
                // timeLineObj.to(window, 0.5, {
                //     scrollTo: {
                //         y: scrollHeightPosition
                //     }
                // });
                setTimeout(function() {
                    $('html, body').animate({
                        scrollTop: scrollHeightPosition
                    }, 500);
                }, 250);
            }
        },
        itemsInRow: function(parentElement) {
            var lisInRow = 0;
            parentElement.find('.product-item').each(function() {
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
        detectAlignStart: function(parentElement) {
            var itemsEveryRow = contactSupport.itemsInRow(parentElement),
                totalProducts = parentElement.find('.product-item').length;
            parentElement.removeClass('align-start');
        },
        appendAfterItem: function(idx, parentElement) {
            var itemsEveryRow = contactSupport.itemsInRow(parentElement),
                resultRow = 1;
            for (var i = itemsEveryRow; i < parentElement.find('.product-item').length; i += itemsEveryRow) {
                if (idx < i) {
                    return i - 1;
                } else {
                    resultRow += 1;
                }
            }
        },
        initObj: function() {
            _hiddenFamily = $('.hidden-seleted-family');
            _hiddenIndex = $('.hidden-seleted-index');
            _hiddenProduct = $('.hidden-seleted-product');
            _hiddenCategory = $('.hidden-seleted-category');
            _hiddenContent = $('.hidden-seleted-content');
            _hiddenPopup = $('.hidden-seleted-popup');
            _productListFirstMainContainer = $('.product-listing .flex-box-area');
            _productListFirstLevelItems = _productListFirstMainContainer.find('div.product-item');
            _problemListTitleContainer = $('.problem-listing .title');
            _problemListFirstMainContainer = $('.problem-listing .flex-box-area');
            _carrierListContainer = $('.carrier-listing .carrier-list-container');
        },
        updateHiddenInput: function(callback) {
            var url = $.url(),
                paramFamily = url.param('family'),
                paramIndex = url.param('index'),
                paramProduct = url.param('product'),
                paramCategory = url.param('categoryid'),
                paramContent = url.param('content'),
                paramPopup = url.param('popup');
            contactSupport.initObj();
            _hiddenFamily.val('');
            _hiddenIndex.val('');
            _hiddenProduct.val('');
            _hiddenCategory.val('');
            _hiddenContent.val('');
            _hiddenPopup.val('');
            if (typeof paramFamily !== 'undefined') {
                _hiddenFamily.val(paramFamily);
                if (typeof paramIndex !== 'undefined') {
                    _hiddenIndex.val(paramIndex);
                }
                if (typeof paramProduct !== 'undefined') {
                    _hiddenProduct.val(paramProduct);
                    if (typeof paramCategory !== 'undefined') {
                        _hiddenCategory.val(paramCategory);
                        if (typeof paramContent !== 'undefined') {
                            _hiddenContent.val(paramContent);
                            if (typeof paramPopup !== 'undefined') {
                                _hiddenPopup.val(paramPopup);
                            }
                        }
                    }
                }
            }
            //update hidden iputs and then
            callback();
        },
        pushParams: function(isPush) {
            var selectedFamily = _hiddenFamily.val(),
                selectedIndex = _hiddenIndex.val(),
                selectedProduct = _hiddenProduct.val(),
                selectedCategory = _hiddenCategory.val(),
                selectedContent = _hiddenContent.val(),
                selectedPopup = _hiddenPopup.val(),
                urlPath = '';
            if (typeof selectedFamily !== 'undefined' && selectedFamily.length > 0) {
                urlPath += '&family=' + selectedFamily;
            }
            if (typeof selectedIndex !== 'undefined' && selectedIndex.length > 0) {
                urlPath += '&index=' + selectedIndex;
            }
            if (typeof selectedProduct !== 'undefined' && selectedProduct.length > 0) {
                urlPath += '&product=' + selectedProduct;
            }
            if (typeof selectedCategory !== 'undefined' && selectedCategory.length > 0) {
                urlPath += '&categoryid=' + selectedCategory;
            }
            if (typeof selectedContent !== 'undefined' && selectedContent.length > 0) {
                urlPath += '&content=' + selectedContent;
            }
            if (typeof selectedPopup !== 'undefined' && selectedPopup.length > 0) {
                urlPath += '&popup=' + selectedPopup;
            }
            // if (urlPath.length > 0) {
            //     urlPath = '?' + urlPath.substring(1, urlPath.length);
            // }
            if (typeof isPush === 'undefined') {
                History.pushState({
                    rand: Math.random(),
                    family: selectedFamily,
                    product: selectedProduct,
                    category: selectedCategory,
                    content: selectedContent
                }, document.title, '?' + urlPath);
            } else {
                History.replaceState({
                    rand: Math.random(),
                    family: selectedFamily,
                    product: selectedProduct,
                    category: selectedCategory,
                    content: selectedContent
                }, document.title, '?' + urlPath);
            }
        },
        removeDetailItemForMobile: function() {
            if (commonSetting.isMobile()) {
                $('.detail-item').remove();
            }
        }
    };
    return contactSupport;
}());
$(document).ready(function() {
    'use strict';
    contactSupport.updateHiddenInput(function() {
        $.when(contactSupport.restorePageStatus(false)).then(function() {
            contactSupport.scrollToLastSection();
        });
    });
});
$(window).bind('popstate', function(e) {
    'use strict';
    if (typeof e.originalEvent !== 'undefined') {
        //browser back or forword key
        contactSupport.updateHiddenInput(function() {
            $.when(contactSupport.restorePageStatus(true)).then(function() {
                contactSupport.scrollToLastSection();
            });
        });
    } else {
        contactSupport.updateHiddenInput(function() {
            $.when(contactSupport.setupClickStatus()).then(function() {
                contactSupport.scrollToLastSection();
            });
        });
    }
});
$(window).resize(function() {
    'use strict';
    commonSetting.forcePageReload();
});